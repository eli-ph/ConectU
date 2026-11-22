"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  CalendarDays,
  FileText,
  Filter,
  Megaphone,
  RotateCcw,
  Smile,
  Tag,
  TrendingUp,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Modal } from "@/components/dashboard-ui";
import { MonthRangeSelector } from "@/components/month-range-selector";

const kpiCards = [
  {
    id: "active-offers",
    label: "OFERTAS ACTIVAS",
    value: "5",
    unit: "convocatorias",
    footerLeft: "Convocatorias simultáneas",
    footerRight: "100% activas",
    icon: Megaphone,
    iconBg: "bg-[#eeefff]",
    iconColor: "text-brand-navy",
    accentColor: "text-brand-navy",
  },
  {
    id: "offered-places",
    label: "PLAZAS OFERTADAS",
    value: "14",
    unit: "cupos totales",
    footerLeft: "Durante el periodo seleccionado",
    footerRight: "2.8 prom./oferta",
    icon: Smile,
    iconBg: "bg-brand-gold-soft",
    iconColor: "text-[#9e7400]",
    accentColor: "text-[#9e7400]",
  },
  {
    id: "received-apps",
    label: "POSTULACIONES RECIBIDAS",
    value: "142",
    unit: "aspirantes",
    footerLeft: "Aspirantes registrados",
    footerRight: "10.1 por vacante",
    icon: FileText,
    iconBg: "bg-[#eeefff]",
    iconColor: "text-indigo-700",
    accentColor: "text-indigo-700",
  },

];

const statusBreakdown = [
  {
    id: "review",
    count: 86,
    percent: "60.5%",
    title: "Enviadas / En revisión",
    description:
      "Expedientes recibidos pendientes de dictamen inicial.",
    dotClass: "bg-brand-navy",
    pillClass: "bg-[#eeefff] text-indigo-700",
    barClass: "bg-brand-navy",
    widthPercent: 60.5,
  },
  {
    id: "technical",
    count: 35,
    percent: "24.6%",
    title: "Evaluación técnica",
    description: "En ronda de entrevistas o prueba de ingeniería.",
    dotClass: "bg-[#f5c22b]",
    pillClass: "bg-brand-gold-soft text-[#8b6600]",
    barClass: "bg-[#f5c22b]",
    widthPercent: 24.6,
  },
  {
    id: "accepted",
    count: 7,
    percent: "4.9%",
    title: "Aceptadas",
    description:
      "Convenios de vinculación suscritos con la Institución.",
    dotClass: "bg-[#9e7400]",
    pillClass: "bg-brand-gold-soft text-[#8b6600]",
    barClass: "bg-[#9e7400]",
    widthPercent: 4.9,
  },
  {
    id: "rejected",
    count: 14,
    percent: "9.9%",
    title: "Rechazadas",
    description:
      "Perfiles que no satisfacen los requisitos mínimos.",
    dotClass: "bg-rose-600",
    pillClass: "bg-rose-50 text-rose-600",
    barClass: "bg-rose-600",
    widthPercent: 9.9,
  },
  {
    id: "withdrawn",
    count: 0,
    percent: "0.0%",
    title: "Retiradas por alumno",
    description: "Postulaciones canceladas voluntariamente.",
    dotClass: "bg-slate-400",
    pillClass: "bg-slate-100 text-slate-500",
    barClass: "bg-slate-300",
    widthPercent: 0.1,
  },
];

const offerBreakdown = [
  {
    id: "embedded",
    title: "Ingeniero Trainee Software Embebido",
    applicants: 48,
    placesText: "3 plazas abiertas",
    shareText: "33.8% del total",
    barWidth: "74%",
    barColor: "bg-brand-navy",
  },
  {
    id: "circuits",
    title: "Beca Investigación Circuitos",
    applicants: 44,
    placesText: "2 plazas abiertas",
    shareText: "31.0% del total",
    barWidth: "68%",
    barColor: "bg-[#33417a]",
  },
  {
    id: "automation",
    title: "Practicante Automatización y PLC",
    applicants: 31,
    placesText: "5 plazas abiertas",
    shareText: "21.8% del total",
    barWidth: "48%",
    barColor: "bg-[#8b6600]",
  },
  {
    id: "chemistry",
    title: "Asistente Técnico Ensayos Químicos",
    applicants: 19,
    placesText: "4 plazas abiertas",
    shareText: "13.4% del total",
    barWidth: "30%",
    barColor: "bg-slate-200",
  },
];

const weeklyPoints = [
  { label: "Sem 1", x: 38, y: 84, value: 14 },
  { label: "Sem 2", x: 105, y: 68, value: 19 },
  { label: "Sem 3", x: 172, y: 31, value: 31 },
  { label: "Sem 4", x: 239, y: 46, value: 26 },
  { label: "Sem 5 (Pico)", x: 306, y: 26, value: 36 },
  { label: "Sem 6", x: 373, y: 60, value: 22 },
];

const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const quickPeriods = ["Último mes", "Últimos 3 meses", "Últimos 6 meses", "Últimos 12 meses"];
const compactMonthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatPeriodCompact(value) {
  if (!value.startsWith("Rango personalizado · ")) return value;
  return value.replace(/^Rango personalizado · /, "").replace(/enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/g,
    (month) => compactMonthNames[monthNames.indexOf(month)]).replace(" → ", " – ");
}


function formatMonthLabel(value) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return "";
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  return `${monthNames[index] || month} ${year}`;
}


export default function CompanyStatsPage() {
  const [period, setPeriod] = useState("Último mes");
  const [periodDialogOpen, setPeriodDialogOpen] = useState(false);
  const [draftPeriod, setDraftPeriod] = useState("Último mes");
  const [customStart, setCustomStart] = useState("2026-10");
  const [customEnd, setCustomEnd] = useState("2026-11");
  const [selectedOffer, setSelectedOffer] = useState("Todas las convocatorias");
  const [specialty, setSpecialty] = useState("Todas las especialidades");
  const [appliedBanner, setAppliedBanner] = useState("");

  const visibleOffers = useMemo(() => {
    if (selectedOffer === "Todas las convocatorias") return offerBreakdown;
    return offerBreakdown.filter((item) => item.title === selectedOffer);
  }, [selectedOffer]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setAppliedBanner(
      `Filtro aplicado: ${period} • ${selectedOffer} • ${specialty}`
    );
  };

  const handleResetFilters = () => {
    setPeriod("Último mes");
    setDraftPeriod("Último mes");
    setSelectedOffer("Todas las convocatorias");
    setSpecialty("Todas las especialidades");
    setAppliedBanner("");
  };

  const periodSummary =
    draftPeriod === "Personalizado"
      ? `Rango personalizado · ${formatMonthLabel(customStart)} → ${formatMonthLabel(customEnd)}`
      : draftPeriod;

  const invalidCustomRange = draftPeriod === "Personalizado" && (!customStart || !customEnd || customStart > customEnd);

  const applyPeriodSelection = () => {
    if (invalidCustomRange) return;
    if (draftPeriod === "Personalizado") {
      setPeriod(`Rango personalizado · ${formatMonthLabel(customStart)} → ${formatMonthLabel(customEnd)}`);
    } else {
      setPeriod(draftPeriod);
    }
    setPeriodDialogOpen(false);
  };

  const linePath = weeklyPoints
    .map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
    .join(" ");

  const areaPath = `${linePath} L 373 116 L 38 116 Z`;

  return (
    <DashboardShell
      role="empresa"
      title="Empresa"
      badge="CORPORATIVO"
      hidePageHeader
    >
      <div className="space-y-5 pb-6">
        {/* Hero Banner Principal en Azul Marino */}
        <section className="relative overflow-hidden rounded-2xl bg-[#0c1840] p-6 text-white shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-0.5 font-medium text-slate-100">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  Acceso Universal • Incluido en Plan Gratuito
                </span>
                <span className="text-slate-300">
                  • Datos auditados en tiempo real
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-[32px] sm:leading-tight">
                Estadísticas y Analítica de Reclutamiento
              </h1>
              <p className="mt-1.5 text-xs leading-5 text-slate-300 sm:text-sm">
                Métricas operativas transparentes y desempeño de convocatorias.
                Acceso universal incluido de forma gratuita en todos los planes
                empresariales.
              </p>
            </div>

          </div>
        </section>

        {/* Barra de Filtros */}
        <form
          onSubmit={handleApplyFilters}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs"
        >
          <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-[1fr_1.25fr_1.15fr_auto_auto] lg:items-end">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                PERÍODO DE EVALUACIÓN
              </label>
              <button
                type="button"
                onClick={() => setPeriodDialogOpen(true)}
                aria-label={`Cambiar periodo de evaluación. Actual: ${period}`}
                title={period}
                className="flex min-h-11 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm font-semibold text-brand-navy outline-none transition hover:border-brand-navy/50 focus:border-brand-navy"
              >
                <span className="min-w-0 flex-1 truncate">{formatPeriodCompact(period)}</span>
                <CalendarDays size={18} className="shrink-0 text-brand-navy" aria-hidden="true" />
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                CONVOCATORIA ESPECÍFICA
              </label>
              <select
                value={selectedOffer}
                onChange={(e) => setSelectedOffer(e.target.value)}
                className="select-chevron w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-navy"
              >
                <option value="Todas las convocatorias">
                  Todas las convocatorias (5)
                </option>
                {offerBreakdown.map((item) => (
                  <option key={item.id} value={item.title}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                RAMA / ESPECIALIDAD
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="select-chevron w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-navy"
              >
                <option value="Todas las especialidades">
                  Todas las especialidades
                </option>
                <option value="Sistemas Embebidos e IoT">
                  Sistemas Embebidos e IoT
                </option>
                <option value="Automatización y Control">
                  Automatización y Control
                </option>
                <option value="Ingeniería Química y Lab">
                  Ingeniería Química y Lab
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-xs font-semibold text-white transition hover:bg-brand-navy/90"
            >
              <Filter size={14} />
              Aplicar Filtros
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              aria-label="Restablecer filtros"
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-brand-navy"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {appliedBanner && (
            <p className="mt-3 text-xs font-medium text-indigo-700">
              {appliedBanner}
            </p>
          )}
        </form>

        {/* 4 Tarjetas KPI Principales */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {card.label}
                    </span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${card.iconBg} ${card.iconColor}`}
                    >
                      <Icon size={15} />
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight text-brand-navy">
                      {card.value}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {card.unit}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[11px]">
                  <span className="text-slate-400">{card.footerLeft}</span>
                  <span className={`font-bold ${card.accentColor}`}>
                    {card.footerRight}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Desglose de Estados de Postulación */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-brand-navy">
                Desglose de Estados de Postulación
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Distribución de los 142 expedientes ingresados por la comunidad
                de egresados y alumnos.
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-brand-navy">
              <span className="h-2 w-2 rounded-full bg-brand-navy" />
              Total: 142
            </span>
          </div>

          {/* Barra apilada horizontal */}
          <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            {statusBreakdown.map((item) => (
              <div
                key={item.id}
                style={{ width: `${item.widthPercent}%` }}
                className={`${item.barClass} transition-all`}
              />
            ))}
          </div>

          {/* 5 Subtarjetas de estado */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {statusBreakdown.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/40 p-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.dotClass}`} />
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${item.pillClass}`}
                    >
                      {item.percent}
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-bold tracking-tight text-brand-navy">
                    {item.count}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-brand-navy">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fila Inferior: Postulaciones por Convocatoria + Postulaciones recibidas por semana */}
        <section className="grid gap-5 lg:grid-cols-12">
          {/* Izquierda: Postulaciones por Convocatoria */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs lg:col-span-7 sm:p-6">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-brand-navy">
                    Postulaciones por Convocatoria
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Aspirantes inscritos de acuerdo al programa técnico postulado.
                  </p>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  Total: 142 registros
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {visibleOffers.map((offer) => (
                  <div key={offer.id}>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-brand-navy">
                        {offer.title}
                      </span>
                      <span className="font-bold text-brand-navy">
                        {offer.applicants}{" "}
                        <span className="font-normal text-slate-500">
                          aspirantes
                        </span>
                      </span>
                    </div>

                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        style={{ width: offer.barWidth }}
                        className={`h-full rounded-full ${offer.barColor}`}
                      />
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{offer.placesText}</span>
                      <span>{offer.shareText}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5 text-[11px]">
              <span className="text-slate-400">
                Filtro activo: {period}
              </span>
              <span className="font-semibold text-[#9e7400]">
                Datos sincronizados con Dirección de Carrera
              </span>
            </div>
          </div>

          {/* Derecha: Postulaciones recibidas por semana */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs lg:col-span-5 sm:p-6">
            <div>
              <h2 className="text-base font-bold text-brand-navy">
                Postulaciones recibidas por semana
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Seguimiento semanal del flujo de expedientes recibidos durante
                las semanas incluidas en el periodo seleccionado.
              </p>

              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="mb-2 flex items-center justify-between gap-2 text-[10px]">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-slate-400">
                      PICO MÁXIMO:
                    </span>{" "}
                    <strong className="font-bold text-brand-navy">36</strong>{" "}
                    <span className="text-slate-400">post/sem</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold uppercase tracking-wider text-slate-400">
                      PROMEDIO:
                    </span>{" "}
                    <strong className="font-bold text-brand-navy">23.6</strong>{" "}
                    <span className="text-slate-400">post/sem</span>
                  </div>
                </div>

                <svg
                  viewBox="0 0 410 132"
                  className="h-36 w-full overflow-visible"
                  role="img"
                  aria-label="Gráfica de postulaciones recibidas por semana"
                >
                  <defs>
                    <linearGradient
                      id="weeklyAreaGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#0c1840" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#0c1840" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {/* Líneas horizontales guía */}
                  <line
                    x1="20"
                    y1="28"
                    x2="395"
                    y2="28"
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="20"
                    y1="62"
                    x2="395"
                    y2="62"
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="20"
                    y1="96"
                    x2="395"
                    y2="96"
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                  />

                  {/* Área sombreada */}
                  <path d={areaPath} fill="url(#weeklyAreaGrad)" />

                  {/* Línea principal */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#0c1840"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Puntos y etiquetas */}
                  {weeklyPoints.map((pt) => {
                    const isPeak = pt.label.includes("Pico");
                    return (
                      <g key={pt.label}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isPeak ? 4.5 : 3.5}
                          fill={isPeak ? "#f5c22b" : "#0c1840"}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <text
                          x={pt.x}
                          y="124"
                          textAnchor="middle"
                          className={`text-[9px] ${
                            isPeak
                              ? "fill-brand-navy font-bold"
                              : "fill-slate-400 font-medium"
                          }`}
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-[11px] leading-4 text-slate-600">
              <TrendingUp size={15} className="mt-0.5 shrink-0 text-[#9e7400]" />
              <p>
                <strong className="font-bold text-brand-navy">
                  Pico en Semana 5:
                </strong>{" "}
                36 postulaciones coincidentes con la Feria Tecnológica
                Institucional.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Modal
        open={periodDialogOpen}
        onClose={() => setPeriodDialogOpen(false)}
        title="Seleccionar periodo de evaluación"
        description="Elige el mes inicial y final, o utiliza un periodo rápido."
        size="wide"
        footer={(<>
          <button
            type="button"
            onClick={() => setPeriodDialogOpen(false)}
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-brand-navy"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={applyPeriodSelection}
            disabled={invalidCustomRange}
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-brand-navy px-4 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Aplicar periodo
          </button>
        </>)}
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
              <p className="text-sm font-semibold text-brand-navy">Rango específico</p>
              <p className="mt-1 text-xs text-slate-500">Selecciona el mes inicial y el mes final para construir un rango personalizado.</p>
              <div className="mt-4">
                <MonthRangeSelector
                  start={customStart}
                  end={customEnd}
                  onStartChange={(value) => { setCustomStart(value); setDraftPeriod("Personalizado"); }}
                  onEndChange={(value) => { setCustomEnd(value); setDraftPeriod("Personalizado"); }}
                />
              </div>
              {invalidCustomRange && (
                <p role="status" className="mt-3 text-sm font-semibold text-rose-700">El mes inicial debe ser anterior o igual al mes final.</p>
              )}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selección actual</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-brand-navy">{periodSummary}</p>
            </div>
          </div>
          <aside className="rounded-2xl border border-slate-200 bg-[#f7f6fe] p-4">
            <p className="text-sm font-semibold text-brand-navy">Periodos rápidos</p>
            <div className="mt-4 space-y-2">
              {quickPeriods.map((option) => {
                const active = draftPeriod === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDraftPeriod(option)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${active ? "bg-[#8e44ff] text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 hover:text-brand-navy"}`}
                  >
                    <span>{option}</span>
                    {active && <span className="text-xs">Activo</span>}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setDraftPeriod("Personalizado")}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${draftPeriod === "Personalizado" ? "bg-[#8e44ff] text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 hover:text-brand-navy"}`}
              >
                <span>Rango personalizado</span>
                {draftPeriod === "Personalizado" && <span className="text-xs">Activo</span>}
              </button>
            </div>
          </aside>
        </div>
      </Modal>

    </DashboardShell>
  );
}