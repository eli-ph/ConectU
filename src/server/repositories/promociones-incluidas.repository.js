/** Consultas exclusivas de SQLite. No hay empresa_id ni inventario en PROMOCIONES. */
import { getDatabase } from '@/server/db/sqlite';

export function transaccionPromocion(callback) {
  return getDatabase().transaction(callback).immediate();
}

export function empresaAprobadaDeUsuario(usuarioId) {
  return getDatabase().prepare(`
    SELECT e.id, e.nombre_comercial FROM EMPRESAS e
    JOIN USUARIOS u ON u.id=e.usuario_id
    WHERE u.id=? AND u.rol='empresa' AND u.activo=1
      AND e.estado_verificacion='aprobada'
  `).get(usuarioId);
}

export function suscripcionVigente(empresaId) {
  return getDatabase().prepare(`
    SELECT s.id, s.empresa_id, s.promociones_incluidas, s.promociones_usadas,
      s.dias_promocion_incluida, s.fecha_inicio, s.fecha_fin,
      p.nombre AS plan, p.limite_ofertas_activas
    FROM SUSCRIPCIONES s
    JOIN CATALOGO_PLANES p ON p.id=s.plan_id
    WHERE s.empresa_id=? AND s.estado='activa'
      AND datetime(s.fecha_inicio)<=datetime('now')
      AND datetime(s.fecha_fin)>datetime('now')
    ORDER BY s.id DESC LIMIT 1
  `).get(empresaId);
}

export function planGratuito() {
  return getDatabase().prepare(`
    SELECT nombre AS plan, promociones_incluidas,
      dias_promocion_incluida, limite_ofertas_activas
    FROM CATALOGO_PLANES WHERE lower(nombre)='gratuito' AND activo=1 LIMIT 1
  `).get();
}

export function ofertasParaPromocion(empresaId, dias) {
  return getDatabase().prepare(`
    SELECT o.id, o.titulo, o.estado, o.fecha_vencimiento,
      CASE WHEN o.estado='publicada' AND date(o.fecha_vencimiento)>=date('now', '+' || ? || ' days')
        AND NOT EXISTS (
          SELECT 1 FROM PROMOCIONES pr WHERE pr.oferta_id=o.id
            AND pr.estado='activa' AND datetime(pr.fecha_fin)>datetime('now')
        ) THEN 1 ELSE 0 END AS elegible,
      CASE
        WHEN o.estado<>'publicada' THEN 'La oferta no está publicada'
        WHEN o.fecha_vencimiento IS NULL OR date(o.fecha_vencimiento)<date('now', '+' || ? || ' days')
          THEN 'La oferta vence antes de que termine la promoción'
        WHEN EXISTS (
          SELECT 1 FROM PROMOCIONES pr WHERE pr.oferta_id=o.id
            AND pr.estado='activa' AND datetime(pr.fecha_fin)>datetime('now')
        ) THEN 'La oferta ya tiene una promoción activa'
        ELSE NULL END AS motivo
    FROM OFERTAS o
    WHERE o.empresa_id=? AND o.estado<>'eliminada'
    ORDER BY elegible DESC, o.fecha_vencimiento DESC, o.id DESC
  `).all(dias,dias,empresaId);
}

export function ofertaDeEmpresa(empresaId, ofertaId) {
  return getDatabase().prepare(`
    SELECT id,titulo,estado,fecha_vencimiento FROM OFERTAS
    WHERE id=? AND empresa_id=?
  `).get(ofertaId,empresaId);
}

export function tarifaPromocion(dias) {
  return getDatabase().prepare(`
    SELECT id, duracion_maxima_dias FROM CATALOGO_PROMOCION
    WHERE duracion_maxima_dias=? AND activo=1 LIMIT 1
  `).get(dias);
}

export function existePromocionActiva(ofertaId) {
  return !!getDatabase().prepare(`
    SELECT 1 FROM PROMOCIONES WHERE oferta_id=? AND estado='activa'
      AND datetime(fecha_fin)>datetime('now') LIMIT 1
  `).get(ofertaId);
}

export function insertarPromocionIncluida(ofertaId, tarifaId, dias) {
  const result=getDatabase().prepare(`
    INSERT INTO PROMOCIONES
      (oferta_id, tarifa_promocion_id, origen, fecha_inicio, fecha_fin, estado)
    VALUES (?, ?, 'incluida', datetime('now'), datetime('now', '+' || ? || ' days'), 'activa')
  `).run(ofertaId,tarifaId,dias);
  return Number(result.lastInsertRowid);
}

export function promocionesDeEmpresa(empresaId) {
  return getDatabase().prepare(`
    SELECT pr.id,pr.oferta_id,o.titulo,pr.origen,pr.estado,
      pr.fecha_inicio,pr.fecha_fin,t.duracion_maxima_dias AS dias,
      CASE WHEN pr.estado='activa' AND datetime(pr.fecha_fin)>datetime('now')
        THEN 'en_uso' WHEN pr.estado='activa' THEN 'vencida'
        ELSE pr.estado END AS estado_visible
    FROM PROMOCIONES pr
    JOIN OFERTAS o ON o.id=pr.oferta_id
    JOIN CATALOGO_PROMOCION t ON t.id=pr.tarifa_promocion_id
    WHERE o.empresa_id=?
    ORDER BY pr.id DESC LIMIT 100
  `).all(empresaId);
}
