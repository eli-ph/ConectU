/**
 * Etapa 6A — Observer real: los triggers guardan eventos duraderos, el bus
 * distribuye por tipo, y sus observers insertan notificaciones/correos en la
 * misma transacción de procesamiento. No hay email ni HTTP dentro de SQL.
 * Importable desde Next.js y desde scripts Node (sin alias @/).
 */
export class EventBus {
  constructor() { this.handlers = new Map(); }
  subscribe(type, handler) {
    if (!this.handlers.has(type)) this.handlers.set(type, []);
    this.handlers.get(type).push(handler);
    return () => this.handlers.set(type, this.handlers.get(type).filter(fn => fn !== handler));
  }
  emit(type, event, context) {
    for (const fn of this.handlers.get(type) || []) fn(event, context);
  }
}

function one(db, sql, ...args) { return db.prepare(sql).get(...args); }
function all(db, sql, ...args) { return db.prepare(sql).all(...args); }
function run(db, sql, ...args) { return db.prepare(sql).run(...args); }
function enTx(db, fn) {
  db.exec('BEGIN IMMEDIATE');
  try { const output = fn(); db.exec('COMMIT'); return output; }
  catch (error) { db.exec('ROLLBACK'); throw error; }
}
function nombre(user) {
  return [user?.nombre, user?.apellidos].filter(Boolean).join(' ').trim() || 'Una persona';
}
function recortar(value,max=130) {
  const clean=String(value||'').replace(/[\r\n\t]+/g,' ').trim();
  return clean.length>max ? clean.slice(0,max-1)+'…' : clean;
}
function notificar(db,event,userId,{titulo,mensaje,url,tipo=event.tipo,correo=false}) {
  if (!Number.isSafeInteger(Number(userId)) || Number(userId)<=0) return;
  // La URL solo admite rutas internas, jamás enlaces externos del evento.
  const safeUrl = typeof url==='string' && /^\/(?!\/)[\w\-/?=&%.]*$/.test(url) ? url : '/';
  run(db, `INSERT OR IGNORE INTO NOTIFICACIONES
     (usuario_id,evento_id,tipo,titulo,mensaje,url) VALUES (?,?,?,?,?,?)`,
     Number(userId),event.id,tipo,recortar(titulo,140),recortar(mensaje,700),safeUrl);
  if (!correo) return;
  const recipient=one(db,`SELECT email,email_verificado,activo FROM USUARIOS WHERE id=?`,userId);
  if (!recipient || Number(recipient.email_verificado)!==1 || Number(recipient.activo)!==1) return;
  const notification=one(db,`SELECT id FROM NOTIFICACIONES WHERE evento_id=? AND usuario_id=?`,event.id,Number(userId));
  if (!notification) return;
  run(db,`INSERT OR IGNORE INTO NOTIFICACIONES_CORREO(notificacion_id,destinatario,asunto,cuerpo)
    VALUES(?,?,?,?)`,notification.id,recipient.email,recortar(titulo,140),
    `${recortar(mensaje,700)}\n\nEntra a ConectU para consultar los detalles.\n${safeUrl}`);
}
function adminIds(db) {
  return all(db,`SELECT id FROM USUARIOS WHERE rol='admin' AND activo=1`);
}
function empresaInfo(db,empresaId) {
  return one(db,`SELECT e.id,e.nombre_comercial,e.usuario_id,e.estado_verificacion
    FROM EMPRESAS e WHERE e.id=?`,empresaId);
}
function detallesPostulacion(db,id) {
  return one(db,`SELECT p.id,p.estado,p.mensaje,p.oferta_id,o.titulo AS oferta,
    e.usuario_id AS empresa_usuario_id,s.usuario_id AS estudiante_usuario_id,
    u.nombre,u.apellidos FROM POSTULACIONES p
    JOIN OFERTAS o ON o.id=p.oferta_id JOIN EMPRESAS e ON e.id=o.empresa_id
    JOIN ESTUDIANTES s ON s.id=p.estudiante_id
    JOIN USUARIOS u ON u.id=s.usuario_id WHERE p.id=?`,id);
}

export function crearObservadores(db) {
  const bus=new EventBus();
  bus.subscribe('empresa.registrada',(event)=>{
    const emp=empresaInfo(db,event.entidad_id); if(!emp)return;
    for(const admin of adminIds(db))notificar(db,event,admin.id,{
      titulo:'Nueva empresa por revisar',mensaje:`${recortar(emp.nombre_comercial)} ha solicitado unirse a ConectU.`,
      url:'/admin/empresas',correo:false,
    });
  });
  bus.subscribe('empresa.estado',(event)=>{
    const emp=empresaInfo(db,event.entidad_id); if(!emp)return;
    const states={aprobada:['Empresa aprobada','Tu empresa fue aprobada. Ya puedes publicar ofertas y contratar planes.'],
      rechazada:['Solicitud no aprobada','La revisión de tu empresa ha finalizado. Consulta tu cuenta para conocer la resolución.'],
      suspendida:['Cuenta empresarial suspendida','Tu cuenta empresarial fue suspendida. Consulta la información de tu cuenta.'],
      pendiente:['Empresa en revisión','Tu empresa ha vuelto a revisión administrativa.']};
    const [titulo,mensaje]=states[event.dato]||['Actualización de empresa','La situación de tu empresa cambió.'];
    notificar(db,event,emp.usuario_id,{titulo,mensaje,url:'/empresa/cuenta',correo:event.dato!=='pendiente'});
  });
  bus.subscribe('oferta.publicada',(event)=>{
    const oferta=one(db,`SELECT o.titulo,e.nombre_comercial FROM OFERTAS o
      JOIN EMPRESAS e ON e.id=o.empresa_id WHERE o.id=?`,event.entidad_id);
    if(!oferta)return;
    for(const admin of adminIds(db))notificar(db,event,admin.id,{
      titulo:'Nueva oferta publicada',mensaje:`${recortar(oferta.nombre_comercial)} publicó «${recortar(oferta.titulo)}».`,
      url:'/admin/ofertas',correo:false,
    });
  });
  bus.subscribe('postulacion.creada',(event)=>{
    const p=detallesPostulacion(db,event.entidad_id);if(!p)return;
    notificar(db,event,p.empresa_usuario_id,{
      titulo:'Nueva postulación recibida',
      mensaje:`${recortar(nombre(p))} se postuló a «${recortar(p.oferta)}».`,
      url:`/empresa/postulaciones/${p.id}`,correo:true,
    });
    notificar(db,event,p.estudiante_usuario_id,{
      titulo:'Postulación enviada',mensaje:`Tu postulación a «${recortar(p.oferta)}» fue registrada.`,
      url:'/estudiante/postulaciones',correo:false,
    });
  });
  bus.subscribe('postulacion.estado',(event)=>{
    const p=detallesPostulacion(db,event.entidad_id);if(!p)return;
    const states={en_revision:['Postulación en revisión','La empresa está revisando tu postulación.'],
      aceptada:['¡Postulación aceptada!','La empresa aceptó tu postulación. Revisa sus detalles.'],
      rechazada:['Actualización de postulación','La empresa no continuó con tu postulación.'],
      retirada:['Postulación retirada','Tu postulación fue retirada.'],
      cerrada:['Postulación cerrada','La convocatoria finalizó y tu postulación quedó cerrada.']};
    const [titulo,desc]=states[event.dato]||['Estado de postulación actualizado','Consulta tus postulaciones.'];
    notificar(db,event,p.estudiante_usuario_id,{titulo,mensaje:`${desc} Oferta: «${recortar(p.oferta)}».`,
      url:'/estudiante/postulaciones',correo:['aceptada','rechazada'].includes(event.dato)});
  });
  bus.subscribe('compra.confirmada',(event)=>{
    const c=one(db,`SELECT c.folio,c.tipo,c.monto_centavos,e.usuario_id,
      pl.nombre AS plan_nombre,o.titulo AS oferta
      FROM COMPRAS c LEFT JOIN SUSCRIPCIONES s ON s.id=c.suscripcion_id
      LEFT JOIN CATALOGO_PLANES pl ON pl.id=s.plan_id
      LEFT JOIN PROMOCIONES p ON p.id=c.promocion_id
      LEFT JOIN OFERTAS o ON o.id=p.oferta_id
      JOIN EMPRESAS e ON e.id=COALESCE(s.empresa_id,o.empresa_id)
      WHERE c.id=?`,event.entidad_id);
    if(!c)return;
    const info=c.tipo==='plan' ? `Plan ${c.plan_nombre||'empresarial'}` : `Promoción de «${recortar(c.oferta)}»`;
    notificar(db,event,c.usuario_id,{titulo:'Pago confirmado',
      mensaje:`Se confirmó tu compra ${c.folio}: ${info}.`,url:'/empresa/compras',correo:true});
  });
  bus.subscribe('promocion.incluida',(event)=>{
    const p=one(db,`SELECT o.titulo,e.usuario_id FROM PROMOCIONES p
      JOIN OFERTAS o ON o.id=p.oferta_id JOIN EMPRESAS e ON e.id=o.empresa_id WHERE p.id=?`,event.entidad_id);
    if(!p)return;
    notificar(db,event,p.usuario_id,{titulo:'Promoción incluida activada',
      mensaje:`Se activó una promoción incluida para «${recortar(p.titulo)}».`,url:'/empresa/plan',correo:false});
  });
  return bus;
}

/** Idempotente y seguro ante dos procesos Next.js trabajando en paralelo. */
export function procesarEventos(db,limit=100) {
  const max=Math.min(200,Math.max(1,Number(limit)||100));
  // No tomar un candado de escritura cuando no hay eventos pendientes.
  // El procesamiento de los eventos reales sigue protegido por BEGIN IMMEDIATE.
  if (!one(db,'SELECT 1 AS pendiente FROM EVENTOS_DOMINIO WHERE procesado_at IS NULL LIMIT 1')) return 0;
  return enTx(db,()=>{
    const pending=all(db,`SELECT id,tipo,entidad_id,dato FROM EVENTOS_DOMINIO
      WHERE procesado_at IS NULL ORDER BY id ASC LIMIT ?`,max);
    const bus=crearObservadores(db);
    for(const ev of pending){
      bus.emit(ev.tipo,ev,{db});
      run(db,'UPDATE EVENTOS_DOMINIO SET procesado_at=CURRENT_TIMESTAMP WHERE id=? AND procesado_at IS NULL',ev.id);
    }
    return pending.length;
  });
}

export function listarNotificaciones(db,usuarioId,limit=40) {
  const usuario=Number(usuarioId);
  const items=all(db,`SELECT id,tipo,titulo,mensaje,url,leida,created_at FROM NOTIFICACIONES
    WHERE usuario_id=? ORDER BY id DESC LIMIT ?`,usuario,Math.min(100,Math.max(1,Number(limit)||40)));
  const cantidad=one(db,'SELECT COUNT(*) AS n FROM NOTIFICACIONES WHERE usuario_id=? AND leida=0',usuario)?.n||0;
  return {items,noLeidas:cantidad};
}
export function marcarLeidas(db,usuarioId,identificador=null) {
  const uid=Number(usuarioId);
  if(identificador===null) return run(db,'UPDATE NOTIFICACIONES SET leida=1 WHERE usuario_id=? AND leida=0',uid).changes;
  const id=Number(identificador);
  if(!Number.isSafeInteger(id)||id<1)throw new Error('Identificador de notificación inválido.');
  return run(db,'UPDATE NOTIFICACIONES SET leida=1 WHERE id=? AND usuario_id=?',id,uid).changes;
}

export function reclamarCorreos(db,limit=10) {
  return enTx(db,()=>{
    const jobs=all(db,`SELECT id,notificacion_id,destinatario,asunto,cuerpo,intentos
      FROM NOTIFICACIONES_CORREO
      WHERE ((estado IN ('pendiente','fallido') AND siguiente_intento_at<=CURRENT_TIMESTAMP)
        OR (estado='enviando' AND reservado_at<=datetime('now','-10 minutes')))
       AND intentos<5 ORDER BY id ASC LIMIT ?`,Math.min(30,Math.max(1,Number(limit)||10)));
    for(const job of jobs)run(db,`UPDATE NOTIFICACIONES_CORREO
      SET estado='enviando',reservado_at=CURRENT_TIMESTAMP,intentos=intentos+1
      WHERE id=?`,job.id);
    return jobs;
  });
}
export function correoEnviado(db,id) {
  return run(db,`UPDATE NOTIFICACIONES_CORREO SET estado='enviado',enviado_at=CURRENT_TIMESTAMP,
    reservado_at=NULL,ultimo_error=NULL WHERE id=? AND estado='enviando'`,id).changes;
}
export function correoFallido(db,id,reason,attempts=1) {
  const delay=Math.min(360,2**Math.min(Number(attempts)||1,8));
  return run(db,`UPDATE NOTIFICACIONES_CORREO SET estado='fallido',reservado_at=NULL,
    siguiente_intento_at=datetime('now','+' || ? || ' minutes'),ultimo_error=?
    WHERE id=? AND estado='enviando'`,delay,recortar(reason,220),id).changes;
}
