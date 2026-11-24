"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarClock,
  Download,
  Filter,
  Gavel,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { consultarAdministracion } from "@/components/admin/admin-api";
import { DashboardShell } from "@/components/dashboard-shell";
import { TablePagination } from "@/components/table-pagination";
import { OFFER_TYPE_OPTIONS } from "@/lib/offer-types";
import { OfferModerationModal } from "@/components/admin/offer-moderation-modal";

const metricDefinitions = [
  { title: "OFERTAS ACTIVAS", subtitle: "Publicadas y vigentes", icon: BriefcaseBusiness, iconBg: "bg-[#e6eeff]", iconColor: "text-[#18395e]", footerBg: "bg-emerald-50", footerColor: "text-emerald-700", strip: "bg-emerald-500" },
  { title: "OFERTAS POR VENCER", subtitle: "Próximas en 7 días", icon: CalendarClock, iconBg: "bg-[#fff0cb]", iconColor: "text-[#94700c]", footerBg: "bg-amber-50", footerColor: "text-amber-800", strip: "bg-[#dfb444]" },
  { title: "OFERTAS PROMOCIONADAS", subtitle: "Visibilidad preferente", icon: Sparkles, iconBg: "bg-[#fff0cb]", iconColor: "text-[#94700c]", footerBg: "bg-[#fff1cf]", footerColor: "text-[#74560c]", strip: "bg-[#b78a24]" },
  { title: "OFERTAS MODERADAS ESTE MES", subtitle: "Revisiones administrativas", icon: ShieldCheck, iconBg: "bg-[#e7eeff]", iconColor: "text-[#1b3a60]", footerBg: "bg-[#e8efff]", footerColor: "text-[#244972]", strip: "bg-brand-navy" },
];

const initialFilters = { company: "", type: "", mode: "", axis: "", promotion: "", date: "" };
const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");


function OverviewMetric({ title, subtitle, icon: Icon, iconBg, iconColor, footerBg, footerColor, strip, value }) {
  return (
    <article className="relative flex min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white px-4 pb-4 pt-4 shadow-[0_3px_16px_rgba(20,43,73,0.045)]">
      <div className="flex min-h-20 items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-[10px] font-bold uppercase leading-[1.4] tracking-[0.065em] text-slate-600 sm:text-[11px]">{title}</h2>
          <p className="mt-2 text-[2.1rem] font-extrabold leading-none tracking-[-0.04em] text-brand-navy" aria-label={`${title}: ${value ?? "cargando"}`}>{value ?? "—"}</p>
        </div>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${iconBg} ${iconColor}`}><Icon size={18} aria-hidden="true" /></span>
      </div>
      <span className={`mt-3 inline-flex w-fit max-w-full items-center rounded-md px-2 py-1 text-[10px] font-semibold leading-4 ${footerBg} ${footerColor}`}>{subtitle}</span>
      <span className={`absolute inset-x-0 bottom-0 h-[3px] ${strip}`} aria-hidden="true" />
    </article>
  );
}

function FilterField({ label, value, onChange, all, options, disabled = false }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.045em] text-slate-600">{label}</span>
      <select
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full min-w-0 rounded-lg border border-slate-100 bg-[#f5f7fd] px-2.5 text-[12px] font-medium text-brand-navy outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 disabled:opacity-75"
      >
        <option value="">{all}</option>
        {options.map((option) => <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</option>)}
      </select>
    </label>
  );
}

function TypePill({ label }) {
  return <span className="inline-flex max-w-full items-center rounded-md bg-[#eaf0fa] px-2 py-1 text-[11px] font-semibold text-brand-navy">{label}</span>;
}

function PromotionPill({ promoted }) {
  return promoted
    ? <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-[#ffdf92] px-2 py-1 text-[10px] font-bold text-[#74500b]"><Sparkles size={12} aria-hidden="true" /> Promocionada</span>
    : <span className="text-[11px] text-slate-500">Estándar</span>;
}

function ActivePill() {
  return <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Activa</span>;
}

function ReviewButton({ offer, onReview }) {
  return <button type="button" onClick={() => onReview(offer)} className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-navy px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-brand-navy-light"><Gavel size={14} aria-hidden="true" /> Revisar / Moderar</button>;
}

function MobileOffer({ offer, onReview }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[11px] font-medium text-slate-500">{offer.company}</p><h3 className="mt-1 text-sm font-bold leading-5 text-brand-navy">{offer.title}</h3></div><ActivePill /></div>
      <div className="mt-3 flex flex-wrap gap-2"><TypePill label={offer.typeLabel} /><PromotionPill promoted={offer.promoted} /></div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
        <p>Plazas: <strong className="text-brand-navy">{offer.vacancies}</strong></p><p>Postulaciones: <strong className="text-brand-navy">{offer.applications}</strong></p>
        <p>Publicación: <strong className="text-brand-navy">{offer.published}</strong></p><p>Vencimiento: <strong className="text-brand-navy">{offer.expires}</strong></p>
      </div>
      <div className="mt-4 flex justify-end"><ReviewButton offer={offer} onReview={onReview} /></div>
    </article>
  );
}

function csvCell(value) {
  const text = String(value ?? "").replace(/^[=+@\-\t\r]/, (match) => (match === "-" && value === "—" ? match : `'${match}`));
  return `"${text.replace(/"/g, '""')}"`;
}

export default function AdminOffersPage() {
  const [data,setData]=useState({ofertas:[],metricas:[]});
  const [loadState,setLoadState]=useState("Cargando ofertas…");
  useEffect(()=>{const controller=new AbortController();consultarAdministracion("ofertas",controller.signal).then(d=>{setData(d);setLoadState("");}).catch(e=>{if(!controller.signal.aborted)setLoadState(e.message);});return ()=>controller.abort();},[]);
  const uniqueOptions=field=>[...new Set(data.ofertas.map(o=>o[field]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const closeModal = useCallback(() => setSelectedOffer(null), []);

  const filteredOffers = useMemo(() => data.ofertas.filter((offer) => {
    const terms = [offer.title, offer.company, offer.axis, offer.typeLabel, offer.mode].join(" ");
    if (search.trim() && !normalize(terms).includes(normalize(search.trim()))) return false;
    if (filters.company && offer.company !== filters.company) return false;
    if (filters.type && offer.type !== filters.type) return false;
    if (filters.mode && offer.mode !== filters.mode) return false;
    if (filters.axis && offer.axis !== filters.axis) return false;
    if (filters.promotion && (filters.promotion === "yes") !== offer.promoted) return false;
    if (filters.date && offer.published !== filters.date) return false;
    return true;
  }), [data.ofertas, search, filters]);

  const pageCount = Math.max(1, Math.ceil(filteredOffers.length / perPage));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * perPage;
  const visibleOffers = filteredOffers.slice(start, start + perPage);

  function changeFilter(name, value) { setFilters((previous) => ({ ...previous, [name]: value })); setPage(1); }
  function changeSearch(value) { setSearch(value); setPage(1); }
  function resetView() { setSearch(""); setFilters(initialFilters); setPage(1); setFiltersVisible(true); }
  function exportCsv() {
    const headers = ["Oferta", "Empresa", "Tipo", "Modalidad", "Eje de acción", "Plazas", "Postulaciones", "Publicación", "Vencimiento", "Promoción", "Estado"];
    const rows = filteredOffers.map((offer) => [offer.title, offer.company, offer.typeLabel, offer.mode, offer.axis, offer.vacancies, offer.applications, offer.published, offer.expires, offer.promoted ? "Promocionada" : "Estándar", "Activa"]);
    const content = "\uFEFF" + [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a"); link.href = url; link.download = "conectu-ofertas.csv"; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <DashboardShell role="admin" title="Gestión de ofertas" eyebrow="Administración de ConectU">
      <div className="space-y-4 sm:space-y-5">
        {/* Título/acciones compactos, como en la vista de Stitch. */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <p className="max-w-2xl text-[13px] leading-5 text-slate-600">Consulta, filtra y modera las ofertas activas publicadas por las empresas aprobadas en ConectU.</p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={resetView} title="Restablecer vista" aria-label="Restablecer vista" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-brand-navy hover:bg-slate-50"><RotateCcw size={16} /></button>
            <button type="button" onClick={exportCsv} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-bold text-brand-navy hover:bg-slate-50"><Download size={15} /> Exportar CSV</button>
          </div>
        </div>

        {loadState && <p role="status" className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">{loadState}</p>}
        <section aria-label="Indicadores de ofertas" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metricDefinitions.map((metric,i) => <OverviewMetric key={metric.title} {...metric} value={data.metricas[i]} />)}
        </section>

        <section aria-label="Búsqueda y filtros de ofertas" className="rounded-xl border border-slate-100 bg-white p-3 shadow-[0_3px_15px_rgba(20,43,73,0.045)] sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Buscar ofertas</span>
              <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input type="search" value={search} onChange={(event) => changeSearch(event.target.value)} placeholder="Buscar por título de oferta, puesto o empresa empleadora..." className="h-10 w-full rounded-lg border border-slate-100 bg-[#f5f7fd] pl-10 pr-10 text-[13px] text-brand-navy outline-none placeholder:text-slate-400 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10" />
              {search && <button type="button" onClick={() => changeSearch("")} aria-label="Borrar búsqueda" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-slate-200"><X size={15} /></button>}
            </label>
            <button type="button" onClick={() => setFiltersVisible((visible) => !visible)} aria-expanded={filtersVisible} aria-controls="filtros-avanzados" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-navy px-4 text-[12px] font-bold text-white hover:bg-brand-navy-light"><Filter size={16} /> Filtrar ofertas</button>
          </div>
          {filtersVisible && (
            <div id="filtros-avanzados" className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 xl:items-end">
              <FilterField label="Empresa" value={filters.company} onChange={(v) => changeFilter("company", v)} all="Todas las empresas" options={uniqueOptions("company")} />
              <FilterField label="Tipo" value={filters.type} onChange={(v) => changeFilter("type", v)} all="Todos los tipos" options={OFFER_TYPE_OPTIONS} />
              <FilterField label="Modalidad" value={filters.mode} onChange={(v) => changeFilter("mode", v)} all="Todas" options={uniqueOptions("mode")} />
              <FilterField label="Eje de acción" value={filters.axis} onChange={(v) => changeFilter("axis", v)} all="Todos los ejes" options={uniqueOptions("axis")} />
              <FilterField label="Promoción" value={filters.promotion} onChange={(v) => changeFilter("promotion", v)} all="Todas" options={[{ value: "yes", label: "Promocionadas" }, { value: "no", label: "Estándar" }]} />
              <FilterField label="Fecha" value={filters.date} onChange={(v) => changeFilter("date", v)} all="Todas las fechas" options={uniqueOptions("published")} />
              <button type="button" onClick={resetView} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#f5f7fd] px-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-100"><RotateCcw size={14} /> Restablecer</button>
            </div>
          )}
        </section>

        <section aria-label="Directorio de ofertas vigentes" className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_3px_15px_rgba(20,43,73,0.045)]">
          <div className="flex flex-col justify-between gap-2 bg-[#eef3ff] px-4 py-3 text-[12px] sm:flex-row sm:items-center sm:gap-4">
            <div className="flex flex-wrap items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" /><span className="font-bold text-brand-navy">Directorio de ofertas vigentes</span><span className="text-slate-500">| Registros de SQLite</span></div>
            <span className="text-[11px] text-slate-500">Solo publicaciones activas</span>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {visibleOffers.length ? visibleOffers.map((offer) => <MobileOffer key={offer.id} offer={offer} onReview={setSelectedOffer} />) : <p className="py-10 text-center text-sm text-slate-500">No se encontraron ofertas con los filtros seleccionados.</p>}
          </div>

          <div className="hidden w-full overflow-x-auto md:block">
            <table className="conectu-table w-full min-w-[1080px] border-collapse text-left text-[12px]">
              <thead className="bg-[#e9f0ff] text-[10px] font-bold uppercase tracking-[0.045em] text-slate-600">
                <tr>
                  <th scope="col" className="px-3 py-3">Oferta</th>
                  <th scope="col" className="px-3 py-3">Empresa</th>
                  <th scope="col" className="px-2 py-3">Tipo</th>
                  <th scope="col" className="px-2 py-3 text-center">Plazas</th>
                  <th scope="col" className="px-2 py-3 text-center">Postulaciones</th>
                  <th scope="col" className="px-2 py-3">Publicación</th>
                  <th scope="col" className="px-2 py-3">Vencimiento</th>
                  <th scope="col" className="px-2 py-3">Promoción</th>
                  <th scope="col" className="px-2 py-3">Estado</th>
                  <th scope="col" className="px-3 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleOffers.map((offer) => (
                  <tr key={offer.id} className="even:bg-[#f8faff] hover:bg-[#f0f4fc]">
                    <td className="max-w-[225px] px-3 py-3"><div className="min-w-[180px]"><p className="font-bold leading-5 text-brand-navy">{offer.title}</p><p className="mt-0.5 text-[10px] text-slate-400">{offer.id}</p></div></td>
                    <td className="max-w-[185px] px-3 py-3"><div className="flex items-center gap-2"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#e9f0ff] text-[11px] font-bold text-brand-navy">{offer.company.charAt(0)}</span><span className="min-w-[115px] font-medium leading-4 text-slate-700">{offer.company}</span></div></td>
                    <td className="px-2 py-3"><TypePill label={offer.typeLabel} /></td>
                    <td className="px-2 py-3 text-center font-semibold text-brand-navy">{offer.vacancies}</td>
                    <td className="px-2 py-3 text-center"><span className="inline-flex items-center gap-1 text-brand-navy"><UsersRound size={13} /> {offer.applications}</span></td>
                    <td className="whitespace-nowrap px-2 py-3 text-slate-600">{offer.published}</td>
                    <td className="whitespace-nowrap px-2 py-3 text-slate-600">{offer.expires}</td>
                    <td className="px-2 py-3"><PromotionPill promoted={offer.promoted} /></td>
                    <td className="px-2 py-3"><ActivePill /></td>
                    <td className="px-3 py-3 text-right"><ReviewButton offer={offer} onReview={setSelectedOffer} /></td>
                  </tr>
                ))}
                {!visibleOffers.length && <tr><td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-500">No se encontraron ofertas con los filtros seleccionados.</td></tr>}
              </tbody>
            </table>
          </div>

          <TablePagination
            page={safePage} pages={pageCount} onChange={setPage}
            total={filteredOffers.length} pageSize={perPage}
            onPageSizeChange={(size) => { setPerPage(size); setPage(1); }}
            label="ofertas"
          />
        </section>
      </div>
      <OfferModerationModal offer={selectedOffer} onClose={closeModal} onSaved={d=>{setData(d);closeModal();}} />
    </DashboardShell>
  );
}
