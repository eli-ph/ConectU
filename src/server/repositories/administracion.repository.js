import { getDatabase } from '@/server/db/sqlite';
const activeOffers=`FROM OFERTAS o JOIN EMPRESAS e ON e.id=o.empresa_id JOIN USUARIOS u ON u.id=e.usuario_id LEFT JOIN CATALOGO_EJES_ACCION a ON a.id=o.eje_accion_id WHERE o.estado='publicada' AND date(o.fecha_vencimiento)>=? AND e.estado_verificacion='aprobada' AND u.activo=1`;
const promo=`EXISTS(SELECT 1 FROM PROMOCIONES p WHERE p.oferta_id=o.id AND p.estado='activa' AND datetime(p.fecha_inicio)<=datetime('now') AND datetime(p.fecha_fin)>datetime('now'))`;
export function indicadoresAdmin(hoy){
 const db=getDatabase();const count=(sql,...params)=>db.prepare(sql).get(...params).n;
 return {
 empresasPendientes:count("SELECT count(*) n FROM EMPRESAS WHERE estado_verificacion='pendiente'"),
 empresasAprobadas:count("SELECT count(*) n FROM EMPRESAS e JOIN USUARIOS u ON u.id=e.usuario_id WHERE e.estado_verificacion='aprobada' AND u.activo=1"),
 empresasRegistradas:count('SELECT count(*) n FROM EMPRESAS'),
 planesActivos:count(`SELECT count(*) n FROM SUSCRIPCIONES s JOIN CATALOGO_PLANES p ON p.id=s.plan_id WHERE s.estado='activa' AND p.precio_centavos>0 AND datetime(s.fecha_inicio)<=datetime('now') AND datetime(s.fecha_fin)>datetime('now')`),
 ofertasActivas:count('SELECT count(*) n '+activeOffers,hoy),
 estudiantesActivos:count(`SELECT count(DISTINCT s.id) n FROM ESTUDIANTES s JOIN USUARIOS u ON u.id=s.usuario_id JOIN POSTULACIONES po ON po.estudiante_id=s.id WHERE u.activo=1 AND datetime(po.postulada_at)>=datetime('now','-30 days') AND datetime(po.postulada_at)<=datetime('now')`),
 estudiantesRegistrados:count("SELECT count(*) n FROM USUARIOS WHERE rol='estudiante' AND eliminado_en IS NULL")
 };
}
export function ofertasAdmin(hoy){const db=getDatabase();return {ofertas:db.prepare(`SELECT o.id,o.titulo,o.descripcion,o.tipo,o.modalidad,o.plazas,o.fecha_publicacion,o.fecha_vencimiento,e.nombre_comercial,a.nombre AS eje,${promo} AS promocionada,(SELECT count(*) FROM POSTULACIONES po WHERE po.oferta_id=o.id) AS postulaciones ${activeOffers} ORDER BY promocionada DESC,o.id DESC`).all(hoy),moderadas:db.prepare(`SELECT count(DISTINCT entidad_id) n FROM ADMIN_ACCIONES WHERE entidad='oferta' AND date(created_at)>=date(?,'start of month')`).get(hoy).n};}
export function listarUsuariosAdmin(){return getDatabase().prepare(`SELECT u.id,u.nombre,u.apellidos,u.email,u.rol,u.activo,u.email_verificado,u.created_at,u.eliminado_en,s.numero_cuenta FROM USUARIOS u LEFT JOIN ESTUDIANTES s ON s.usuario_id=u.id WHERE u.rol IN ('estudiante','admin') AND u.eliminado_en IS NULL ORDER BY u.id DESC`).all();}
export function transaccionAdmin(fn){return getDatabase().transaction(fn).immediate();}
export function actorActivo(id){return !!getDatabase().prepare("SELECT 1 FROM USUARIOS WHERE id=? AND rol='admin' AND activo=1 AND eliminado_en IS NULL").get(id);}
export function registrarAccion(admin,entidad,id,accion,motivo=null){getDatabase().prepare('INSERT INTO ADMIN_ACCIONES(admin_id,entidad,entidad_id,accion,motivo) VALUES(?,?,?,?,?)').run(admin,entidad,id,accion,motivo);}
export function usuarioAdministrable(id){return getDatabase().prepare("SELECT id,rol,activo,eliminado_en FROM USUARIOS WHERE id=? AND rol IN ('estudiante','admin')").get(id);}
export function cambiarAcceso(id,accion){const db=getDatabase();db.prepare(`UPDATE USUARIOS SET activo=?,eliminado_en=CASE WHEN ?='eliminar' THEN CURRENT_TIMESTAMP ELSE eliminado_en END WHERE id=?`).run(accion==='reactivar'?1:0,accion,id);if(accion!=='reactivar')db.prepare('DELETE FROM USUARIO_SESIONES WHERE usuario_id=?').run(id);}
export function crearAdmin(nombre,apellidos,email,hash){return Number(getDatabase().prepare("INSERT INTO USUARIOS(nombre,apellidos,email,password_hash,rol,email_verificado,activo) VALUES(?,?,?,?,'admin',1,1)").run(nombre,apellidos,email,hash).lastInsertRowid);}
export function credencialAdmin(id){return getDatabase().prepare("SELECT password_hash FROM USUARIOS WHERE id=? AND rol='admin' AND activo=1").get(id);}
export function renovarClaveAdmin(id,anterior,nuevo){const db=getDatabase();const r=db.prepare("UPDATE USUARIOS SET password_hash=? WHERE id=? AND password_hash=? AND rol='admin' AND activo=1").run(nuevo,id,anterior);if(r.changes)db.prepare('DELETE FROM USUARIO_SESIONES WHERE usuario_id=?').run(id);return r.changes===1;}
export function moderarOferta(admin,id,decision,motivo,notificar,hoy){const db=getDatabase();const o=db.prepare(`SELECT o.id,o.titulo,e.usuario_id ${activeOffers} AND o.id=?`).get(hoy,id);if(!o)return false;
 registrarAccion(admin,'oferta',id,decision,motivo);
 if(decision==='cerrar'){
  db.prepare("UPDATE OFERTAS SET estado='cerrada' WHERE id=?").run(id);
  // La oferta cerrada desaparece del catálogo; se conserva el historial comercial y sus fechas.
  const notify=db.prepare('INSERT INTO NOTIFICACIONES(usuario_id,tipo,titulo,mensaje,url) VALUES(?,?,?,?,?)');
  notify.run(o.usuario_id,'moderacion_oferta','Oferta cerrada por administración',`La oferta «${o.titulo}» fue cerrada. Motivo: ${motivo}`,'/empresa/ofertas');
  if(notificar)for(const s of db.prepare("SELECT DISTINCT s.usuario_id FROM POSTULACIONES p JOIN ESTUDIANTES s ON s.id=p.estudiante_id JOIN USUARIOS u ON u.id=s.usuario_id WHERE p.oferta_id=? AND p.estado NOT IN ('retirada','cerrada') AND u.activo=1").all(id))notify.run(s.usuario_id,'moderacion_oferta','Oferta no disponible',`La oferta «${o.titulo}» fue cerrada por administración.`,'/estudiante/postulaciones');
 }return true;}
const CATALOGS={facultades:{table:'CATALOGO_FACULTADES',fields:['clave','sede'],refs:[['CATALOGO_CARRERAS','facultad_id']]},carreras:{table:'CATALOGO_CARRERAS',fields:['clave','facultad_id'],refs:[['ESTUDIANTES','carrera_id'],['OFERTA_CARRERAS','carrera_id']]},ejes:{table:'CATALOGO_EJES_ACCION',fields:['descripcion'],refs:[['OFERTAS','eje_accion_id']]},habilidades:{table:'CATALOGO_HABILIDADES',fields:['categoria','sinonimos'],refs:[['ESTUDIANTE_HABILIDADES','habilidad_id'],['OFERTA_HABILIDADES','habilidad_id']]}};
export function listarCatalogosAdmin(){const db=getDatabase();return Object.fromEntries(Object.entries(CATALOGS).map(([key,c])=>[key,db.prepare(`SELECT t.*, ${key==='carreras'?"(SELECT nombre FROM CATALOGO_FACULTADES WHERE id=t.facultad_id) AS facultad,":""} (${c.refs.map(([table,col])=>`(SELECT count(*) FROM ${table} WHERE ${col}=t.id)`).join('+')}) AS usos FROM ${c.table} t ORDER BY t.nombre COLLATE NOCASE`).all().map(row=>({...row,activo:!!row.activo,facultad:row.facultad||'',clave:row.clave||'',sede:row.sede||'',descripcion:row.descripcion||'',categoria:row.categoria||'',sinonimos:row.sinonimos||''}))]));}
export function guardarCatalogo(admin,tipo,id,dato){const db=getDatabase(),c=CATALOGS[tipo];if(!c)return {error:'Catálogo inválido.'};const old=id?db.prepare(`SELECT * FROM ${c.table} WHERE id=?`).get(id):null;if(id&&!old)return {error:'Registro no encontrado.'};
 if(!dato.activo&&id&&c.refs.some(([t,k])=>db.prepare(`SELECT 1 FROM ${t} WHERE ${k}=? LIMIT 1`).get(id)))return {error:'No se puede desactivar una entrada que está en uso.'};
 const norm=v=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();if(db.prepare(`SELECT id,nombre FROM ${c.table}`).all().some(r=>r.id!==id&&norm(r.nombre)===norm(dato.nombre)))return {error:'Ya existe una entrada con ese nombre.'};
 if(tipo==='carreras'&&!db.prepare('SELECT id FROM CATALOGO_FACULTADES WHERE id=? AND activo=1').get(dato.facultad_id))return {error:'Selecciona una facultad activa.'};
 const keys=['nombre','activo',...c.fields],values=keys.map(k=>k==='activo'?Number(dato.activo):dato[k]??null);
 let resultId=id;if(id)db.prepare(`UPDATE ${c.table} SET ${keys.map(k=>`${k}=?`).join(',')} WHERE id=?`).run(...values,id);else resultId=Number(db.prepare(`INSERT INTO ${c.table}(${keys.join(',')}) VALUES(${keys.map(()=>'?').join(',')})`).run(...values).lastInsertRowid);
 registrarAccion(admin,'catalogo',resultId,id?'editar':'crear',tipo);return {id:resultId};}
export function tieneCierreAdministrativo(id){return !!getDatabase().prepare("SELECT 1 FROM ADMIN_ACCIONES WHERE entidad='oferta' AND entidad_id=? AND accion='cerrar' LIMIT 1").get(id);}
