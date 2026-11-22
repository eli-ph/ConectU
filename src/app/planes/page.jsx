import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Infinity as InfinityIcon,
  Info,
  Layers3,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata = {
  title: "Planes para empresas",
  description:
    "Conoce los planes empresariales y las promociones de ConectU. El registro estudiantil y sus funciones son gratuitos.",
};

const plans = [
  {
    id: "gratuito",
    eyebrow: "PARA COMENZAR",
    name: "Plan Gratuito",
    description: "Comparte oportunidades y administra tus postulaciones sin pagar.",
    price: "$0",
    period: "Sin costo",
    capacity: "10 ofertas activas simultáneas",
    promotions: "Sin promociones incluidas",
    icon: BriefcaseBusiness,
    cta: "Comenzar gratis",
    prominent: false,
  },
  {
    id: "basico",
    eyebrow: "PARA CRECER",
    name: "Plan Básico",
    description: "Más capacidad para organizaciones con varias convocatorias vigentes.",
    price: "$99",
    period: "MXN / 30 días",
    capacity: "20 ofertas activas simultáneas",
    promotions: "1 promoción incluida de 7 días",
    icon: Zap,
    cta: "Registrar mi empresa",
    prominent: true,
  },
  {
    id: "premium",
    eyebrow: "MAYOR CAPACIDAD",
    name: "Plan Premium",
    description: "Publica múltiples oportunidades sin una cuota numérica de ofertas activas.",
    price: "$249",
    period: "MXN / 30 días",
    capacity: "Ofertas activas sin límite numérico",
    promotions: "3 promociones incluidas de 7 días",
    icon: InfinityIcon,
    cta: "Registrar mi empresa",
    prominent: false,
  },
];

const promotions = [
  {
    days: 7,
    price: "$39",
    title: "7 días",
    description: "Visibilidad adicional durante una semana.",
    icon: Clock3,
    tag: "CORTA DURACIÓN",
  },
  {
    days: 15,
    price: "$69",
    title: "15 días",
    description: "Más tiempo de prioridad en búsquedas relacionadas.",
    icon: Sparkles,
    tag: "OPCIÓN INTERMEDIA",
    featured: true,
  },
  {
    days: 30,
    price: "$119",
    title: "30 días",
    description: "Prioridad por un periodo prolongado, según la vigencia de la oferta.",
    icon: CalendarDays,
    tag: "MAYOR DURACIÓN",
  },
];

const faq = [
  {
    question: "¿Qué sucede cuando vence un plan de pago?",
    answer:
      "La cuenta vuelve al plan Gratuito. Las ofertas que ya estén activas no se cierran automáticamente, aunque superen las 10 permitidas por ese plan. Mientras exista exceso de capacidad, no podrás publicar nuevas ofertas, reactivar ni extender las existentes.",
  },
  {
    question: "¿Qué hace una promoción de oferta?",
    answer:
      "Da prioridad a la oferta en búsquedas donde cumple los filtros y la identifica como «Promocionada». No garantiza visitas, postulaciones ni contrataciones, y no oculta las ofertas sin promoción.",
  },
  {
    question: "¿Las estadísticas cambian según el plan?",
    answer:
      "No. Todas las empresas aprobadas tienen acceso al mismo panel, a las mismas estadísticas y a las funciones de gestión de postulaciones. Los planes solo cambian la capacidad de ofertas activas y las promociones incluidas.",
  },
  {
    question: "¿Puedo publicar varias plazas en una sola oferta?",
    answer:
      "Sí. Una oferta puede incluir varias plazas y solo ocupa un espacio dentro del límite del plan. La cantidad de estudiantes aceptados no podrá superar las plazas indicadas para el ciclo.",
  },
  {
    question: "¿Puedo comprar una promoción y elegir la oferta después?",
    answer:
      "Sí. Las promociones adicionales se pueden adquirir sin asignarlas de inmediato. Una vez disponible, podrás vincularla a una oferta activa desde «Mi plan», cuando esa función esté implementada.",
  },
  {
    question: "¿Los planes se renuevan automáticamente?",
    answer:
      "No. Los planes pagados duran 30 días y se renuevan manualmente. Una empresa debe contar con aprobación administrativa para contratar planes o promociones.",
  },
];

function SectionHeading({ eyebrow, title, description, centered = true }) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-gold-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.09em] text-[#795900]">
          <Sparkles size={13} aria-hidden="true" /> {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl lg:text-[2rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
      )}
    </div>
  );
}

function PlanCard({ plan }) {
  const Icon = plan.icon;

  return (
    <article
      className={`relative flex h-full min-w-0 flex-col rounded-2xl border bg-white p-5 shadow-[0_8px_32px_rgba(20,43,73,0.045)] transition-shadow hover:shadow-[0_16px_42px_rgba(20,43,73,0.10)] sm:p-6 lg:p-7 ${
        plan.prominent ? "border-[#d6a947] ring-1 ring-[#d6a947]/20" : "border-slate-200"
      }`}
    >
      {plan.prominent && (
        <div className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-brand-gold" />
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.11em] text-[#85641d]">
            {plan.eyebrow}
          </p>
          <h3 className="mt-2 text-[1.45rem] font-bold tracking-tight text-brand-navy">
            {plan.name}
          </h3>
        </div>
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
            plan.prominent
              ? "bg-brand-navy text-white"
              : "bg-[#eef1fb] text-brand-navy"
          }`}
        >
          <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-3 min-h-[3.2rem] text-sm leading-6 text-slate-600">
        {plan.description}
      </p>

      <div
        className={`mt-5 flex min-h-24 flex-wrap items-end gap-x-3 gap-y-1 rounded-xl px-5 py-4 ${
          plan.prominent ? "bg-brand-navy text-white" : "bg-[#f2f3fa] text-brand-navy"
        }`}
      >
        <span className="text-4xl font-extrabold tracking-[-0.05em] sm:text-[2.7rem]">
          {plan.price}
        </span>
        <span className={`mb-1 text-xs font-semibold ${plan.prominent ? "text-slate-200" : "text-slate-600"}`}>
          {plan.period}
        </span>
      </div>

      <div className="mt-6 flex-1 space-y-4">
        <div className="flex items-start gap-3">
          <Layers3 className="mt-0.5 shrink-0 text-[#a47720]" size={19} aria-hidden="true" />
          <span className="text-sm font-semibold leading-6 text-brand-navy">{plan.capacity}</span>
        </div>
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 shrink-0 text-[#a47720]" size={19} aria-hidden="true" />
          <span className="text-sm leading-6 text-slate-700">{plan.promotions}</span>
        </div>
        <div className="h-px bg-slate-100" />
        <div className="flex items-start gap-3">
          <Check className="mt-1 shrink-0 text-[#a47720]" size={18} aria-hidden="true" />
          <span className="text-sm leading-6 text-slate-700">Panel y estadísticas completas, sin diferencias entre planes</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="mt-1 shrink-0 text-[#a47720]" size={18} aria-hidden="true" />
          <span className="text-sm leading-6 text-slate-700">Gestión de postulaciones y múltiples plazas por oferta</span>
        </div>
      </div>

      <Link
        href="/registro/empresa"
        className={`mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${
          plan.prominent
            ? "bg-brand-navy text-white hover:bg-brand-navy-light"
            : "bg-[#e9edf9] text-brand-navy hover:bg-[#dce4f8]"
        }`}
      >
        {plan.cta} <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

function PromotionCard({ promotion }) {
  const Icon = promotion.icon;

  return (
    <article
      className={`relative flex h-full min-w-0 flex-col rounded-2xl border bg-white p-5 shadow-[0_5px_25px_rgba(20,43,73,0.04)] sm:p-6 ${
        promotion.featured ? "border-[#d0a454] ring-1 ring-[#d0a454]/25" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-brand-gold-soft px-3 py-1 text-[10px] font-bold tracking-wide text-[#795900]">
          {promotion.tag}
        </span>
        <Icon size={21} className="text-[#9a7326]" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-xl font-bold text-brand-navy">{promotion.title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{promotion.description}</p>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold tracking-tight text-brand-navy">{promotion.price}</span>
        <span className="text-xs font-medium text-slate-500">MXN</span>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        Compra adicional, independiente de las promociones incluidas en tu plan.
      </p>
      <Link
        href="/registro/empresa"
        className={`mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-sm font-semibold transition-colors ${
          promotion.featured
            ? "bg-brand-navy text-white hover:bg-brand-navy-light"
            : "bg-[#e9edf9] text-brand-navy hover:bg-[#dce4f8]"
        }`}
      >
        Registrarme para comprar <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function PlansPage() {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-[#faf9ff]">
        <section className="relative isolate overflow-hidden px-4 pb-8 pt-12 sm:px-6 sm:pb-12 sm:pt-16 lg:pt-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[15%] top-10 -z-10 h-64 rounded-full bg-[#e8e6f6]/60 blur-[85px]" />
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto max-w-[780px] text-center">
              <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-brand-gold-soft px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#795900] sm:px-4 sm:text-xs">
                <ShieldCheck size={15} className="shrink-0" aria-hidden="true" />
                Precios transparentes · Renovación manual
              </span>
              <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.035em] text-brand-navy sm:text-4xl lg:text-[3.1rem] lg:leading-tight">
                Planes para empresas
              </h1>
              <p className="mx-auto mt-5 max-w-[680px] text-sm leading-7 text-slate-600 sm:text-base">
                Elige cuántas ofertas puedes mantener activas al mismo tiempo y cuántas promociones incluye tu plan. Las funciones y estadísticas empresariales son iguales para todos.
              </p>
            </div>

            <div className="mx-auto mt-7 flex max-w-[1000px] items-start gap-3 rounded-xl border border-[#dce4f4] bg-[#edf1fb] px-4 py-3 text-xs leading-5 text-[#334b6b] sm:items-center sm:px-5 sm:text-sm">
              <Info size={18} className="mt-0.5 shrink-0 sm:mt-0" aria-hidden="true" />
              <p>
                <strong>Precios de referencia en MXN:</strong> aún no son tarifas comerciales definitivas. Los planes de pago duran 30 días, sin renovación automática. Solo las empresas aprobadas pueden contratar.
              </p>
            </div>

            <div className="mt-9 grid items-stretch gap-5 md:gap-6 lg:grid-cols-3">
              {plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Por ahora, los botones llevan al registro de empresa; la contratación y el cobro todavía no están habilitados.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-16" aria-label="Promociones adicionales">
          <div className="mx-auto max-w-[1120px]">
            <SectionHeading
              eyebrow="Mayor visibilidad"
              title="Compra de promociones adicionales"
              description="Destaca una oferta en las búsquedas relevantes durante el periodo que elijas. Puedes comprar una promoción ahora y asignarla después a una oferta activa desde Mi plan."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
              {promotions.map((promotion) => (
                <PromotionCard key={promotion.days} promotion={promotion} />
              ))}
            </div>
            <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs leading-6 text-slate-500">
              <Info size={16} className="mt-1 shrink-0" aria-hidden="true" />
              Promocionar prioriza una oferta que coincide con los filtros; no garantiza visitas, postulaciones o contrataciones.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="preguntas-frecuentes">
          <div className="mx-auto max-w-[880px]">
            <div className="text-center">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8b651b]">
                Resolvemos tus dudas
              </p>
              <h2 id="preguntas-frecuentes" className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
                Preguntas frecuentes
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Información sobre vigencia, cupos de ofertas y promociones.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              {faq.map((item) => (
                <details key={item.question} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_3px_14px_rgba(20,43,73,0.03)]">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold leading-6 text-brand-navy marker:hidden sm:px-6 sm:text-base [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <ChevronDown size={19} className="shrink-0 text-brand-navy transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-7 text-slate-600 sm:px-6">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 pt-7 sm:px-6 sm:pb-20" aria-labelledby="registro-empresa-cta">
          <div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-2xl bg-brand-navy px-6 py-9 text-white shadow-[0_20px_45px_rgba(20,43,73,0.16)] sm:px-9 sm:py-11 lg:px-12">
            <div className="absolute inset-x-0 top-0 h-1 bg-brand-gold" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div className="max-w-[640px]">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#e7c06d]">
                  <BadgeCheck size={16} aria-hidden="true" /> Vinculación con talento universitario
                </p>
                <h2 id="registro-empresa-cta" className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  ¿Listo para comenzar a reclutar?
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-200 sm:text-base">
                  Registra a tu empresa y envía sus datos para revisión administrativa. Después de la aprobación podrás publicar ofertas y contratar beneficios empresariales.
                </p>
              </div>
              <Link
                href="/registro/empresa"
                className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#c49a3a] px-6 py-3 text-center text-sm font-bold text-[#142b49] transition-colors hover:bg-[#dfb55a] sm:w-auto"
              >
                Registrar empresa <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
