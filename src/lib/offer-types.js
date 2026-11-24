// Etiquetas únicas para los cuatro tipos de convocatoria en toda ConectU.
// Las claves son los códigos canónicos de SQLite; las etiquetas no cambian.
export const OFFER_TYPE_LABELS = Object.freeze({
  empleo: "Empleo",
  internship: "Internships",
  servicio_social: "Servicio social",
  practicas: "Prácticas profesionales",
});

export const OFFER_TYPE_OPTIONS = Object.freeze(
  Object.values(OFFER_TYPE_LABELS).map((label) => ({ value: label, label }))
);
