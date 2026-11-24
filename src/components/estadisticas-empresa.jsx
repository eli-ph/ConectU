"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CalendarDays, FileText, Filter, Megaphone, RotateCcw, Smile, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Modal } from "@/components/dashboard-ui";
import { MonthRangeSelector } from "@/components/month-range-selector";

const quickPeriods = [["30", "Último mes"], ["90", "Últimos 3 meses"], ["180", "Últimos 6 meses"], ["365", "Últimos 12 meses"]];
const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const number = new Intl.NumberFormat("es-MX");
const decimal = new Intl.NumberFormat("es-MX", {maximumFractionDigits:1, minimumFractionDigits:1});
const percent = (n,d) => d ? n/d*100 : 0;
const fecha = value => new Intl.DateTimeFormat("es-MX",{timeZone:"UTC",day:"numeric",month:"short"}).format(new Date(value+"T12:00:00Z"));
const monthLabel = value => `${monthNames[Number(value.slice(5))-1]} ${value.slice(0,4)}`;
const periodLabel = (value,start,end) => value === "personalizado" ? `${monthLabel(start)} – ${monthLabel(end)}` : quickPeriods.find(p=>p[0]===value)?.[1] || "Último mes";
const statusConfig = [
 {id:"review",keys:["enviada","en_revision"],title:"Enviadas / En revisión",description:"Postulaciones pendientes de una resolución.",dotClass:"bg-brand-navy",pillClass:"bg-[#eeefff] text-indigo-700",barClass:"bg-brand-navy"},
 {id:"accepted",keys:["aceptada"],title:"Aceptadas",description:"Postulaciones aceptadas por la empresa.",dotClass:"bg-[#9e7400]",pillClass:"bg-brand-gold-soft text-[#8b6600]",barClass:"bg-[#9e7400]"},
 {id:"rejected",keys:["rechazada"],title:"Rechazadas",description:"Postulaciones rechazadas por la empresa.",dotClass:"bg-rose-600",pillClass:"bg-rose-50 text-rose-600",barClass:"bg-rose-600"},
 {id:"withdrawn",keys:["retirada"],title:"Retiradas por estudiante",description:"Solicitudes retiradas voluntariamente.",dotClass:"bg-slate-400",pillClass:"bg-slate-100 text-slate-600",barClass:"bg-slate-400"},
 {id:"closed",keys:["cerrada"],title:"Cerradas",description:"Postulaciones cerradas sin resolución activa.",dotClass:"bg-[#f5c22b]",pillClass:"bg-brand-gold-soft text-[#8b6600]",barClass:"bg-[#f5c22b]"}
];

export function EstadisticasEmpresa({datos}) {
  const router=useRouter();
  const [navigating,startTransition]=useTransition();
  const f=datos.filtros;
  // Al entrar desde el historial o desde una navegación cacheada, consultar de nuevo.
  // refresh actualiza el Server Component sin recargar el documento ni perder el formulario.
  const refreshedOnMount=useRef(false);
  useEffect(()=>{
    if(refreshedOnMount.current)return;
    refreshedOnMount.current=true;
    router.refresh();
  },[router]);
  const [period,setPeriod]=useState(f.periodo);
  const [periodDialogOpen,setPeriodDialogOpen]=useState(false);
  const [draftPeriod,setDraftPeriod]=useState(f.periodo);
  const [customStart,setCustomStart]=useState(f.inicio);
  const [customEnd,setCustomEnd]=useState(f.fin);
  const [chosenRange,setChosenRange]=useState({inicio:f.inicio,fin:f.fin});
  const [selectedOffer,setSelectedOffer]=useState(String(f.ofertaId??""));
  const [specialty,setSpecialty]=useState(String(f.ejeId??""));
  const openPeriod=()=>{setDraftPeriod(period);setCustomStart(chosenRange.inicio);setCustomEnd(chosenRange.fin);setPeriodDialogOpen(true);};
  const periodSummary=periodLabel(draftPeriod,customStart,customEnd);
  const months=(Number(customEnd.slice(0,4))-Number(customStart.slice(0,4)))*12+Number(customEnd.slice(5))-Number(customStart.slice(5))+1;
  const invalidCustomRange=draftPeriod==="personalizado" && (!customStart||!customEnd||customStart>customEnd||customEnd>f.hoy.slice(0,7)||months>12||!/^20\d{2}-(0[1-9]|1[0-2])$/.test(customStart)||!/^20\d{2}-(0[1-9]|1[0-2])$/.test(customEnd));
  const applyPeriodSelection=()=>{if(invalidCustomRange)return;setPeriod(draftPeriod);setChosenRange({inicio:customStart,fin:customEnd});setPeriodDialogOpen(false);};
  const handleApplyFilters=e=>{
    e.preventDefault();
    const q=new URLSearchParams({periodo:period});
    if(period==="personalizado"){q.set("inicio",chosenRange.inicio);q.set("fin",chosenRange.fin);}
    if(selectedOffer)q.set("oferta",selectedOffer);
    if(specialty)q.set("eje",specialty);
    const sameFilters=period===f.periodo && selectedOffer===String(f.ofertaId??"") && specialty===String(f.ejeId??"")
      && (period!=="personalizado" || (chosenRange.inicio===f.inicio && chosenRange.fin===f.fin));
    startTransition(()=>{if(sameFilters)router.refresh();else router.push(`/empresa/estadisticas?${q.toString()}`);});
  };
  const handleResetFilters=()=>{
    setPeriod("30");setDraftPeriod("30");setSelectedOffer("");setSpecialty("");
    if(f.periodo==="30")setChosenRange({inicio:f.inicio,fin:f.fin});
    startTransition(()=>{
      if(f.periodo==="30" && f.ofertaId==null && f.ejeId==null)router.refresh();
      else router.push("/empresa/estadisticas");
    });
  };
  const appliedLabel=periodLabel(f.periodo,f.inicio,f.fin);
  const {activas,plazas,postulaciones,convocatorias}=datos.indicadores;
  const kpiCards=[
    {id:"active-offers",label:"OFERTAS ACTIVAS",value:number.format(activas),unit:"convocatorias",footerLeft:"Publicadas y vigentes hoy",footerRight:fecha(f.hoy),icon:Megaphone,iconBg:"bg-[#eeefff]",iconColor:"text-brand-navy",accentColor:"text-brand-navy"},
    {id:"offered-places",label:"PLAZAS OFERTADAS",value:number.format(plazas),unit:"cupos registrados",footerLeft:"Convocatorias del periodo",footerRight:`${convocatorias?decimal.format(plazas/convocatorias):"0.0"} prom./oferta`,icon:Smile,iconBg:"bg-brand-gold-soft",iconColor:"text-[#9e7400]",accentColor:"text-[#9e7400]"},
    {id:"received-apps",label:"POSTULACIONES RECIBIDAS",value:number.format(postulaciones),unit:"solicitudes",footerLeft:"Recibidas durante el periodo",footerRight:plazas?`${decimal.format(postulaciones/plazas)} por plaza`:"Sin plazas",icon:FileText,iconBg:"bg-[#eeefff]",iconColor:"text-indigo-700",accentColor:"text-indigo-700"}
  ];
  const statusBreakdown=statusConfig.map(item=>{const count=item.keys.reduce((sum,key)=>sum+(datos.estados[key]||0),0);const widthPercent=percent(count,postulaciones);return {...item,count,widthPercent,percent:`${decimal.format(widthPercent)}%`};});
  const barColors=["bg-brand-navy","bg-[#33417a]","bg-[#8b6600]","bg-slate-400"];
  const visibleOffers=datos.convocatorias.map((o,i)=>({id:o.id,title:o.titulo,applicants:o.total,placesText:`${number.format(o.plazas)} plazas registradas`,shareText:`${decimal.format(percent(o.total,postulaciones))}% del total`,barWidth:`${percent(o.total,postulaciones)}%`,barColor:barColors[i%barColors.length]}));
  const weeklyPoints=datos.semanas.map((s,i)=>({...s,label:`Sem ${i+1}`,isPeak:i===datos.indicePico,x:38+(datos.semanas.length===1?167.5:i*335/(datos.semanas.length-1)),y:96-70*(s.total/Math.max(1,datos.pico)),value:s.total}));
  const linePath=weeklyPoints.map((pt,i)=>`${i===0?"M":"L"} ${pt.x} ${pt.y}`).join(" ");
  const areaPath=weeklyPoints.length?`${linePath} L ${weeklyPoints.at(-1).x} 96 L ${weeklyPoints[0].x} 96 Z`:"";
  const peak=datos.semanas[datos.indicePico];
  const tickEvery=Math.max(1,Math.ceil(weeklyPoints.length/6));
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
                  • Datos registrados en ConectU
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
                onClick={openPeriod}
                aria-label={`Cambiar periodo de evaluación. Actual: ${periodLabel(period,chosenRange.inicio,chosenRange.fin)}`}
                title={periodLabel(period,chosenRange.inicio,chosenRange.fin)}
                className="flex min-h-11 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm font-semibold text-brand-navy outline-none transition hover:border-brand-navy/50 focus:border-brand-navy"
              >
                <span className="min-w-0 flex-1 truncate">{periodLabel(period,chosenRange.inicio,chosenRange.fin)}</span>
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
                <option value="">Todas las convocatorias ({datos.opciones.ofertas.length})</option>
                {datos.opciones.ofertas.map(item => <option key={item.id} value={String(item.id)}>{item.titulo}{item.estado === "eliminada" ? " (histórica)" : ""}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                EJE DE ACCIÓN
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="select-chevron w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-navy"
              >
                <option value="">Todos los ejes de acción</option>
                {datos.opciones.ejes.map(item=><option key={item.id} value={String(item.id)}>{item.nombre}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={navigating}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-xs font-semibold text-white transition hover:bg-brand-navy/90 disabled:opacity-50"
            >
              <Filter size={14} />
              {navigating ? "Consultando…" : "Aplicar filtros"}
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              disabled={navigating}
              aria-label="Restablecer filtros"
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-brand-navy"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500" aria-live="polite">{navigating ? "Consultando estadísticas…" : `Periodo aplicado: ${f.desde} al ${f.hasta} · ${appliedLabel}`}</p>
        </form>

        {/* Tarjetas KPI Principales */}
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

        <p className="text-xs leading-5 text-slate-500">Ofertas activas: vigentes hoy, según oferta y eje seleccionados. Las plazas corresponden a las cantidades actualmente registradas en convocatorias con vigencia registrada o postulaciones dentro del periodo; no representan un historial de cupos. Las postulaciones se cuentan por solicitud, no por estudiante único.</p>
        {/* Desglose de Estados de Postulación */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-brand-navy">
                Desglose de Estados de Postulación
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Estado actual de las {number.format(postulaciones)} postulaciones recibidas durante el periodo seleccionado.
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-brand-navy">
              <span className="h-2 w-2 rounded-full bg-brand-navy" />
              Total: {number.format(postulaciones)}
            </span>
          </div>

          {/* Barra apilada horizontal */}
          <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            {statusBreakdown.map((item) => (
              <div
                key={item.id}
                title={`${item.title}: ${item.count}`}
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
                    Solicitudes recibidas por oferta durante el periodo.
                  </p>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  Total: {number.format(postulaciones)} registros
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {visibleOffers.length===0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No hay convocatorias para los filtros seleccionados.</p>}
                {visibleOffers.map((offer) => (
                  <div key={offer.id}>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-brand-navy">
                        {offer.title}
                      </span>
                      <span className="font-bold text-brand-navy">
                        {offer.applicants}{" "}
                        <span className="font-normal text-slate-500">
                          solicitudes
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
                Filtro activo: {appliedLabel}
              </span>
              <span className="font-semibold text-[#9e7400]">
                Datos registrados en ConectU
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
                Intervalos consecutivos de hasta siete días desde el inicio del periodo seleccionado.
              </p>

              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="mb-2 flex items-center justify-between gap-2 text-[10px]">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-slate-400">
                      PICO MÁXIMO:
                    </span>{" "}
                    <strong className="font-bold text-brand-navy">{number.format(datos.pico)}</strong>{" "}
                    <span className="text-slate-400">post/sem</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold uppercase tracking-wider text-slate-400">
                      PROMEDIO:
                    </span>{" "}
                    <strong className="font-bold text-brand-navy">{decimal.format(datos.promedio)}</strong>{" "}
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
                    const isPeak = pt.isPeak;
                    return (
                      <g key={pt.inicio}>
                        <title>{`${fecha(pt.inicio)} – ${fecha(pt.fin)}: ${pt.value} postulaciones`}</title>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isPeak ? 4.5 : 3.5}
                          fill={isPeak ? "#f5c22b" : "#0c1840"}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        {(weeklyPoints.length<=7 || (Number(pt.label.slice(4))-1)%tickEvery===0 || pt===weeklyPoints.at(-1)) && <text
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
                        </text>}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-[11px] leading-4 text-slate-600">
              <TrendingUp size={15} className="mt-0.5 shrink-0 text-[#9e7400]" />
              <p>
                {peak ? <><strong className="font-bold text-brand-navy">Semana {datos.indicePico+1} · {fecha(peak.inicio)} – {fecha(peak.fin)}:</strong>{" "}{number.format(peak.total)} postulaciones recibidas (pico del periodo).</> : "No se recibieron postulaciones durante el periodo seleccionado."}
              </p>
            </div>
          </div>
        </section>
      </div>

      <Modal
        open={periodDialogOpen}
        onClose={() => setPeriodDialogOpen(false)}
        title="Seleccionar periodo de evaluación"
        description="Elige hasta 12 meses, o utiliza un periodo rápido de 30, 90, 180 o 365 días."
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
                  onStartChange={(value) => { setCustomStart(value); setDraftPeriod("personalizado"); }}
                  onEndChange={(value) => { setCustomEnd(value); setDraftPeriod("personalizado"); }}
                />
              </div>
              {invalidCustomRange && (
                <p role="status" className="mt-3 text-sm font-semibold text-rose-700">Selecciona un rango válido de hasta 12 meses, sin meses futuros.</p>
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
              {quickPeriods.map(([option,label]) => {
                const active = draftPeriod === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDraftPeriod(option)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${active ? "bg-[#8e44ff] text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 hover:text-brand-navy"}`}
                  >
                    <span>{label}</span>
                    {active && <span className="text-xs">Activo</span>}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setDraftPeriod("personalizado")}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${draftPeriod === "personalizado" ? "bg-[#8e44ff] text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 hover:text-brand-navy"}`}
              >
                <span>Rango personalizado</span>
                {draftPeriod === "personalizado" && <span className="text-xs">Activo</span>}
              </button>
            </div>
          </aside>
        </div>
      </Modal>

    </DashboardShell>
  );
}