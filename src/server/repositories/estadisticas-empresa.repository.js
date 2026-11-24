// Datos exclusivamente de la empresa autenticada. Consultas sin escrituras.
import { getDatabase } from '@/server/db/sqlite';

export function consultarEstadisticasEmpresa(empresaId, filtros) {
  const db=getDatabase();
  const {desde,hasta,hoy,desdeUtc,hastaUtc,ofertaId,ejeId}=filtros;
  return db.transaction(()=>{
  const ofertas=db.prepare(`SELECT o.id,o.titulo,o.plazas,o.estado,o.eje_accion_id,
      e.nombre AS eje_nombre, substr(o.fecha_publicacion,1,10) AS publicada,
      substr(o.fecha_vencimiento,1,10) AS vence,
      CASE WHEN o.estado='publicada' AND substr(o.fecha_publicacion,1,10)<=@hoy
        AND substr(o.fecha_vencimiento,1,10)>=@hoy THEN 1 ELSE 0 END AS activa
    FROM OFERTAS o LEFT JOIN CATALOGO_EJES_ACCION e ON e.id=o.eje_accion_id
    WHERE o.empresa_id=@empresa AND o.estado<>'borrador'
      AND (o.fecha_publicacion IS NOT NULL OR EXISTS (SELECT 1 FROM POSTULACIONES p WHERE p.oferta_id=o.id))
    ORDER BY o.titulo COLLATE NOCASE,o.id`).all({empresa:empresaId,hoy});
  const seleccion=ofertas.filter(o=>(!ofertaId||o.id===ofertaId)&&(!ejeId||o.eje_accion_id===ejeId));
  const filas=db.prepare(`SELECT p.oferta_id,p.estado,
      date(p.postulada_at,'-6 hours') AS dia, COUNT(*) AS total
    FROM POSTULACIONES p JOIN OFERTAS o ON o.id=p.oferta_id
    WHERE o.empresa_id=@empresa AND o.estado<>'borrador'
      AND (@oferta IS NULL OR o.id=@oferta) AND (@eje IS NULL OR o.eje_accion_id=@eje)
      AND datetime(p.postulada_at)>=datetime(@desdeUtc) AND datetime(p.postulada_at)<datetime(@hastaUtc)
    GROUP BY p.oferta_id,p.estado,dia ORDER BY dia,p.oferta_id,p.estado`).all({empresa:empresaId,oferta:ofertaId,eje:ejeId,desdeUtc,hastaUtc});
  // Los timestamps se guardan en UTC; CDMX usa UTC-6 en el periodo de operación de ConectU (2026+).
  // Las fechas de publicación/vencimiento son fechas locales sin hora.
  const conPostulaciones=new Set(filas.map(r=>r.oferta_id));
  const delPeriodo=seleccion.filter(o=>conPostulaciones.has(o.id)||(o.publicada&&o.publicada<=hasta&&(!o.vence||o.vence>=desde)));
  return {ofertas,seleccion,delPeriodo,filas};
  })();
}
