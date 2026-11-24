// Las carreras repetidas conservan la sede en SQLite para cumplir UNIQUE(nombre).
// En la interfaz ya se seleccionó la facultad; no hace falta repetirla.
// Solo quitamos sufijos de SEDE, no cualquier paréntesis académico del nombre.
const SUFIJO_SEDE = /\s+\((?:Facultad de [^)]+|FES [^)]+|ENES [^)]+|FAD Taxco|ENALLT|Escuela Nacional de [^)]+|Centro [^)]+|Instituto de [^)]+)\)$/u;

export function nombreVisibleCarrera(nombre) {
  return typeof nombre === "string" ? nombre.replace(SUFIJO_SEDE, "") : "";
}
