// Lecturas de catálogos disponibles para la plataforma.
import { getDatabase } from "@/server/db/sqlite";

export function listarPlanesActivos() {
  return getDatabase().prepare(`
    SELECT id, nombre, precio_centavos, limite_ofertas_activas, duracion_dias,
           promociones_incluidas, dias_promocion_incluida
      FROM CATALOGO_PLANES
     WHERE activo = 1
     ORDER BY precio_centavos ASC
  `).all();
}

export function listarTarifasPromocionActivas() {
  return getDatabase().prepare(`
    SELECT id, costo_centavos, duracion_maxima_dias
      FROM CATALOGO_PROMOCION
     WHERE activo = 1
     ORDER BY duracion_maxima_dias ASC
  `).all();
}

export function listarFacultades() {
  return getDatabase().prepare("SELECT id, nombre FROM CATALOGO_FACULTADES WHERE activo=1 ORDER BY nombre").all();
}

export function listarCarrerasPorFacultad(facultadId) {
  if (!Number.isSafeInteger(facultadId) || facultadId <= 0) throw new TypeError("facultadId invalido");
  return getDatabase().prepare(`
    SELECT id, nombre, facultad_id FROM CATALOGO_CARRERAS
    WHERE facultad_id = ? AND activo=1 ORDER BY nombre
  `).all(facultadId);
}

export function listarEjesAccion() {
  return getDatabase().prepare("SELECT id, nombre FROM CATALOGO_EJES_ACCION WHERE activo=1 ORDER BY nombre").all();
}

export function listarHabilidades() {
  return getDatabase().prepare("SELECT id, nombre FROM CATALOGO_HABILIDADES WHERE activo=1 ORDER BY nombre").all();
}
