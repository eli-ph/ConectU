import { randomUUID } from 'node:crypto';
import { getDatabase } from '@/server/db/sqlite';

export const conTransaccion=(fn)=>getDatabase().transaction(fn).immediate();
export const empresaPorUsuario=(id)=>getDatabase().prepare(`SELECT e.id,e.nombre_comercial,e.estado_verificacion,u.activo,u.email
 FROM EMPRESAS e JOIN USUARIOS u ON u.id=e.usuario_id WHERE u.id=? AND u.rol='empresa' AND u.activo=1`).get(id);
export const planPagadoVigente=(empresaId)=>getDatabase().prepare(`SELECT s.id,s.fecha_fin,p.nombre
 FROM SUSCRIPCIONES s JOIN CATALOGO_PLANES p ON p.id=s.plan_id
 WHERE s.empresa_id=? AND s.estado='activa' AND p.precio_centavos>0
 AND datetime(s.fecha_inicio)<=datetime('now') AND datetime(s.fecha_fin)>datetime('now')
 ORDER BY s.id DESC LIMIT 1`).get(empresaId);
export const buscarPlan=(id)=>getDatabase().prepare('SELECT * FROM CATALOGO_PLANES WHERE id=? AND activo=1 AND precio_centavos>0').get(id);
export const buscarTarifa=(id)=>getDatabase().prepare('SELECT * FROM CATALOGO_PROMOCION WHERE id=? AND activo=1 AND costo_centavos>0').get(id);
export const ofertasActivas=(empresaId)=>getDatabase().prepare(`SELECT COUNT(*) AS total FROM OFERTAS WHERE empresa_id=? AND estado='publicada' AND date(fecha_vencimiento)>=date('now')`).get(empresaId).total;
export const ofertaDelDueno=(empresaId,id)=>getDatabase().prepare('SELECT id,titulo,estado,fecha_vencimiento FROM OFERTAS WHERE empresa_id=? AND id=?').get(empresaId,id);
export const promocionVigente=(id)=>getDatabase().prepare(`SELECT id FROM PROMOCIONES WHERE oferta_id=? AND estado='activa' AND datetime(fecha_inicio)<=datetime('now') AND datetime(fecha_fin)>datetime('now') LIMIT 1`).get(id);
export const ofertaConCheckoutPendiente=(id,omitirIntentoId=null)=>getDatabase().prepare(`SELECT id FROM CHECKOUT_INTENTOS WHERE oferta_id=? AND estado='iniciada' AND id<>COALESCE(?,0) AND datetime(created_at,'+35 minutes')>datetime('now') LIMIT 1`).get(id,omitirIntentoId);

export function crearIntento(empresaId,tipo,plan,tarifa,oferta){
 const id=Number(getDatabase().prepare(`INSERT INTO CHECKOUT_INTENTOS(folio,empresa_id,tipo,plan_id,tarifa_id,oferta_id,monto_centavos)
 VALUES (?,?,?,?,?,?,?)`).run(`CU-${randomUUID().replaceAll('-','').slice(0,18).toUpperCase()}`,
 empresaId,tipo,plan?.id||null,tarifa?.id||null,oferta?.id||null,plan?.precio_centavos||tarifa?.costo_centavos).lastInsertRowid);
 return getDatabase().prepare('SELECT * FROM CHECKOUT_INTENTOS WHERE id=?').get(id);
}
export function guardarSesionIntento(id,session){
 return getDatabase().prepare(`UPDATE CHECKOUT_INTENTOS SET stripe_session_id=?,actualizado_en=CURRENT_TIMESTAMP
 WHERE id=? AND estado='iniciada' AND stripe_session_id IS NULL`).run(session.id,id).changes;
}
export const intentoPorId=(id)=>getDatabase().prepare('SELECT * FROM CHECKOUT_INTENTOS WHERE id=?').get(id);
export const intentoPorSesion=(sessionId)=>getDatabase().prepare('SELECT * FROM CHECKOUT_INTENTOS WHERE stripe_session_id=?').get(sessionId);
export const eventoProcesado=(id)=>!!getDatabase().prepare('SELECT 1 FROM STRIPE_WEBHOOK_EVENTOS WHERE event_id=?').get(id);
export const guardarEvento=(id,tipo)=>getDatabase().prepare(`INSERT INTO STRIPE_WEBHOOK_EVENTOS(event_id,tipo_evento,proveedor) VALUES (?,?,'stripe')`).run(id,tipo);
export function cerrarIntento(id,estado,paymentIntent=null,motivo=null){
 getDatabase().prepare(`UPDATE CHECKOUT_INTENTOS SET estado=?,payment_intent_id=COALESCE(?,payment_intent_id),motivo=?,actualizado_en=CURRENT_TIMESTAMP WHERE id=?`)
 .run(estado,paymentIntent,motivo,id);
}
export const estatusConfirmado=()=>getDatabase().prepare("SELECT id FROM ESTATUS_COMPRA WHERE clave='confirmada'").get()?.id;

export function confirmarIntento(intento,paymentIntent){
 const db=getDatabase();
 const confirmado=estatusConfirmado();if(!confirmado)throw new Error('Falta catálogo de estado de compra confirmada.');
 let relacionado;
 if(intento.tipo==='plan'){
   // La unicidad parcial de SUSCRIPCIONES se basa en estado='activa', incluso
   // si ya venció: actualizar estados antiguos antes de abrir un nuevo periodo.
   db.prepare(`UPDATE SUSCRIPCIONES SET estado='vencida'
     WHERE empresa_id=? AND estado='activa' AND datetime(fecha_fin)<=datetime('now')`).run(intento.empresa_id);
   const plan=buscarPlan(intento.plan_id);if(!plan)throw new Error('El plan dejó de estar disponible.');
   // El servicio comprobó la transición dentro de esta misma transacción.
   // El plan anterior se conserva en el historial, pero deja de estar activo.
   // Las promociones ya activadas viven en PROMOCIONES y no se modifican.
   db.prepare(`UPDATE SUSCRIPCIONES SET estado='cancelada'
     WHERE empresa_id=? AND estado='activa'`).run(intento.empresa_id);
   relacionado=Number(db.prepare(`INSERT INTO SUSCRIPCIONES(empresa_id,plan_id,fecha_inicio,fecha_fin,estado)
    VALUES (?,?,datetime('now'),datetime('now','+' || ? || ' days'),'activa')`).run(intento.empresa_id,plan.id,plan.duracion_dias).lastInsertRowid);
 }else{
   // La unicidad parcial de PROMOCIONES también mira 'activa' sin contemplar
   // que fecha_fin ya haya pasado.
   db.prepare(`UPDATE PROMOCIONES SET estado='vencida'
     WHERE oferta_id=? AND estado='activa' AND datetime(fecha_fin)<=datetime('now')`).run(intento.oferta_id);
   const tarifa=buscarTarifa(intento.tarifa_id);if(!tarifa)throw new Error('La promoción dejó de estar disponible.');
   // Compatibilidad con checkouts antiguos de 5B que reservaban la oferta al
   // entrar a Stripe. Tras cobrarse el nuevo checkout, se invalidan las reservas
   // anteriores SIN pagar; si alguna se paga más tarde el webhook 5B reembolsa.
   const legacy=db.prepare(`SELECT p.id AS promo_id,c.id AS compra_id FROM PROMOCIONES p
     JOIN COMPRAS c ON c.promocion_id=p.id JOIN ESTATUS_COMPRA ec ON ec.id=c.estatus_id
     WHERE p.oferta_id=? AND p.estado='pendiente_pago' AND ec.clave='pendiente'`).all(intento.oferta_id);
   const failedId=db.prepare("SELECT id FROM ESTATUS_COMPRA WHERE clave='fallida'").get()?.id;
   if(legacy.length&&!failedId)throw new Error('Falta estado de compra fallida.');
   for(const old of legacy){
     db.prepare('UPDATE COMPRAS SET estatus_id=? WHERE id=?').run(failedId,old.compra_id);
     db.prepare("UPDATE PROMOCIONES SET estado='cancelada' WHERE id=? AND estado='pendiente_pago'").run(old.promo_id);
   }
   relacionado=Number(db.prepare(`INSERT INTO PROMOCIONES(oferta_id,tarifa_promocion_id,origen,fecha_inicio,fecha_fin,estado)
    VALUES (?,?,'adicional',datetime('now'),datetime('now','+' || ? || ' days'),'activa')`).run(intento.oferta_id,tarifa.id,tarifa.duracion_maxima_dias).lastInsertRowid);
 }
 const compraId=Number(db.prepare(`INSERT INTO COMPRAS(folio,tipo,suscripcion_id,promocion_id,monto_centavos,moneda,estatus_id,proveedor,referencia_externa,payment_intent_id,verificado_en)
 VALUES (?,?,?,?,?,'MXN',?,'stripe',?,?,datetime('now'))`).run(intento.folio,intento.tipo,
 intento.tipo==='plan'?relacionado:null,intento.tipo==='promocion'?relacionado:null,intento.monto_centavos,confirmado,intento.stripe_session_id,paymentIntent).lastInsertRowid);
 db.prepare(`UPDATE CHECKOUT_INTENTOS SET estado='confirmada',compra_id=?,payment_intent_id=?,actualizado_en=CURRENT_TIMESTAMP WHERE id=?`).run(compraId,paymentIntent,intento.id);
 return compraId;
}

// Pago recibido pero no elegible: registrar el pago devuelto sin activar beneficios.
export function registrarReembolsoIntento(intento,paymentIntent,refund,motivo){
 const db=getDatabase();
 const estadoId=db.prepare("SELECT id FROM ESTATUS_COMPRA WHERE clave='reembolsada'").get()?.id;
 if(!estadoId)throw new Error('Falta el estado de compra reembolsada.');
 let relacionado;
 if(intento.tipo==='plan'){
   relacionado=Number(db.prepare("INSERT INTO SUSCRIPCIONES(empresa_id,plan_id,estado) VALUES (?,?,'cancelada')").run(intento.empresa_id,intento.plan_id).lastInsertRowid);
 }else{
   relacionado=Number(db.prepare("INSERT INTO PROMOCIONES(oferta_id,tarifa_promocion_id,origen,estado) VALUES (?,?,'adicional','cancelada')").run(intento.oferta_id,intento.tarifa_id).lastInsertRowid);
 }
 const compraId=Number(db.prepare(`INSERT INTO COMPRAS(folio,tipo,suscripcion_id,promocion_id,monto_centavos,moneda,estatus_id,proveedor,referencia_externa,payment_intent_id,verificado_en)
 VALUES(?,?,?,?,?,'MXN',?,'stripe',?,?,datetime('now'))`).run(intento.folio,intento.tipo,
 intento.tipo==='plan'?relacionado:null,intento.tipo==='promocion'?relacionado:null,intento.monto_centavos,estadoId,intento.stripe_session_id,paymentIntent).lastInsertRowid);
 db.prepare(`INSERT INTO REEMBOLSOS(compra_id,referencia_externa,monto_centavos,motivo,estatus)
 VALUES(?,?,?,'requested_by_customer',?)`).run(compraId,refund.id,refund.amount,refund.status);
 db.prepare(`UPDATE CHECKOUT_INTENTOS SET estado='reembolsada',compra_id=?,payment_intent_id=?,motivo=?,actualizado_en=CURRENT_TIMESTAMP WHERE id=?`)
  .run(compraId,paymentIntent,motivo,intento.id);
 return compraId;
}
