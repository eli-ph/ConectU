import { ErrorDeNegocio } from '@/server/services/auth.service';
import { reembolsarPago } from '@/server/integrations/stripe-checkout';
import { iniciarCheckoutNuevo, procesarWebhookNuevo, estadoIntento, puedeContratarPlan } from '@/server/services/checkout-intentos.service';
import { planPagadoVigente, intentoPorSesion } from '@/server/repositories/checkout-intentos.repository';
import {
 compraTransaccion,empresaComercial,planesComerciales,tarifasComerciales,planPorId,tarifaPorId,
 consultarPlanActual,cantidadOfertasPublicadas,ofertasEmpresaPromocion,obtenerOfertaEmpresaParaCompra,
 obtenerPromocionEnCurso,compraPendienteEmpresa,crearIntencionCompra,guardarCheckout,compraPorId,
 compraPorSesion,yaProcesadoEvento,registrarEvento,marcarCompraFallida,finalizarCompra,
 marcarCompraReembolsada,comprasPorEmpresa,comprasAdministracion
} from '@/server/repositories/compras.repository';

function fallo(mensaje,estado=400){throw new ErrorDeNegocio(mensaje,estado);}
function enteroId(v){const n=Number(v);if(!Number.isSafeInteger(n)||n<1||n>2147483647)fallo('Identificador inválido.');return n;}
function empresaAprobada(user){
 if(!user||user.rol!=='empresa')fallo('Inicia sesión como empresa.',401);
 const empresa=empresaComercial(user.id);
 if(!empresa||empresa.estado_verificacion!=='aprobada')fallo('La empresa debe estar aprobada.',403);
 return empresa;
}
export function catalogoCompras(user){
 const empresa=empresaAprobada(user);
 const planPagado=planPagadoVigente(empresa.id);
 const planes=planesComerciales().map(plan=>({...plan,puedeContratar:puedeContratarPlan(planPagado,plan)}));
 return {planes,tarifas:tarifasComerciales(),actual:consultarPlanActual(empresa.id),planPagado,
  ofertasActivas:cantidadOfertasPublicadas(empresa.id),ofertas:ofertasEmpresaPromocion(empresa.id)};
}
export function misComprasEmpresa(user){const empresa=empresaAprobada(user);return comprasPorEmpresa(empresa.id);}
export function listadoComprasAdministrador(user){if(!user||user.rol!=='admin')fallo('Acceso exclusivo de administración.',403);return comprasAdministracion();}
export function estadoCompraEmpresa(user,sessionId){
 const empresa=empresaAprobada(user);
 if(typeof sessionId!=='string'||!/^cs_test_[a-zA-Z0-9]+$/.test(sessionId))fallo('Referencia de compra inválida.');
 if(intentoPorSesion(sessionId))return estadoIntento(user,sessionId);
 const row=compraPorSesion(sessionId);
 if(!row||row.empresa_id!==empresa.id)fallo('Compra no encontrada.',404);
 return {estatus:row.estatus,folio:row.folio,tipo:row.tipo};
}

// Las nuevas compras NO se insertan hasta recibir el webhook firmado.
// El registro técnico temporal vive exclusivamente en CHECKOUT_INTENTOS.
export async function iniciarCheckoutEmpresa(user,payload,requestOrigin){
 return iniciarCheckoutNuevo(user,payload,requestOrigin);
}

function elegibilidadFinal(compra){
 if(compra.estatus!=='pendiente')return {ok:false,razon:'La compra ya no está pendiente.'};
 const empresaId=compra.tipo==='plan'?compra.plan_empresa:compra.promo_empresa;
 const empresa=empresaComercialPorIdLocal(empresaId);
 if(!empresa||empresa.estado_verificacion!=='aprobada'||empresa.activo!==1)return {ok:false,razon:'La empresa dejó de estar aprobada o está deshabilitada.'};
 if(compra.tipo==='plan'){
  const db=getDatabaseLocal();
  const plan=db.prepare('SELECT * FROM CATALOGO_PLANES WHERE activo=1 AND id=(SELECT plan_id FROM SUSCRIPCIONES WHERE id=?)').get(compra.suscripcion_id);
  if(!puedeContratarPlan(planPagadoVigente(empresaId),plan))return {ok:false,razon:'El cambio de plan ya no está permitido.'};
  const cap=plan.limite_ofertas_activas;
  if(cap!=null&&cantidadOfertasPublicadas(empresaId)>cap)return {ok:false,razon:'El plan ya no cubre las ofertas activas.'};
 }else{
  const oferta=obtenerOfertaEmpresaParaCompra(empresaId,compra.oferta_id);
  const limite=new Date(Date.now()+compra.promo_dias*86400000).toISOString().slice(0,10);
  if(!oferta||oferta.estado!=='publicada'||!oferta.fecha_vencimiento||oferta.fecha_vencimiento<limite)
   return {ok:false,razon:'La oferta dejó de estar vigente para la promoción.'};
  // Una activación incluida puede ocurrir mientras el pago adicional está en Checkout.
  // El pago ya realizado se reembolsa si esa oferta obtuvo una promoción activa.
  const coincidente=getDatabaseLocal().prepare(`SELECT 1 FROM PROMOCIONES WHERE oferta_id=?
    AND id<>? AND estado='activa' AND datetime(fecha_fin)>datetime('now') LIMIT 1`)
    .get(compra.oferta_id,compra.promocion_id);
  if(coincidente)return {ok:false,razon:'La oferta recibió otra promoción durante el pago.'};
 }
 return {ok:true};
}
// Acceso auxiliar: no se confía en datos de la sesión enviada por cliente.
import { getDatabase as getDatabaseLocal } from '@/server/db/sqlite';
function empresaComercialPorIdLocal(id){return getDatabaseLocal().prepare('SELECT e.id,e.estado_verificacion,u.activo FROM EMPRESAS e JOIN USUARIOS u ON u.id=e.usuario_id WHERE e.id=?').get(id);}

/** Solo ejecutar tras verificar HMAC del webhook y confirmar payment_status=paid. */
export async function procesarEventoStripe(event){
 const nuevo=await procesarWebhookNuevo(event);
 if(nuevo !== null)return nuevo;
 const tipo=event.type;
 if(!['checkout.session.completed','checkout.session.expired','checkout.session.async_payment_failed','checkout.session.async_payment_succeeded'].includes(tipo))return {ignored:true};
 const session=event.data.object;
 // La cuenta Stripe puede recibir otros cobros: no reintentamos webhooks ajenos a ConectU.
 if(!session.metadata?.conectu_compra_id || !session.metadata?.conectu_folio)return {ignored:true};
 if(session.object!=='checkout.session'||!/^cs_test_[A-Za-z0-9]+$/.test(session.id||''))throw new Error('Sesión Stripe inválida.');
 const compraId=Number(session.metadata?.conectu_compra_id);
 const compra=compraPorId(compraId);
 if(!compra||compra.referencia_externa!==session.id||compra.folio!==session.client_reference_id||
    session.metadata?.conectu_folio!==compra.folio||session.currency!=='mxn'||session.amount_total!==compra.monto_centavos||session.mode!=='payment'||session.livemode!==false)
   throw new Error('Los datos del pago no coinciden con la compra registrada.');
 if(tipo==='checkout.session.completed'&&session.payment_status!=='paid')return {pending:true};
 if((tipo==='checkout.session.completed'||tipo==='checkout.session.async_payment_succeeded')&&session.payment_status==='paid'){
   if(compra.estatus==='confirmada'||compra.estatus==='reembolsada'){
     compraTransaccion(()=>{if(!yaProcesadoEvento(event.id))registrarEvento(event.id,tipo);});return {already:true};
   }
   const paymentIntent=session.payment_intent;
   if(typeof paymentIntent!=='string'||!/^pi_[A-Za-z0-9]+$/.test(paymentIntent))throw new Error('Falta referencia de PaymentIntent.');
   // Puede llegar una confirmación retrasada después de un evento de expiración/fallo.
   // En ese caso devolvemos el cargo sin conceder beneficios.
   if(compra.estatus==='fallida'){
     const refund=await reembolsarPago({paymentIntent,compraId:compra.id});
     compraTransaccion(()=>{
       const actual=compraPorId(compra.id);
       if(actual.estatus==='fallida')marcarCompraReembolsada(actual,refund);
       if(!yaProcesadoEvento(event.id))registrarEvento(event.id,tipo);
     });
     return {refunded:true};
   }
   if(compra.estatus!=='pendiente')throw new Error('Se recibió un pago para una compra no pendiente: requiere conciliación.');
   const elegible=elegibilidadFinal(compra);
   if(!elegible.ok){
     // Si la oferta cambió durante el checkout, devolver el importe y NO activar la promoción.
     const refund=await reembolsarPago({paymentIntent,compraId:compra.id});
     compraTransaccion(()=>{
       if(yaProcesadoEvento(event.id))return;
       marcarCompraReembolsada(compra,refund);
       registrarEvento(event.id,tipo);
     });
     return {refunded:true};
   }
   compraTransaccion(()=>{
     if(yaProcesadoEvento(event.id))return;
     const current=compraPorId(compra.id);
     if(current.estatus!=='pendiente')return;
     const recent=elegibilidadFinal(current);
     if(!recent.ok)throw new Error('La oferta cambió antes de activar el pago; requiere conciliación.');
     finalizarCompra(current,paymentIntent);
     registrarEvento(event.id,tipo);
   });
   return {activated:true};
 }
 if(tipo==='checkout.session.expired'||tipo==='checkout.session.async_payment_failed'){
   compraTransaccion(()=>{
     if(yaProcesadoEvento(event.id))return;
     const current=compraPorId(compra.id);
     if(current.estatus==='pendiente')marcarCompraFallida(current);
     registrarEvento(event.id,tipo);
   });
   return {canceled:true};
 }
 return {ignored:true};
}
