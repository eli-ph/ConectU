// Catálogo ilustrativo compartido por /planes y /empresa/plan.
// Cuando exista SQLite, reemplazar por lecturas desde el repositorio de catálogos.
// Los precios no están validados como tarifas comerciales definitivas.
export const PLAN_CATALOG = [
  {
    id: "gratuito",
    name: "Gratuito",
    price: 0,
    durationDays: null,
    offerLimit: 10,
    includedPromotions: 0,
    includedPromotionDays: 0,
  },
  {
    id: "basico",
    name: "Básico",
    price: 99,
    durationDays: 30,
    offerLimit: 20,
    includedPromotions: 1,
    includedPromotionDays: 7,
  },
  {
    id: "premium",
    name: "Premium",
    price: 249,
    durationDays: 30,
    offerLimit: null, // Sin límite numérico, sujeto a moderación.
    includedPromotions: 3,
    includedPromotionDays: 7,
  },
];

export const PROMOTION_CATALOG = [
  { days: 7, price: 39 },
  { days: 15, price: 69 },
  { days: 30, price: 119 },
];

export function formatPrice(price) {
  return `$${price.toLocaleString("es-MX", { minimumFractionDigits: 0 })}`;
}

export function describePlanCapacity(plan) {
  return plan.offerLimit == null
    ? "Ofertas activas sin límite numérico"
    : `${plan.offerLimit} ofertas activas simultáneas`;
}

export function describeIncludedPromotions(plan) {
  if (plan.includedPromotions === 0) return "Sin promociones incluidas";
  const count = plan.includedPromotions;
  return `${count} ${count === 1 ? "promoción" : "promociones"} de ${plan.includedPromotionDays} días por periodo`;
}
