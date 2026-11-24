import { getDatabase } from '@/server/db/sqlite';

// No usar comparación fecha TEXT con fecha (YYYY-MM-DD) cuando
// fecha_inicio y fecha_fin contienen horas (YYYY-MM-DD HH:mm:ss).
export function aplicarPromocionesAlCatalogo(ofertas=[]) {
  if(!ofertas.length)return ofertas;
  const ids=ofertas.map(o=>Number(o.id)).filter(Number.isSafeInteger);
  if(!ids.length)return ofertas;
  const placeholders=ids.map(()=>'?').join(',');
  const activas=getDatabase().prepare(`SELECT DISTINCT oferta_id FROM PROMOCIONES
    WHERE oferta_id IN (${placeholders}) AND estado='activa'
      AND datetime(fecha_inicio)<=datetime('now') AND datetime(fecha_fin)>datetime('now')`).all(...ids);
  const set=new Set(activas.map(r=>r.oferta_id));
  return ofertas.map(o=>({...o,promocionada:set.has(Number(o.id))?1:0}));
}
