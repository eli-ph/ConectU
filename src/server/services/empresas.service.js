import { ErrorDeNegocio } from "@/server/services/auth.service";
import { listarEmpresasAdministracion, registrarDecisionEmpresarial } from "@/server/repositories/admin-empresas.repository";

export function empresasParaAdmin(usuario) {
  if (!usuario || usuario.rol !== "admin") throw new ErrorDeNegocio("Acceso denegado.", 403);
  return listarEmpresasAdministracion();
}

export function decidirEmpresa(usuario, params) {
  if (!usuario || usuario.rol !== "admin") throw new ErrorDeNegocio("Acceso denegado.", 403);
  const empresaId = Number(params?.empresaId);
  if (!Number.isSafeInteger(empresaId) || empresaId < 1) throw new ErrorDeNegocio("Empresa inválida.");
  const estado = params?.estado;
  if (!["aprobada", "rechazada", "suspendida", "pendiente"].includes(estado)) throw new ErrorDeNegocio("Estado inválido.");
  const motivo = typeof params?.motivo === "string" ? params.motivo.trim() : "";
  if (motivo.length > 500) throw new ErrorDeNegocio("El motivo es demasiado extenso.");
  if (["rechazada", "suspendida"].includes(estado) && motivo.length < 10) {
    throw new ErrorDeNegocio("Explica el motivo (al menos 10 caracteres).");
  }
  const result = registrarDecisionEmpresarial(usuario.id, empresaId, estado, motivo);
  if (result.error) throw new ErrorDeNegocio(result.error, result.status);
  return result;
}
