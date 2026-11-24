import { getDatabase } from "@/server/db/sqlite";

export function ejecutarOfertasTransaccion(callback) {
  return getDatabase().transaction(callback).immediate();
}

export function consultarPlanEmpresa(empresaId) {
  const db = getDatabase();
  const plan = db.prepare(`
    SELECT p.nombre, p.limite_ofertas_activas AS limite
      FROM SUSCRIPCIONES s JOIN CATALOGO_PLANES p ON p.id=s.plan_id
     WHERE s.empresa_id=? AND s.estado='activa'
       AND (s.fecha_inicio IS NULL OR date(s.fecha_inicio) <= date('now'))
       AND (s.fecha_fin IS NULL OR date(s.fecha_fin) >= date('now'))
     ORDER BY s.id DESC LIMIT 1
  `).get(empresaId);
  return plan || db.prepare(`SELECT nombre, limite_ofertas_activas AS limite FROM CATALOGO_PLANES WHERE nombre='Gratuito' LIMIT 1`).get();
}

export function contarPublicadasEmpresa(empresaId, hoy) {
  return getDatabase().prepare(`SELECT COUNT(*) AS total FROM OFERTAS
    WHERE empresa_id=? AND estado='publicada' AND fecha_vencimiento>=?`).get(empresaId, hoy).total;
}

export function listarOfertasEmpresa(empresaId) {
  return getDatabase().prepare(`
    SELECT o.*, eje.nombre AS eje_nombre,
      (SELECT COUNT(*) FROM POSTULACIONES po WHERE po.oferta_id=o.id) AS postulaciones,
      (SELECT MAX(p.fecha_fin) FROM PROMOCIONES p WHERE p.oferta_id=o.id AND p.estado='activa') AS promocion_fin
    FROM OFERTAS o LEFT JOIN CATALOGO_EJES_ACCION eje ON eje.id=o.eje_accion_id
    WHERE o.empresa_id=? AND o.estado <> 'eliminada' ORDER BY o.id DESC LIMIT 500
  `).all(empresaId);
}

export function obtenerOfertaEmpresa(empresaId, ofertaId) {
  const db = getDatabase();
  const oferta = db.prepare(`SELECT o.*, eje.nombre AS eje_nombre
      FROM OFERTAS o LEFT JOIN CATALOGO_EJES_ACCION eje ON eje.id=o.eje_accion_id
      WHERE o.empresa_id=? AND o.id=? AND o.estado<>'eliminada'`).get(empresaId, ofertaId);
  if (!oferta) return null;
  return {
    ...oferta,
    habilidades: db.prepare(`SELECT h.nombre FROM OFERTA_HABILIDADES oh
      JOIN CATALOGO_HABILIDADES h ON h.id=oh.habilidad_id WHERE oh.oferta_id=? ORDER BY h.nombre`).all(ofertaId).map((x)=>x.nombre),
    adjuntos: db.prepare(`SELECT id,nombre_original,tamano_bytes,posicion FROM ADJUNTOS_OFERTA WHERE oferta_id=? ORDER BY posicion`).all(ofertaId),
  };
}

export function obtenerEjePorNombre(nombre) {
  return getDatabase().prepare('SELECT id FROM CATALOGO_EJES_ACCION WHERE nombre=? AND activo=1').get(nombre);
}

export function idsHabilidadesExactas(nombres) {
  if (!nombres.length) return [];
  return getDatabase().prepare(`SELECT id,nombre FROM CATALOGO_HABILIDADES WHERE activo=1 AND nombre IN (${nombres.map(()=>'?').join(',')})`).all(...nombres);
}

export function guardarOfertaRegistro(empresaId, ofertaId, dato, estado, fechaPublicacion) {
  const db = getDatabase();
  const values = [dato.ejeId, dato.title, dato.description, dato.type, dato.modality,
    dato.location, dato.stipend, dato.vacancies, dato.deadline, dato.minCredits,
    dato.socialHours, dato.officialKey];
  if (ofertaId) {
    db.prepare(`UPDATE OFERTAS SET eje_accion_id=?,titulo=?,descripcion=?,tipo=?,modalidad=?,
      ciudad=?,compensacion=?,plazas=?,fecha_vencimiento=?,creditos_minimos=?,
      horas_requeridas=?,clave_programa=?, estado=?,
      fecha_publicacion=COALESCE(fecha_publicacion,?) WHERE empresa_id=? AND id=?`)
      .run(...values,estado,fechaPublicacion,empresaId,ofertaId);
  } else {
    ofertaId=db.prepare(`INSERT INTO OFERTAS
      (empresa_id,eje_accion_id,titulo,descripcion,tipo,modalidad,ciudad,compensacion,
       plazas,fecha_vencimiento,creditos_minimos,horas_requeridas,clave_programa,
       estado,fecha_publicacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(empresaId,...values,estado,fechaPublicacion).lastInsertRowid;
  }
  db.prepare('DELETE FROM OFERTA_HABILIDADES WHERE oferta_id=?').run(ofertaId);
  const skill = db.prepare('INSERT INTO OFERTA_HABILIDADES(oferta_id,habilidad_id,obligatoria) VALUES (?, ?, 1)');
  for(const id of dato.habilidadIds) skill.run(ofertaId,id);
  return Number(ofertaId);
}

export function cambiarEstadoOferta(empresaId, ofertaId, estado, extra={}) {
  const db=getDatabase();
  if(estado==='eliminada') return db.prepare("UPDATE OFERTAS SET estado='eliminada',eliminada_en=CURRENT_TIMESTAMP WHERE id=? AND empresa_id=?").run(ofertaId,empresaId).changes;
  if(estado==='cerrada') return db.prepare("UPDATE OFERTAS SET estado='cerrada' WHERE id=? AND empresa_id=?").run(ofertaId,empresaId).changes;
  if(estado==='publicada') return db.prepare("UPDATE OFERTAS SET estado='publicada',fecha_publicacion=?,fecha_vencimiento=? WHERE id=? AND empresa_id=?")
      .run(extra.hoy,extra.fechaFin,ofertaId,empresaId).changes;
  if(estado==='extender') return db.prepare('UPDATE OFERTAS SET fecha_vencimiento=? WHERE id=? AND empresa_id=?').run(extra.fechaFin,ofertaId,empresaId).changes;
  return 0;
}

export function obtenerAdjuntoEmpresa(empresaId,ofertaId,adjuntoId) {
  return getDatabase().prepare(`SELECT a.* FROM ADJUNTOS_OFERTA a JOIN OFERTAS o ON o.id=a.oferta_id
    WHERE a.id=? AND a.oferta_id=? AND o.empresa_id=? AND o.estado<>'eliminada'`).get(adjuntoId,ofertaId,empresaId);
}

export function listarAdjuntosEmpresa(empresaId,ofertaId) {
  return getDatabase().prepare(`SELECT a.id,a.posicion FROM ADJUNTOS_OFERTA a JOIN OFERTAS o ON o.id=a.oferta_id
    WHERE a.oferta_id=? AND o.empresa_id=? AND o.estado<>'eliminada' ORDER BY a.posicion`).all(ofertaId,empresaId);
}

export function insertarAdjunto(empresaId,ofertaId,info) {
  const db=getDatabase();
  return db.transaction(()=>{
    const existing=listarAdjuntosEmpresa(empresaId,ofertaId);
    if (existing.length>=3) return { error:'La oferta ya tiene tres archivos.' };
    const used=new Set(existing.map((x)=>x.posicion));
    const posicion=[1,2,3].find((n)=>!used.has(n));
    const result=db.prepare(`INSERT INTO ADJUNTOS_OFERTA(oferta_id,nombre_original,ruta_archivo,mime,tamano_bytes,posicion)
      VALUES (?,?,?,?,?,?)`).run(ofertaId,info.nombre,info.ruta,'application/pdf',info.bytes,posicion);
    return { id:Number(result.lastInsertRowid),posicion };
  }).immediate();
}
export function eliminarAdjuntoEmpresa(empresaId,ofertaId,adjuntoId) {
  const db=getDatabase();
  return db.prepare(`DELETE FROM ADJUNTOS_OFERTA WHERE id=? AND oferta_id=? AND EXISTS
    (SELECT 1 FROM OFERTAS WHERE id=? AND empresa_id=? AND estado<>'eliminada')`)
    .run(adjuntoId,ofertaId,ofertaId,empresaId).changes;
}

export function listarOfertasPublicadas(hoy) {
  const db=getDatabase();
  const result=db.prepare(`SELECT o.id,o.titulo,o.descripcion,o.tipo,o.modalidad,o.ciudad,o.plazas,
       o.creditos_minimos,o.compensacion,o.fecha_vencimiento,o.horas_requeridas,o.clave_programa,
       e.nombre_comercial AS empresa_nombre,e.descripcion AS empresa_descripcion,
       eje.nombre AS eje_nombre,
       CASE WHEN EXISTS (SELECT 1 FROM PROMOCIONES p WHERE p.oferta_id=o.id AND p.estado='activa'
           AND p.fecha_inicio<=? AND p.fecha_fin>=?) THEN 1 ELSE 0 END AS promocionada
     FROM OFERTAS o JOIN EMPRESAS e ON e.id=o.empresa_id
     JOIN USUARIOS u ON u.id=e.usuario_id AND u.activo=1
     LEFT JOIN CATALOGO_EJES_ACCION eje ON eje.id=o.eje_accion_id
     WHERE o.estado='publicada' AND o.fecha_vencimiento>=? AND e.estado_verificacion='aprobada'
     ORDER BY promocionada DESC,o.id DESC LIMIT 400`).all(hoy,hoy,hoy);
  if(!result.length)return [];
  const placeholders=result.map(()=>'?').join(',');const ids=result.map(x=>x.id);
  const skills=db.prepare(`SELECT oh.oferta_id,h.nombre FROM OFERTA_HABILIDADES oh JOIN CATALOGO_HABILIDADES h ON h.id=oh.habilidad_id WHERE oh.oferta_id IN (${placeholders})`).all(...ids);
  const docs=db.prepare(`SELECT oferta_id,id,nombre_original FROM ADJUNTOS_OFERTA WHERE oferta_id IN (${placeholders}) ORDER BY posicion`).all(...ids);
  const mapSkills=new Map(ids.map(id=>[id,[]])),mapDocs=new Map(ids.map(id=>[id,[]]));
  for(const s of skills)mapSkills.get(s.oferta_id)?.push(s.nombre);
  for(const d of docs)mapDocs.get(d.oferta_id)?.push({id:d.id,name:d.nombre_original});
  return result.map(o=>({...o,habilidades:mapSkills.get(o.id),adjuntos:mapDocs.get(o.id)}));
}

export function obtenerAdjuntoPublicado(ofertaId,archivoId,hoy) {
  return getDatabase().prepare(`SELECT a.* FROM ADJUNTOS_OFERTA a
    JOIN OFERTAS o ON o.id=a.oferta_id
    JOIN EMPRESAS e ON e.id=o.empresa_id
    JOIN USUARIOS u ON u.id=e.usuario_id
    WHERE a.id=? AND a.oferta_id=? AND o.estado='publicada' AND o.fecha_vencimiento>=?
      AND e.estado_verificacion='aprobada' AND u.activo=1`).get(archivoId,ofertaId,hoy);
}
