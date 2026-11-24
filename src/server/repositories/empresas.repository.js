// Repositorio de consulta. Cambios de estado requieren permisos y service.
import { getDatabase } from "@/server/db/sqlite";

export function obtenerEmpresaPorUsuario(usuarioId) {
  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) throw new TypeError("usuarioId invalido");
  return getDatabase().prepare(`
    SELECT e.*, u.email, u.activo AS usuario_activo
      FROM EMPRESAS e JOIN USUARIOS u ON u.id = e.usuario_id
     WHERE e.usuario_id = ?
  `).get(usuarioId) ?? null;
}

export function obtenerEmpresaPorId(empresaId) {
  if (!Number.isSafeInteger(empresaId) || empresaId <= 0) throw new TypeError("empresaId invalido");
  return getDatabase().prepare(`
    SELECT e.*, u.email, u.activo AS usuario_activo
      FROM EMPRESAS e JOIN USUARIOS u ON u.id = e.usuario_id
     WHERE e.id = ?
  `).get(empresaId) ?? null;
}

export function listarEmpresasPendientes({ limite = 20, pagina = 1 } = {}) {
  if (!Number.isSafeInteger(limite) || limite < 1 || limite > 100 ||
      !Number.isSafeInteger(pagina) || pagina < 1) {
    throw new TypeError("Parametros de paginacion invalidos");
  }
  return getDatabase().prepare(`
    SELECT e.id, e.nombre_comercial, e.razon_social, e.rfc,
           e.estado_verificacion, e.fecha_solicitud, u.email
      FROM EMPRESAS e JOIN USUARIOS u ON u.id = e.usuario_id
     WHERE e.estado_verificacion = 'pendiente'
     ORDER BY e.fecha_solicitud ASC, e.id ASC
     LIMIT ? OFFSET ?
  `).all(limite, (pagina - 1) * limite);
}
