// Capa de aplicacion: adapta registros SQLite a los contratos de presentacion.
// No sustituye la autorizacion para operaciones empresariales.
import { listarEjesAccion, listarHabilidades, listarPlanesActivos, listarTarifasPromocionActivas } from "@/server/repositories/catalogos.repository";

export function obtenerCatalogoComercial() {
  return {
    planes: listarPlanesActivos().map((p) => ({
      id: p.id,
      nombre: p.nombre,
      precioCentavos: p.precio_centavos,
      duracionDias: p.duracion_dias,
      limiteOfertasActivas: p.limite_ofertas_activas,
      promocionesIncluidas: p.promociones_incluidas,
      diasPromocionIncluida: p.dias_promocion_incluida,
    })),
    promociones: listarTarifasPromocionActivas().map((p) => ({
      id: p.id,
      costoCentavos: p.costo_centavos,
      duracionDias: p.duracion_maxima_dias,
    })),
  };
}

// Catálogo único de habilidades para filtros públicos, formularios empresariales
// y perfiles estudiantiles. Los nombres proceden de SQLite, no de ejemplos fijos.
export function obtenerCatalogoHabilidades() {
  return listarHabilidades().map((registro) => registro.nombre);
}

export function obtenerCatalogoEjesAccion() {
  return listarEjesAccion().map((registro) => registro.nombre);
}
