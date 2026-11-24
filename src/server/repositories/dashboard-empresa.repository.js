// Capa de datos: métricas y actividad del resumen empresarial, aisladas de React.
import { getDatabase } from "@/server/db/sqlite";

export function consultarResumenEmpresa(empresaId, hoy) {
  const db = getDatabase();
  const plazas = db.prepare(`
    SELECT COALESCE(SUM(o.plazas),0) AS total_plazas,
      COALESCE(SUM((SELECT COUNT(*) FROM POSTULACIONES p
          WHERE p.oferta_id=o.id AND p.estado='aceptada')),0) AS plazas_ocupadas,
      COALESCE(SUM(o.vistas),0) AS vistas_activas
    FROM OFERTAS o
    WHERE o.empresa_id=? AND o.estado='publicada' AND o.fecha_vencimiento>=?
  `).get(empresaId, hoy);
  const postulaciones = db.prepare(`
    SELECT COUNT(*) AS total,
      COALESCE(SUM(CASE WHEN p.estado IN ('enviada','en_revision') THEN 1 ELSE 0 END),0) AS por_revisar,
      COALESCE(SUM(CASE WHEN p.estado='enviada' THEN 1 ELSE 0 END),0) AS nuevas
    FROM POSTULACIONES p JOIN OFERTAS o ON o.id=p.oferta_id
    WHERE o.empresa_id=?
  `).get(empresaId);
  const suscripcion = db.prepare(`
    SELECT s.promociones_incluidas, s.promociones_usadas
    FROM SUSCRIPCIONES s WHERE s.empresa_id=? AND s.estado='activa'
      AND (s.fecha_inicio IS NULL OR substr(s.fecha_inicio,1,10)<=?)
      AND (s.fecha_fin IS NULL OR substr(s.fecha_fin,1,10)>=?)
    ORDER BY s.id DESC LIMIT 1
  `).get(empresaId,hoy,hoy);
  const totalProximas = db.prepare(`
    SELECT COUNT(*) AS total FROM OFERTAS
    WHERE empresa_id=? AND estado='publicada' AND fecha_vencimiento>=?
      AND fecha_vencimiento<=date(?, '+7 days')
  `).get(empresaId,hoy,hoy).total;
  const proximas = db.prepare(`
    SELECT o.id, o.titulo, o.tipo, o.modalidad, o.fecha_publicacion,
      o.fecha_vencimiento, o.plazas, o.vistas, eje.nombre AS eje_nombre,
      (SELECT COUNT(*) FROM POSTULACIONES p WHERE p.oferta_id=o.id) AS postulaciones,
      (SELECT COUNT(*) FROM POSTULACIONES p WHERE p.oferta_id=o.id AND p.estado='aceptada') AS aceptadas
    FROM OFERTAS o LEFT JOIN CATALOGO_EJES_ACCION eje ON eje.id=o.eje_accion_id
    WHERE o.empresa_id=? AND o.estado='publicada'
      AND o.fecha_vencimiento>=? AND o.fecha_vencimiento<=date(?, '+7 days')
    ORDER BY o.fecha_vencimiento ASC,o.id ASC LIMIT 6
  `).all(empresaId,hoy,hoy);
  const actividad = db.prepare(`
    SELECT h.id, h.estado, h.created_at, p.id AS postulacion_id,
      o.titulo AS oferta_titulo, u.nombre, u.apellidos
    FROM HISTORIAL_POSTULACIONES h
    JOIN POSTULACIONES p ON p.id=h.postulacion_id
    JOIN OFERTAS o ON o.id=p.oferta_id
    JOIN ESTUDIANTES s ON s.id=p.estudiante_id
    JOIN USUARIOS u ON u.id=s.usuario_id
    WHERE o.empresa_id=?
    ORDER BY h.created_at DESC,h.id DESC LIMIT 6
  `).all(empresaId);
  return {plazas,postulaciones,suscripcion:suscripcion||{promociones_incluidas:0,promociones_usadas:0},totalProximas,proximas,actividad};
}
