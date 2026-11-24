// Solo la capa de datos conoce las consultas de postulaciones.
import { getDatabase } from "@/server/db/sqlite";

export function transaccionPostulaciones(callback) {
  return getDatabase().transaction(callback).immediate();
}

export function estudiantePorUsuario(usuarioId) {
  return getDatabase().prepare(`SELECT s.id AS estudiante_id, u.id AS usuario_id
    FROM ESTUDIANTES s JOIN USUARIOS u ON u.id=s.usuario_id
    WHERE u.id=? AND u.rol='estudiante' AND u.activo=1 AND u.email_verificado=1`).get(usuarioId);
}

export function ofertaElegible(ofertaId, hoy) {
  return getDatabase().prepare(`SELECT o.id,o.titulo,o.empresa_id,o.plazas,e.usuario_id AS usuario_empresa
    FROM OFERTAS o JOIN EMPRESAS e ON e.id=o.empresa_id
    JOIN USUARIOS u ON u.id=e.usuario_id
    WHERE o.id=? AND o.estado='publicada' AND o.fecha_vencimiento>=?
      AND e.estado_verificacion='aprobada' AND u.activo=1`).get(ofertaId,hoy);
}

export function postulacionActiva(estudianteId, ofertaId) {
  return getDatabase().prepare(`SELECT id FROM POSTULACIONES WHERE estudiante_id=? AND oferta_id=?
    AND estado NOT IN ('retirada','cerrada') LIMIT 1`).get(estudianteId, ofertaId);
}

export function crearPostulacion(estudianteId, ofertaId, mensaje, actorId, empresaUsuarioId, titulo) {
  const db=getDatabase();
  const id=Number(db.prepare(`INSERT INTO POSTULACIONES(oferta_id,estudiante_id,mensaje)
    VALUES(?,?,?)`).run(ofertaId,estudianteId,mensaje).lastInsertRowid);
  db.prepare(`INSERT INTO HISTORIAL_POSTULACIONES(postulacion_id,estado,cambiado_por,comentario)
    VALUES(?,'enviada',?,'Postulación enviada')`).run(id,actorId);
  db.prepare(`INSERT INTO NOTIFICACIONES(usuario_id,tipo,titulo,mensaje)
    VALUES(?,'postulacion','Nueva postulación',?)`)
    .run(empresaUsuarioId,`Recibiste una postulación para «${titulo}».`);
  return id;
}

export function listarPostulacionesEstudiante(usuarioId, hoy) {
  const db=getDatabase();
  const items=db.prepare(`SELECT p.id,p.oferta_id,p.estado,p.mensaje,p.postulada_at,p.actualizada_at,
    o.titulo,o.tipo,o.modalidad,o.ciudad,o.plazas,o.compensacion,o.descripcion,
    o.creditos_minimos,o.fecha_vencimiento,e.nombre_comercial AS empresa_nombre,
    e.descripcion AS empresa_descripcion,eje.nombre AS eje_nombre,
    CASE WHEN o.estado='publicada' AND o.fecha_vencimiento>=? AND e.estado_verificacion='aprobada'
      AND u.activo=1 THEN 1 ELSE 0 END AS adjuntos_publicos
    FROM POSTULACIONES p JOIN ESTUDIANTES s ON s.id=p.estudiante_id
    JOIN OFERTAS o ON o.id=p.oferta_id JOIN EMPRESAS e ON e.id=o.empresa_id
    JOIN USUARIOS u ON u.id=e.usuario_id
    LEFT JOIN CATALOGO_EJES_ACCION eje ON eje.id=o.eje_accion_id
    WHERE s.usuario_id=? ORDER BY p.postulada_at DESC,p.id DESC LIMIT 500`).all(hoy,usuarioId);
  if(!items.length)return [];
  const ids=[...new Set(items.map(p=>p.oferta_id))];
  const slots=ids.map(()=>'?').join(',');
  const habilidades=new Map(ids.map(id=>[id,[]]));
  const adjuntos=new Map(ids.map(id=>[id,[]]));
  for(const row of db.prepare(`SELECT oh.oferta_id,h.nombre FROM OFERTA_HABILIDADES oh
    JOIN CATALOGO_HABILIDADES h ON h.id=oh.habilidad_id WHERE oh.oferta_id IN (${slots}) ORDER BY h.nombre`).all(...ids)) habilidades.get(row.oferta_id).push(row.nombre);
  for(const row of db.prepare(`SELECT oferta_id,id,nombre_original FROM ADJUNTOS_OFERTA WHERE oferta_id IN (${slots}) ORDER BY posicion`).all(...ids)) adjuntos.get(row.oferta_id).push({id:row.id,name:row.nombre_original});
  return items.map(({adjuntos_publicos,...p})=>({...p,habilidades:habilidades.get(p.oferta_id),adjuntos:adjuntos_publicos?adjuntos.get(p.oferta_id):[]}));
}

export function postulacionDeEstudiante(usuarioId,id) {
  return getDatabase().prepare(`SELECT p.id,p.oferta_id,p.estado
    FROM POSTULACIONES p JOIN ESTUDIANTES s ON s.id=p.estudiante_id
    WHERE p.id=? AND s.usuario_id=?`).get(id,usuarioId);
}

export function retirarPostulacion(id,actorId) {
  const db=getDatabase();
  const info=db.prepare(`UPDATE POSTULACIONES SET estado='retirada',actualizada_at=CURRENT_TIMESTAMP
    WHERE id=? AND estado IN ('enviada','en_revision')`).run(id);
  if(info.changes) db.prepare(`INSERT INTO HISTORIAL_POSTULACIONES(postulacion_id,estado,cambiado_por,comentario)
    VALUES(?,'retirada',?,'Retirada por el estudiante')`).run(id,actorId);
  return info.changes;
}

export function idsPostulacionesActivas(usuarioId) {
  return getDatabase().prepare(`SELECT DISTINCT p.oferta_id FROM POSTULACIONES p
    JOIN ESTUDIANTES s ON s.id=p.estudiante_id WHERE s.usuario_id=?
      AND p.estado NOT IN ('retirada','cerrada')`).all(usuarioId).map(r=>r.oferta_id);
}

export function empresaDeUsuario(usuarioId) {
  return getDatabase().prepare(`SELECT e.id AS empresa_id,e.estado_verificacion FROM EMPRESAS e
    JOIN USUARIOS u ON u.id=e.usuario_id WHERE u.id=? AND u.rol='empresa' AND u.activo=1`).get(usuarioId);
}

export function postulacionesDeOferta(empresaId,ofertaId) {
  const db=getDatabase();
  const oferta=db.prepare(`SELECT id,titulo,plazas,estado FROM OFERTAS WHERE id=? AND empresa_id=? AND estado<>'eliminada'`).get(ofertaId,empresaId);
  if(!oferta)return null;
  const candidatos=db.prepare(`SELECT p.id,p.estado,p.postulada_at,
    u.nombre,u.apellidos,s.semestre,s.promedio,c.nombre AS carrera,
    CASE WHEN s.cv_ruta IS NOT NULL THEN 1 ELSE 0 END AS tiene_cv
    FROM POSTULACIONES p JOIN ESTUDIANTES s ON s.id=p.estudiante_id
    JOIN USUARIOS u ON u.id=s.usuario_id
    LEFT JOIN CATALOGO_CARRERAS c ON c.id=s.carrera_id
    WHERE p.oferta_id=? ORDER BY p.postulada_at DESC,p.id DESC`).all(ofertaId);
  return {oferta,candidatos};
}

export function detallePostulacionEmpresa(empresaId,id) {
  const db=getDatabase();
  const p=db.prepare(`SELECT p.id,p.oferta_id,p.estado,p.postulada_at,p.mensaje,
    o.titulo AS oferta_titulo,o.plazas,o.estado AS oferta_estado,o.fecha_vencimiento,
    u.id AS estudiante_usuario_id,u.nombre,u.apellidos,u.email,
    s.semestre,s.promedio,s.ubicacion,s.resumen_profesional,s.cv_nombre,
    c.nombre AS carrera,f.nombre AS facultad
    FROM POSTULACIONES p JOIN OFERTAS o ON o.id=p.oferta_id
    JOIN ESTUDIANTES s ON s.id=p.estudiante_id
    JOIN USUARIOS u ON u.id=s.usuario_id
    LEFT JOIN CATALOGO_CARRERAS c ON c.id=s.carrera_id
    LEFT JOIN CATALOGO_FACULTADES f ON f.id=c.facultad_id
    WHERE p.id=? AND o.empresa_id=?`).get(id,empresaId);
  if(!p)return null;
  const habilidades=db.prepare(`SELECT h.nombre FROM ESTUDIANTE_HABILIDADES eh
    JOIN ESTUDIANTES s ON s.id=eh.estudiante_id
    JOIN CATALOGO_HABILIDADES h ON h.id=eh.habilidad_id
    WHERE s.usuario_id=? ORDER BY h.nombre`).all(p.estudiante_usuario_id).map(r=>r.nombre);
  const historial=db.prepare(`SELECT estado,comentario,created_at FROM HISTORIAL_POSTULACIONES
    WHERE postulacion_id=? ORDER BY id`).all(id);
  return {...p,habilidades,historial};
}

export function totalAceptadasOferta(ofertaId) {
  return getDatabase().prepare(`SELECT COUNT(*) AS total FROM POSTULACIONES WHERE oferta_id=? AND estado='aceptada'`).get(ofertaId).total;
}

export function actualizarEstadoPostulacion(id,estado,actorId,estudianteUsuarioId,ofertaTitulo) {
  const db=getDatabase();
  const cambiado=db.prepare(`UPDATE POSTULACIONES SET estado=?,actualizada_at=CURRENT_TIMESTAMP WHERE id=? AND estado IN ('enviada','en_revision')`).run(estado,id).changes;
  if(!cambiado)return false;
  db.prepare(`INSERT INTO HISTORIAL_POSTULACIONES(postulacion_id,estado,cambiado_por,comentario)
    VALUES(?,?,?,?)`).run(id,estado,actorId,`Estado actualizado a ${estado}`);
  db.prepare(`INSERT INTO NOTIFICACIONES(usuario_id,tipo,titulo,mensaje)
    VALUES(?,'postulacion','Actualización de postulación',?)`)
    .run(estudianteUsuarioId,`Tu postulación a «${ofertaTitulo}» cambió a ${estado.replaceAll('_',' ')}.`);
  return true;
}
