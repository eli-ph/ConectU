import { randomUUID } from 'node:crypto';
import { getDatabase } from '@/server/db/sqlite';

export function compraTransaccion(fn){return getDatabase().transaction(fn).immediate();}
export function empresaComercial(usuarioId){return getDatabase().prepare(`SELECT e.id,e.nombre_comercial,u.email,e.estado_verificacion
 FROM EMPRESAS e JOIN USUARIOS u ON u.id=e.usuario_id
 WHERE u.id=? AND u.rol='empresa' AND u.activo=1`).get(usuarioId);}
export function planesComerciales(){return getDatabase().prepare(`SELECT id,nombre,precio_centavos,duracion_dias,limite_ofertas_activas,promociones_incluidas,dias_promocion_incluida FROM CATALOGO_PLANES WHERE activo=1 ORDER BY precio_centavos`).all();}
export function tarifasComerciales(){return getDatabase().prepare(`SELECT id,duracion_maxima_dias,costo_centavos FROM CATALOGO_PROMOCION WHERE activo=1 ORDER BY duracion_maxima_dias`).all();}
export function planPorId(id){return getDatabase().prepare('SELECT * FROM CATALOGO_PLANES WHERE id=? AND activo=1').get(id);}
export function tarifaPorId(id){return getDatabase().prepare('SELECT * FROM CATALOGO_PROMOCION WHERE id=? AND activo=1').get(id);}
export function consultarPlanActual(empresaId){return getDatabase().prepare(`SELECT s.id,s.fecha_inicio,s.fecha_fin,s.promociones_incluidas,s.promociones_usadas,p.nombre AS plan,p.limite_ofertas_activas
 FROM SUSCRIPCIONES s JOIN CATALOGO_PLANES p ON p.id=s.plan_id
 WHERE s.empresa_id=? AND s.estado='activa' AND datetime(s.fecha_inicio)<=datetime('now') AND datetime(s.fecha_fin)>datetime('now')
 ORDER BY s.id DESC LIMIT 1`).get(empresaId);}
export function cantidadOfertasPublicadas(empresaId){return getDatabase().prepare(`SELECT COUNT(*) AS total FROM OFERTAS WHERE empresa_id=? AND estado='publicada' AND date(fecha_vencimiento)>=date('now')`).get(empresaId).total;}
export function ofertasEmpresaPromocion(empresaId){return getDatabase().prepare(`SELECT o.id,o.titulo,o.estado,o.fecha_vencimiento,
 CASE WHEN EXISTS(SELECT 1 FROM PROMOCIONES p WHERE p.oferta_id=o.id AND p.estado='activa' AND datetime(p.fecha_inicio)<=datetime('now') AND datetime(p.fecha_fin)>datetime('now')) THEN 1 ELSE 0 END AS ocupada
 FROM OFERTAS o WHERE o.empresa_id=? AND o.estado!='eliminada' ORDER BY o.id DESC LIMIT 200`).all(empresaId);}
export function obtenerOfertaEmpresaParaCompra(empresaId,id){return getDatabase().prepare(`SELECT o.id,o.titulo,o.estado,o.fecha_vencimiento FROM OFERTAS o WHERE o.id=? AND o.empresa_id=?`).get(id,empresaId);}
export function obtenerPromocionEnCurso(ofertaId){return getDatabase().prepare(`SELECT 1 FROM PROMOCIONES WHERE oferta_id=? AND estado='activa' AND datetime(fecha_fin)>datetime('now') LIMIT 1`).get(ofertaId);}
export function compraPendienteEmpresa(empresaId){return getDatabase().prepare(`SELECT c.id,c.folio,c.url_proveedor,c.referencia_externa,c.monto_centavos,c.tipo,c.created_at
 FROM COMPRAS c JOIN ESTATUS_COMPRA ec ON ec.id=c.estatus_id
 LEFT JOIN SUSCRIPCIONES s ON s.id=c.suscripcion_id
 LEFT JOIN PROMOCIONES p ON p.id=c.promocion_id LEFT JOIN OFERTAS o ON o.id=p.oferta_id
 WHERE ec.clave='pendiente' AND (s.empresa_id=? OR o.empresa_id=?) ORDER BY c.id DESC LIMIT 1`).get(empresaId,empresaId);}
export function estatusId(clave){return getDatabase().prepare('SELECT id FROM ESTATUS_COMPRA WHERE clave=?').get(clave)?.id;}
export function crearIntencionCompra(empresaId, tipo, plan, oferta, tarifa){
 const db=getDatabase();const folio=`CU-${randomUUID().replaceAll('-','').toUpperCase().slice(0,18)}`;
 let relacionId, monto, descripcion;
 if(tipo==='plan'){
  relacionId=Number(db.prepare(`INSERT INTO SUSCRIPCIONES (empresa_id,plan_id,estado,expira_en) VALUES (?,?,'pendiente_pago',datetime('now','+30 minutes'))`).run(empresaId,plan.id).lastInsertRowid);
  monto=plan.precio_centavos;descripcion=`Plan ${plan.nombre} · ${plan.duracion_dias} días`;
 } else {
  relacionId=Number(db.prepare(`INSERT INTO PROMOCIONES(oferta_id,tarifa_promocion_id,origen,estado,expira_en) VALUES (?,?,'adicional','pendiente_pago',datetime('now','+30 minutes'))`).run(oferta.id,tarifa.id).lastInsertRowid);
  monto=tarifa.costo_centavos;descripcion=`Promoción adicional · ${tarifa.duracion_maxima_dias} días · ${oferta.titulo}`;
 }
 const compraId=Number(db.prepare(`INSERT INTO COMPRAS(folio,tipo,suscripcion_id,promocion_id,monto_centavos,moneda,estatus_id,proveedor)
 VALUES(?,?,?,?,?,'MXN',?,'stripe')`).run(folio,tipo,tipo==='plan'?relacionId:null,tipo==='promocion'?relacionId:null,monto,estatusId('pendiente')).lastInsertRowid);
 return {compraId,folio,monto,descripcion};
}
export function guardarCheckout(compraId,session){return getDatabase().prepare(`UPDATE COMPRAS SET referencia_externa=?,url_proveedor=? WHERE id=? AND referencia_externa IS NULL AND estatus_id=?`).run(session.id,session.url,compraId,estatusId('pendiente')).changes;}
export function compraPorId(id){return getDatabase().prepare(`SELECT c.*,ec.clave AS estatus,s.empresa_id AS plan_empresa,p.oferta_id,o.empresa_id AS promo_empresa,
 t.duracion_maxima_dias AS promo_dias,pl.duracion_dias AS plan_dias
 FROM COMPRAS c JOIN ESTATUS_COMPRA ec ON ec.id=c.estatus_id
 LEFT JOIN SUSCRIPCIONES s ON s.id=c.suscripcion_id LEFT JOIN CATALOGO_PLANES pl ON pl.id=s.plan_id
 LEFT JOIN PROMOCIONES p ON p.id=c.promocion_id LEFT JOIN CATALOGO_PROMOCION t ON t.id=p.tarifa_promocion_id
 LEFT JOIN OFERTAS o ON o.id=p.oferta_id WHERE c.id=?`).get(id);}
export function compraPorSesion(id){return getDatabase().prepare(`SELECT c.id,c.folio,c.tipo,c.monto_centavos,ec.clave AS estatus,
 COALESCE(s.empresa_id,o.empresa_id) AS empresa_id FROM COMPRAS c JOIN ESTATUS_COMPRA ec ON ec.id=c.estatus_id
 LEFT JOIN SUSCRIPCIONES s ON s.id=c.suscripcion_id LEFT JOIN PROMOCIONES p ON p.id=c.promocion_id LEFT JOIN OFERTAS o ON o.id=p.oferta_id WHERE c.referencia_externa=?`).get(id);}
export function yaProcesadoEvento(id){return !!getDatabase().prepare('SELECT 1 FROM STRIPE_WEBHOOK_EVENTOS WHERE event_id=?').get(id);}
export function registrarEvento(id,tipo){getDatabase().prepare(`INSERT INTO STRIPE_WEBHOOK_EVENTOS(event_id,tipo_evento,proveedor) VALUES (?,?,'stripe')`).run(id,tipo);}
export function marcarCompraFallida(compra){
 const db=getDatabase();db.prepare('UPDATE COMPRAS SET estatus_id=? WHERE id=?').run(estatusId('fallida'),compra.id);
 if(compra.tipo==='plan')db.prepare("UPDATE SUSCRIPCIONES SET estado='cancelada' WHERE id=? AND estado='pendiente_pago'").run(compra.suscripcion_id);
 else db.prepare("UPDATE PROMOCIONES SET estado='cancelada' WHERE id=? AND estado='pendiente_pago'").run(compra.promocion_id);
}
export function finalizarCompra(compra,paymentIntent){
 const db=getDatabase();if(compra.tipo==='plan'){
  // No se acumulan beneficios entre suscripciones: el plan nuevo reemplaza al anterior.
  const actual=db.prepare(`SELECT id FROM SUSCRIPCIONES WHERE empresa_id=? AND estado='activa'`).all(compra.plan_empresa);
  for(const row of actual) db.prepare("UPDATE SUSCRIPCIONES SET estado='cancelada' WHERE id=?").run(row.id);
  db.prepare(`UPDATE SUSCRIPCIONES SET estado='activa',fecha_inicio=datetime('now'),
    fecha_fin=datetime('now','+' || ? || ' days'),expira_en=NULL WHERE id=? AND estado='pendiente_pago'`)
    .run(compra.plan_dias,compra.suscripcion_id);
 } else {
  db.prepare(`UPDATE PROMOCIONES SET estado='activa',fecha_inicio=datetime('now'),
   fecha_fin=datetime('now','+' || ? || ' days'),expira_en=NULL WHERE id=? AND estado='pendiente_pago'`)
    .run(compra.promo_dias,compra.promocion_id);
 }
 db.prepare(`UPDATE COMPRAS SET estatus_id=?,verificado_en=datetime('now'),payment_intent_id=? WHERE id=?`)
  .run(estatusId('confirmada'),paymentIntent,compra.id);
}
export function marcarCompraReembolsada(compra,refund){
 const db=getDatabase();marcarCompraFallida(compra);
 db.prepare(`INSERT OR IGNORE INTO REEMBOLSOS(compra_id,referencia_externa,monto_centavos,motivo,estatus)
 VALUES (?,?,?,'requested_by_customer',?)`).run(compra.id,refund.id,refund.amount,refund.status==='succeeded'?'succeeded':refund.status);
 db.prepare('UPDATE COMPRAS SET estatus_id=?,verificado_en=datetime(\'now\'),payment_intent_id=? WHERE id=?')
  .run(estatusId('reembolsada'),refund.payment_intent||null,compra.id);
}
export function comprasPorEmpresa(empresaId){return getDatabase().prepare(`SELECT c.id,c.folio,c.tipo,c.monto_centavos,c.moneda,ec.clave AS estatus,c.created_at,c.verificado_en,
 p.nombre AS plan_nombre,t.duracion_maxima_dias AS dias_promocion,o.titulo AS oferta_titulo,
 c.referencia_externa,c.proveedor
 FROM COMPRAS c JOIN ESTATUS_COMPRA ec ON ec.id=c.estatus_id
 LEFT JOIN SUSCRIPCIONES s ON s.id=c.suscripcion_id LEFT JOIN CATALOGO_PLANES p ON p.id=s.plan_id
 LEFT JOIN PROMOCIONES pr ON pr.id=c.promocion_id LEFT JOIN CATALOGO_PROMOCION t ON t.id=pr.tarifa_promocion_id
 LEFT JOIN OFERTAS o ON o.id=pr.oferta_id WHERE (s.empresa_id=? OR o.empresa_id=?) AND ec.clave IN ('confirmada','reembolsada') ORDER BY c.id DESC LIMIT 250`).all(empresaId,empresaId);}
export function comprasAdministracion(){return getDatabase().prepare(`SELECT c.id,c.folio,c.tipo,c.monto_centavos,c.moneda,ec.clave AS estatus,c.created_at,c.verificado_en,
 e.nombre_comercial AS empresa_nombre, p.nombre AS plan_nombre,t.duracion_maxima_dias AS dias_promocion,o.titulo AS oferta_titulo,c.proveedor
 FROM COMPRAS c JOIN ESTATUS_COMPRA ec ON ec.id=c.estatus_id
 LEFT JOIN SUSCRIPCIONES s ON s.id=c.suscripcion_id LEFT JOIN PROMOCIONES pr ON pr.id=c.promocion_id
 LEFT JOIN OFERTAS o ON o.id=pr.oferta_id LEFT JOIN EMPRESAS e ON e.id=COALESCE(s.empresa_id,o.empresa_id)
 LEFT JOIN CATALOGO_PLANES p ON p.id=s.plan_id LEFT JOIN CATALOGO_PROMOCION t ON t.id=pr.tarifa_promocion_id
 WHERE ec.clave IN ('confirmada','reembolsada') ORDER BY c.id DESC LIMIT 500`).all();}
