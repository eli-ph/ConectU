"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  CreditCard,
  Gift,
  Info,
  Layers3,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Modal } from "@/components/dashboard-ui";
import {
  PLAN_CATALOG,
  PROMOTION_CATALOG,
  formatPrice,
  describePlanCapacity,
  describeIncludedPromotions,
} from "@/lib/commercial-catalog";

// Ejemplos exclusivos de la UI. No se consultan desde /empresa/ofertas ni desde SQLite.
// Los días restantes permiten ensayar los casos de elegibilidad del flujo.
const previewOffers = [
  { id: "vnc-2024-094", name: "Practicante de Automatización y Robótica Industrial", daysRemaining: 21, active: true, promoted: false },
  { id: "vnc-2024-077", name: "Asistente Técnico de Laboratorio y Ensayos Químicos", daysRemaining: 5, active: true, promoted: false },
  { id: "vnc-2024-089", name: "Ingeniero de Software Trainee (Cloud & DevOps)", daysRemaining: 40, active: true, promoted: true },
  { id: "vnc-2024-102", name: "Beca de Investigación: Diseño de Circuitos Embebidos", daysRemaining: 45, active: true, promoted: false },
];

// Información de presentación. Debe venir de la suscripción real cuando haya backend.
const previewSubscription = { planId: "basico", includedUsed: 0 };

function offerEligibility(offer, days) {
  if (!offer.active) return "La oferta no está activa";
  if (offer.promoted) return "Ya tiene una promoción activa";
  if (offer.daysRemaining < days) return `Vence antes de ${days} días`;
  return null;
}

function SmallHeading({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf1fb] text-brand-navy"><Icon size={19} aria-hidden="true" /></span>
      <div className="min-w-0">
        <h2 className="text-base font-bold text-brand-navy sm:text-lg">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
      </div>
    </div>
  );
}

function PlanOption({ plan, currentPlanId, onChoose }) {
  const isCurrent = plan.id === currentPlanId;
  const isFree = plan.id === "gratuito";
  const isPremium = plan.id === "premium";
  return (
    <article className={`flex min-w-0 flex-col rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${isCurrent ? "border-[#cfac58] ring-1 ring-[#cfac58]/25" : "border-slate-200"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-lg font-bold text-brand-navy">{plan.name}</p>
        {isCurrent ? <span className="rounded-full bg-brand-gold-soft px-3 py-1 text-xs font-bold text-[#725415]">Plan actual</span> : isPremium ? <span className="rounded-full bg-[#edf1fb] px-3 py-1 text-xs font-semibold text-brand-navy">Mayor capacidad</span> : null}
      </div>
      <div className="mt-4 flex items-end gap-2 text-brand-navy">
        <strong className="text-3xl font-extrabold tracking-tight">{formatPrice(plan.price)}</strong>
        <span className="mb-1 text-xs font-medium text-slate-500">MXN {isFree ? "· Sin costo" : "/ 30 días"}</span>
      </div>
      <div className="mt-5 flex-1 space-y-3 text-sm leading-6 text-slate-600">
        <p className="flex gap-2"><Layers3 size={17} className="mt-1 shrink-0 text-[#a98131]" /><span>{describePlanCapacity(plan)}</span></p>
        <p className="flex gap-2"><Sparkles size={17} className="mt-1 shrink-0 text-[#a98131]" /><span>{describeIncludedPromotions(plan)}</span></p>
        <p className="flex gap-2"><Check size={17} className="mt-1 shrink-0 text-[#a98131]" /><span>Estadísticas y gestión de candidatos incluidas</span></p>
      </div>
      {isFree && !isCurrent ? (
        <p className="mt-6 rounded-xl bg-slate-50 px-3 py-3 text-center text-xs leading-5 text-slate-500">Se aplica cuando termina el plan pagado, salvo que lo renueves.</p>
      ) : (
        <button
          type="button"
          onClick={() => onChoose(plan.id)}
          disabled={isFree}
          className={`mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${isCurrent ? "border border-brand-navy bg-white text-brand-navy hover:bg-slate-50" : "bg-brand-navy text-white hover:bg-brand-navy-light"} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isCurrent ? "Renovar manualmente" : "Elegir plan"}<ArrowRight size={16} aria-hidden="true" />
        </button>
      )}
    </article>
  );
}

function OfferSelect({ offers, days, selected, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-bold text-brand-navy">Selecciona la oferta que recibirá la promoción</legend>
      <p className="mt-1 text-xs leading-5 text-slate-500">Debe estar activa, no tener otra promoción vigente y contar con al menos {days} días restantes.</p>
      <div className="mt-3 space-y-2.5">
        {offers.map((offer) => {
          const reason = offerEligibility(offer, days);
          const active = selected === offer.id;
          return (
            <label
              key={offer.id}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition ${reason ? "cursor-not-allowed border-slate-200 bg-slate-50/70 opacity-70" : active ? "cursor-pointer border-brand-navy bg-[#eef2fa] ring-1 ring-brand-navy/15" : "cursor-pointer border-slate-200 bg-white hover:border-slate-400"}`}
            >
              <input
                type="radio"
                name="ofertaParaPromocion"
                value={offer.id}
                checked={active}
                disabled={!!reason}
                onChange={() => onChange(offer.id)}
                className="mt-1 h-4 w-4 shrink-0 accent-brand-navy"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-brand-navy">{offer.name}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{offer.daysRemaining} días de vigencia restantes · {reason ?? "Disponible para promocionar"}</span>
              </span>
              {!reason && <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function CompanyPlanPage() {
  const currentPlan = PLAN_CATALOG.find((p) => p.id === previewSubscription.planId);
  const availableIncluded = Math.max(0, currentPlan.includedPromotions - previewSubscription.includedUsed);
  const currentOffers = previewOffers.filter((offer) => offer.active);
  const [modalMode, setModalMode] = useState(null); // plan | included | extra
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [selectedDays, setSelectedDays] = useState(7);
  const [checkoutReview, setCheckoutReview] = useState(false);
  const [feedback, setFeedback] = useState("");

  const selectedOffer = useMemo(() => previewOffers.find((offer) => offer.id === selectedOfferId), [selectedOfferId]);
  const selectedPlan = PLAN_CATALOG.find((plan) => plan.id === selectedPlanId);
  const selectedRate = PROMOTION_CATALOG.find((promotion) => promotion.days === selectedDays);
  const durationDays = modalMode === "included" ? currentPlan.includedPromotionDays : selectedDays;
  const eligible = selectedOffer && !offerEligibility(selectedOffer, durationDays);
  const activePromotionCount = previewOffers.filter((offer) => offer.promoted).length;

  function beginPlanCheckout(planId) {
    setSelectedPlanId(planId);
    setModalMode("plan");
    setFeedback("");
    setCheckoutReview(true);
  }
  function beginPromotion(mode, days = 7) {
    setModalMode(mode);
    setSelectedOfferId("");
    setSelectedDays(days);
    setCheckoutReview(false);
    setFeedback("");
  }
  function closeModal() {
    setModalMode(null);
    setFeedback("");
  }
  function handleAction() {
    if (modalMode === "extra" && !checkoutReview) {
      if (!eligible) {
        setFeedback("Selecciona una oferta elegible antes de continuar.");
        return;
      }
      setFeedback("");
      setCheckoutReview(true);
      return;
    }
    if (modalMode === "included" && !eligible) {
      setFeedback("Selecciona una oferta elegible para utilizar la promoción incluida.");
      return;
    }
    // No cambiar contadores ni estados: no hay confirmación real del servidor.
    setFeedback(modalMode === "included"
      ? "La activación se realizará cuando esté conectado el servidor. Todavía no se descontó ninguna activación."
      : "El cobro requiere integrar el servicio de pagos. No se realizó ninguna compra ni se activó una promoción.");
  }

  let modalTitle = "";
  if (modalMode === "plan") modalTitle = "Revisar contratación de plan";
  if (modalMode === "included") modalTitle = "Utilizar promoción incluida";
  if (modalMode === "extra") modalTitle = checkoutReview ? "Revisar compra de promoción" : "Elegir promoción y oferta";

  return (
    <DashboardShell role="empresa" title="Empresa" badge="CORPORATIVO" hidePageHeader>
      <div className="space-y-7 pb-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9e7400]">Beneficios empresariales</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">Plan y promociones</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Gestiona tu plan de publicación y destaca ofertas cuando lo necesites. Las promociones se asignan a la oferta elegida al activarse.</p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#102a4b] px-5 py-5 text-white sm:px-7">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#ead29a]"><BadgeCheck size={14} /> Plan vigente</span>
              <h2 className="mt-3 text-2xl font-bold">{currentPlan.name}</h2>
              <p className="mt-1 text-sm text-slate-200">30 días por periodo · Renovación manual</p>
            </div>
            <span className="rounded-xl bg-white/10 px-4 py-3 text-right text-sm font-semibold">{formatPrice(currentPlan.price)} MXN <span className="block text-xs font-normal text-slate-200">por periodo</span></span>
          </div>
          <div className="p-5 sm:p-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-brand-navy">Capacidad del plan</span>
                <span className="font-bold text-brand-navy">{currentOffers.length} de {currentPlan.offerLimit ?? "∞"} ofertas de ejemplo</span>
              </div>
              {currentPlan.offerLimit != null && (
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#c7a253]" style={{ width: `${Math.min(100, currentOffers.length / currentPlan.offerLimit * 100)}%` }} /></div>
              )}
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1.5">{describePlanCapacity(currentPlan)}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5">Estadísticas incluidas</span>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Planes disponibles" className="space-y-4">
          <SmallHeading icon={CreditCard} title="Contratar o renovar un plan" description="Elige el plan que necesitas. Un cambio a otro plan pagado inicia un nuevo periodo de 30 días, sin prorrateos." />
          <div className="grid gap-4 lg:grid-cols-3">
            {PLAN_CATALOG.map((plan) => <PlanOption key={plan.id} plan={plan} currentPlanId={currentPlan.id} onChoose={beginPlanCheckout} />)}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SmallHeading icon={BriefcaseBusiness} title="Mis promociones" description="Cada promoción activa está vinculada a una oferta; no existe un inventario de promociones pendientes." />
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="min-w-[110px] flex-1 rounded-xl bg-[#f7f9fc] p-4"><strong className="block text-2xl text-brand-navy">{activePromotionCount}</strong><span className="text-xs text-slate-500">En uso (ejemplo)</span></div>
              <div className="min-w-[110px] flex-1 rounded-xl bg-[#f7f9fc] p-4"><strong className="block text-2xl text-brand-navy">{previewSubscription.includedUsed}</strong><span className="text-xs text-slate-500">Incluidas utilizadas</span></div>
              <div className="min-w-[110px] flex-1 rounded-xl bg-[#f7f9fc] p-4"><strong className="block text-2xl text-brand-navy">{availableIncluded}</strong><span className="text-xs text-slate-500">Activaciones restantes</span></div>
            </div>
            <div className="mt-5 space-y-2">
              {previewOffers.filter((offer) => offer.promoted).map((offer) => (
                <div key={offer.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="min-w-0"><p className="text-sm font-semibold text-brand-navy">{offer.name}</p><p className="mt-1 text-xs text-slate-500">Oferta con promoción vigente · ejemplo</p></div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3d6] px-3 py-1 text-xs font-semibold text-[#846013]"><Sparkles size={13} /> En uso</span>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SmallHeading icon={ShieldCheck} title="Reglas de continuidad" />
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
              <li className="flex gap-2"><CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-600" /> Solo las empresas aprobadas pueden contratar planes y activar promociones.</li>
              <li className="flex gap-2"><CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-600" /> Una promoción no puede compartir vigencia con otra sobre la misma oferta.</li>
              <li className="flex gap-2"><CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-600" /> La oferta debe permanecer activa durante toda la duración contratada.</li>
              <li className="flex gap-2"><CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-600" /> Las promociones ya activadas continúan hasta su vencimiento, aunque cambie el plan.</li>
              <li className="flex gap-2"><CalendarDays size={17} className="mt-1 shrink-0 text-slate-500" /> Los planes no se renuevan automáticamente.</li>
            </ul>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.08fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <SmallHeading icon={Gift} title="Utilizar una promoción incluida" description="No hay nada que asignar por adelantado: selecciona una oferta y consume una activación de tu plan." />
              <span className="rounded-full bg-[#eef1fb] px-3 py-1.5 text-xs font-bold text-brand-navy">{availableIncluded} disponible{availableIncluded === 1 ? "" : "s"} de {currentPlan.includedPromotions}</span>
            </div>
            <div className="mt-5 rounded-xl bg-[#f7f9fc] px-4 py-4 text-sm leading-6 text-slate-600">
              <p className="font-semibold text-brand-navy">{currentPlan.includedPromotionDays || 0} días de prioridad en búsquedas por activación</p>
              <p className="mt-1">Solo se registra una promoción cuando se asigna a una oferta válida. Las activaciones restantes vencen con la suscripción.</p>
            </div>
            <button
              type="button"
              disabled={availableIncluded === 0}
              onClick={() => beginPromotion("included", currentPlan.includedPromotionDays)}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white transition hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Sparkles size={17} /> Elegir oferta y utilizar beneficio
            </button>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SmallHeading icon={Megaphone} title="Comprar promoción adicional" description="Selecciona duración y oferta antes del pago; no se guardan promociones sin asignar." />
            <div className="mt-5 grid grid-cols-3 gap-2">
              {PROMOTION_CATALOG.map((rate) => (
                <button
                  key={rate.days}
                  type="button"
                  onClick={() => beginPromotion("extra", rate.days)}
                  className="rounded-xl border border-slate-200 bg-[#f7f9fc] px-2 py-4 text-center transition hover:border-brand-navy hover:bg-[#edf1fb]"
                >
                  <span className="block text-base font-extrabold text-brand-navy">{rate.days} días</span>
                  <span className="mt-1 block text-sm text-slate-600">{formatPrice(rate.price)} MXN</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Las promociones adicionales son independientes del plan y no descuentan activaciones incluidas.</p>
          </article>
        </section>

        <div className="text-xs leading-5 text-slate-500">Las ofertas, cantidades y precios mostrados son ilustrativos. La contratación verificará vigencias, disponibilidad y pagos en el servidor.</div>
      </div>

      <Modal
        open={!!modalMode}
        onClose={closeModal}
        title={modalTitle}
        description={modalMode === "included" ? "Activa una promoción del plan sobre una oferta válida." : modalMode === "extra" ? "Elige la duración y la oferta antes de pagar." : "Confirma el plan que deseas contratar o renovar."}
        size="xl"
        footer={modalMode && (
          <>
            <button type="button" onClick={closeModal} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
            {modalMode === "extra" && checkoutReview && <button type="button" onClick={() => { setCheckoutReview(false); setFeedback(""); }} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-brand-navy hover:bg-slate-50">Modificar selección</button>}
            <button type="button" onClick={handleAction} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white transition hover:bg-brand-navy-light">
              {modalMode === "included" ? "Confirmar activación" : modalMode === "extra" && !checkoutReview ? "Revisar compra" : "Continuar al pago"}<ArrowRight size={16} />
            </button>
          </>
        )}
      >
        {modalMode === "plan" && selectedPlan && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Plan seleccionado</p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-3"><h3 className="text-xl font-bold text-brand-navy">{selectedPlan.name}</h3><strong className="text-2xl text-brand-navy">{formatPrice(selectedPlan.price)} MXN</strong></div>
              <p className="mt-2 text-sm text-slate-600">{describePlanCapacity(selectedPlan)} · {describeIncludedPromotions(selectedPlan)}</p>
              <p className="mt-1 text-sm text-slate-600">Vigencia: 30 días desde la confirmación del pago. Renovación manual.</p>
            </div>
            <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">Al sustituir el plan vigente se inicia un periodo nuevo, sin prorrateo. Se pierden activaciones incluidas no utilizadas; las promociones ya activas mantienen su vigencia.</p>
          </div>
        )}
        {modalMode === "included" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-brand-gold-soft px-4 py-3 text-sm"><span className="font-semibold text-brand-navy">Incluida en {currentPlan.name} · {durationDays} días</span><span className="font-bold text-brand-navy">Sin costo adicional</span></div>
            <OfferSelect offers={previewOffers} days={durationDays} selected={selectedOfferId} onChange={(id) => { setSelectedOfferId(id); setFeedback(""); }} />
            <p className="text-xs leading-5 text-slate-500">La activación consumirá una de las {availableIncluded} disponibles de este periodo cuando el servidor confirme la operación.</p>
          </div>
        )}
        {modalMode === "extra" && (
          <div className="space-y-5">
            {!checkoutReview ? (
              <>
                <div>
                  <p className="mb-2 text-sm font-bold text-brand-navy">Duración de la promoción</p>
                  <div className="grid grid-cols-3 gap-2">
                    {PROMOTION_CATALOG.map((rate) => (
                      <button type="button" key={rate.days} onClick={() => { setSelectedDays(rate.days); setSelectedOfferId(""); setFeedback(""); }} className={`min-h-16 rounded-xl border px-3 py-3 text-center text-sm transition ${selectedDays === rate.days ? "border-brand-navy bg-[#edf1fb] font-bold text-brand-navy ring-1 ring-brand-navy/15" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                        <span className="block">{rate.days} días</span><span className="mt-1 block text-xs">{formatPrice(rate.price)} MXN</span>
                      </button>
                    ))}
                  </div>
                </div>
                <OfferSelect offers={previewOffers} days={selectedDays} selected={selectedOfferId} onChange={(id) => { setSelectedOfferId(id); setFeedback(""); }} />
              </>
            ) : (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-[#f7f9fc] p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Resumen previo al pago</p>
                <div className="flex flex-wrap justify-between gap-3"><span className="text-sm text-slate-600">Promoción adicional de {selectedDays} días</span><strong className="text-lg text-brand-navy">{formatPrice(selectedRate.price)} MXN</strong></div>
                <div className="border-t border-slate-200 pt-4"><p className="text-xs text-slate-500">Oferta seleccionada</p><p className="mt-1 text-sm font-semibold text-brand-navy">{selectedOffer?.name}</p></div>
                <p className="flex gap-2 text-xs leading-5 text-slate-600"><Info size={15} className="mt-0.5 shrink-0" /> La promoción se creará sobre esta oferta únicamente al confirmarse el pago. No se guarda para utilizarla después.</p>
              </div>
            )}
          </div>
        )}
        {feedback && <p role="status" aria-live="polite" className="mt-5 rounded-xl border border-slate-200 bg-[#eef2fa] px-4 py-3 text-sm leading-6 text-brand-navy">{feedback}</p>}
      </Modal>
    </DashboardShell>
  );
}
