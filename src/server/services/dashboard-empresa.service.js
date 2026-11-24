// Capa de aplicación: el resumen utiliza únicamente datos del dueño autenticado.
import { resumenOfertasEmpresa, hoyMexico } from "@/server/services/ofertas.service";
import { consultarResumenEmpresa } from "@/server/repositories/dashboard-empresa.repository";

export function obtenerDashboardEmpresa(usuario) {
  const { capacidad } = resumenOfertasEmpresa(usuario); // Comprueba rol y aprobación.
  const hoy = hoyMexico();
  const datos = consultarResumenEmpresa(usuario.empresa_id, hoy);
  const libres = capacidad.limite == null ? null : Math.max(0,capacidad.limite-capacidad.activas);
  return {
    hoy,
    capacidad: {...capacidad, libres},
    plazas: {
      total: datos.plazas.total_plazas,
      disponibles: Math.max(0,datos.plazas.total_plazas-datos.plazas.plazas_ocupadas),
    },
    postulaciones: datos.postulaciones,
    promociones: {
      incluidas: datos.suscripcion.promociones_incluidas,
      usadas: datos.suscripcion.promociones_usadas,
      disponibles: Math.max(0,datos.suscripcion.promociones_incluidas-datos.suscripcion.promociones_usadas),
    },
    totalProximas: datos.totalProximas,
    proximas: datos.proximas,
    actividad: datos.actividad,
  };
}
