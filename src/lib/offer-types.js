// Etiquetas únicas para los cuatro tipos de convocatoria en toda ConectU.
// Al conectar SQLite, el repositorio deberá mapearlas a los códigos definitivos del esquema.
export const OFFER_TYPE_LABELS = Object.freeze({
  empleo: "Empleo",
  internships: "Internships",
  servicio_social: "Servicio social",
  practicas: "Prácticas profesionales",
});

export const OFFER_TYPE_OPTIONS = Object.freeze(
  Object.values(OFFER_TYPE_LABELS).map((label) => ({ value: label, label }))
);
