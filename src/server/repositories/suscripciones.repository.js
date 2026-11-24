// Lecturas del periodo vigente y sus beneficios; no confundir con promociones ya asignadas.
import { getDatabase } from "@/server/db/sqlite";

export function obtenerSuscripcionActiva(empresaId) {
  if (!Number.isSafeInteger(empresaId) || empresaId <= 0) throw new TypeError("empresaId invalido");
  return getDatabase().prepare(`
    SELECT s.id, s.empresa_id, s.plan_id, s.fecha_inicio, s.fecha_fin,
           s.promociones_incluidas, s.promociones_usadas,
           MAX(0, s.promociones_incluidas - s.promociones_usadas) AS promociones_disponibles,
           s.dias_promocion_incluida, p.nombre AS nombre_plan,
           p.limite_ofertas_activas
      FROM SUSCRIPCIONES s JOIN CATALOGO_PLANES p ON p.id = s.plan_id
     WHERE s.empresa_id = ? AND s.estado = 'activa'
       AND datetime(s.fecha_inicio) <= datetime('now')
       AND datetime(s.fecha_fin) > datetime('now')
     LIMIT 1
  `).get(empresaId) ?? null;
}
