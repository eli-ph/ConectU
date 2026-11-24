// Las filas comerciales se crean SOLO después de verificar el webhook firmado y el pago.
import { ErrorDeNegocio } from '@/server/services/auth.service';
import { crearCheckout, reembolsarPago } from '@/server/integrations/stripe-checkout';
import {
  conTransaccion, empresaPorUsuario, planPagadoVigente,buscarPlan,buscarTarifa,ofertasActivas,
  ofertaDelDueno,promocionVigente,crearIntento,guardarSesionIntento,intentoPorId,intentoPorSesion,
  eventoProcesado,guardarEvento,cerrarIntento,confirmarIntento,registrarReembolsoIntento
} from '@/server/repositories/checkout-intentos.repository';
function fail(message,status=400){throw new ErrorDeNegocio(message,status);}
function id(value){const n=Number(value);if(!Number.isSafeInteger(n)||n<1||n>2147483647)fail('Identificador inválido.');return n;}
function empresa(user){
 if(!user||user.rol!=='empresa')fail('Inicia sesión como empresa.',401);
 const e=empresaPorUsuario(user.id);
 if(!e||e.estado_verificacion!=='aprobada'||e.activo!==1)fail('La empresa debe estar aprobada y activa.',403);
 return e;
}
function promoFechaLimite(dias){
 // Se exige un día de margen para evitar cobros con la oferta a punto de vencer.
 return new Date(Date.now()+(dias+1)*86400000).toISOString().slice(0,10);
}
// Regla comercial única para catálogo, creación y confirmación del Checkout.
const clavePlan=(nombre)=>String(nombre||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
export function puedeContratarPlan(actual,plan){
 return !!plan && plan.precio_centavos>0 && (!actual || (clavePlan(actual.nombre)==='basico' && clavePlan(plan.nombre)==='premium'));
}
function bloqueoPlan(actual){return `Ya cuentas con un plan ${actual.nombre} vigente. ${clavePlan(actual.nombre)==='basico'?'Solo puedes cambiar a Premium antes de que termine.':`Podrás contratar otro cuando termine el ${actual.fecha_fin.slice(0,10)}.`}`;}
function elegible(intento){
 const e=empresaPorUsuarioPorId(intento.empresa_id);
 if(!e||e.estado_verificacion!=='aprobada'||e.activo!==1)return 'La empresa ya no está aprobada o activa.';
 if(intento.tipo==='plan'){
   const plan=buscarPlan(intento.plan_id);
   if(!plan||plan.precio_centavos!==intento.monto_centavos)return 'Las condiciones del plan cambiaron.';
   const actual=planPagadoVigente(intento.empresa_id);
   if(!puedeContratarPlan(actual,plan))return bloqueoPlan(actual);
   if(plan.limite_ofertas_activas!=null&&ofertasActivas(intento.empresa_id)>plan.limite_ofertas_activas)return 'La capacidad del nuevo plan es insuficiente.';
 }else{
   const rate=buscarTarifa(intento.tarifa_id);
   if(!rate||rate.costo_centavos!==intento.monto_centavos)return 'Las condiciones de la promoción cambiaron.';
   const oferta=ofertaDelDueno(intento.empresa_id,intento.oferta_id);
   if(!oferta||oferta.estado!=='publicada'||!oferta.fecha_vencimiento||oferta.fecha_vencimiento<promoFechaLimite(rate.duracion_maxima_dias))return 'La oferta dejó de ser elegible.';
   if(promocionVigente(oferta.id))return 'La oferta ya tiene una promoción activa.';
 }
 return null;
}
// No se confía en IDs empresariales suministrados por el cliente.
import { getDatabase } from '@/server/db/sqlite';
function empresaPorUsuarioPorId(id){return getDatabase().prepare('SELECT e.id,e.estado_verificacion,u.activo FROM EMPRESAS e JOIN USUARIOS u ON u.id=e.usuario_id WHERE e.id=?').get(id);}

export function estadoIntento(user,sessionId){
 const e=empresa(user);
 if(typeof sessionId!=='string'||!/^cs_test_[A-Za-z0-9]+$/.test(sessionId))fail('Referencia de Checkout inválida.');
 const row=intentoPorSesion(sessionId);
 if(!row||row.empresa_id!==e.id)fail('Operación no encontrada.',404);
 return {estatus:({iniciada:'pendiente',confirmada:'confirmada',expirada:'fallida',reembolsada:'reembolsada',reembolso_pendiente:'fallida'})[row.estado]||'pendiente',folio:row.folio,tipo:row.tipo};
}

export async function iniciarCheckoutNuevo(user,body,requestOrigin){
 const e=empresa(user);
 if(!body||typeof body!=='object'||Array.isArray(body))fail('Solicitud inválida.');
 if(!['plan','promocion'].includes(body.tipo))fail('Operación comercial inválida.');
 const intento=conTransaccion(()=>{
   let plan=null,tarifa=null,oferta=null;
   if(body.tipo==='plan'){
     // Solo se permite subir de Básico a Premium durante un periodo pagado.
     const actual=planPagadoVigente(e.id);
     plan=buscarPlan(id(body.planId));
     if(!plan)fail('Selecciona un plan de pago vigente.');
     if(!puedeContratarPlan(actual,plan))fail(bloqueoPlan(actual),409);
     if(plan.limite_ofertas_activas!=null&&ofertasActivas(e.id)>plan.limite_ofertas_activas)fail('Este plan no cubre tus ofertas activas.',409);
   }else{
     tarifa=buscarTarifa(id(body.tarifaId));
     if(!tarifa)fail('Selecciona una tarifa válida.');
     oferta=ofertaDelDueno(e.id,id(body.ofertaId));
     if(!oferta)fail('La oferta no pertenece a tu empresa.',404);
     if(oferta.estado!=='publicada'||!oferta.fecha_vencimiento||oferta.fecha_vencimiento<promoFechaLimite(tarifa.duracion_maxima_dias))fail('La oferta debe estar publicada y tener suficiente vigencia.',409);
     if(promocionVigente(oferta.id))fail('La oferta ya cuenta con una promoción activa.',409);
     // Los intentos abandonados NO bloquean volver a comprar. Al pagar dos sesiones
     // para la misma oferta se activa solo la primera y se reembolsa la segunda.
   }
   return crearIntento(e.id,body.tipo,plan,tarifa,oferta);
 });
 try{
   const nombre=intento.tipo==='plan'?`Plan ${buscarPlan(intento.plan_id).nombre}`:`Promoción ${buscarTarifa(intento.tarifa_id).duracion_maxima_dias} días · ${ofertaDelDueno(e.id,intento.oferta_id).titulo}`;
   const checkout=await crearCheckout({intentoId:intento.id,folio:intento.folio,nombre,
     importe:intento.monto_centavos,email:e.email,requestOrigin});
   if(!/^cs_test_[A-Za-z0-9]+$/.test(checkout.id||'')||!/^https:\/\/checkout\.stripe\.com\//.test(checkout.url||''))throw new Error('Stripe devolvió una sesión inesperada.');
   conTransaccion(()=>guardarSesionIntento(intento.id,checkout));
   return {url:checkout.url};
 }catch(error){
   // Nunca generamos COMPRAS/SUSCRIPCIONES/PROMOCIONES en una operación fallida.
   conTransaccion(()=>cerrarIntento(intento.id,'expirada',null,'No se pudo crear Checkout'));
   console.error('[ConectU] No se pudo preparar Checkout:',error?.stripeCode||error?.message);
   if(error instanceof ErrorDeNegocio)throw error;
   throw new ErrorDeNegocio('No pudimos abrir Stripe. Revisa la terminal de Next.js.',503);
 }
}

export async function procesarWebhookNuevo(event){
 const tipo=event.type;
 if(!['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.expired','checkout.session.async_payment_failed'].includes(tipo))return {ignored:true};
 const session=event.data.object;
 const token=Number(session?.metadata?.conectu_intento_id);
 if(!Number.isSafeInteger(token)||token<=0)return null; // Pago histórico de la Etapa 5B.
 if(session.object!=='checkout.session'||!/^cs_test_[A-Za-z0-9]+$/.test(session.id||''))throw new Error('Sesión Stripe inválida.');
 const intento=intentoPorId(token);
 if(!intento||intento.folio!==session.client_reference_id||intento.folio!==session.metadata.conectu_folio||
    (intento.stripe_session_id&&intento.stripe_session_id!==session.id)||session.currency!=='mxn'||
    session.amount_total!==intento.monto_centavos||session.mode!=='payment'||session.livemode!==false)
   throw new Error('Datos de Checkout inconsistentes. No se concederán beneficios.');
 if(eventoProcesado(event.id))return {already:true};
 if(intento.estado==='reembolso_pendiente'){
   conTransaccion(()=>{if(!eventoProcesado(event.id))guardarEvento(event.id,tipo);});return {refundPending:true};
 }
 if(intento.estado==='confirmada'||intento.estado==='reembolsada'){
   conTransaccion(()=>{if(!eventoProcesado(event.id))guardarEvento(event.id,tipo);});return {already:true};
 }
 if(tipo==='checkout.session.completed'&&session.payment_status!=='paid')return {pending:true};
 if(tipo==='checkout.session.expired'||tipo==='checkout.session.async_payment_failed'){
   conTransaccion(()=>{
     if(eventoProcesado(event.id))return;
     const current=intentoPorId(intento.id);
     if(current.estado==='iniciada')cerrarIntento(intento.id,'expirada',null,'Checkout expirado o fallido');
     guardarEvento(event.id,tipo);
   });return {expired:true};
 }
 if(session.payment_status!=='paid')return {pending:true};
 const paymentIntent=session.payment_intent;
 if(typeof paymentIntent!=='string'||!/^pi_[A-Za-z0-9]+$/.test(paymentIntent))throw new Error('Falta PaymentIntent confirmado.');
 // La confirmación puede llegar después de que el usuario haya iniciado otro Checkout.
 const invalid=conTransaccion(()=>{
   const current=intentoPorId(intento.id);
   if(current.stripe_session_id==null){
     guardarSesionIntento(current.id,{id:session.id});
   }
   return current.estado==='expirada'?'El Checkout fue cancelado o expiró.':elegible(current);
 });
 if(invalid){
   // Se cobró pero la oferta/plan ya no es elegible: devolver sin crear COMPRAS.
   // Ante fallos temporales de Stripe, webhook devuelve 500 y Stripe reintentará.
   const refund=await reembolsarPago({paymentIntent,compraId:`intento-${intento.id}`});
   conTransaccion(()=>{
     if(eventoProcesado(event.id))return;
     if(refund.status==='succeeded')registrarReembolsoIntento(intentoPorId(intento.id),paymentIntent,refund,invalid);
     else cerrarIntento(intento.id,'reembolso_pendiente',paymentIntent,invalid);
     guardarEvento(event.id,tipo);
   });return {refunded:true};
 }
 return conTransaccion(()=>{
   if(eventoProcesado(event.id))return {already:true};
   const current=intentoPorId(intento.id);
   if(current.estado==='confirmada'){guardarEvento(event.id,tipo);return {already:true};}
   if(current.estado!=='iniciada')throw new Error('Cambio inesperado en el estado del Checkout.');
   const problem=elegible(current);
   if(problem)throw new Error(`El pedido cambió antes de confirmarse: ${problem}`); // reintento seguro; se reembolsa en próximo evento
   const compraId=confirmarIntento(current,paymentIntent);
   guardarEvento(event.id,tipo);
   return {confirmed:true,compraId};
 });
}
