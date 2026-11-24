"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Award, CalendarPlus, CheckCircle2, Clock, Cpu, FileText, FlaskConical, FolderKanban, Info, Laptop, Pencil, Plus, RefreshCw, Rocket, RotateCcw, Search, Send, Users, X } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { CompanyCandidatesModal } from "@/components/company-candidates-modal";

import { TablePagination } from "@/components/table-pagination";
import { OFFER_TYPE_OPTIONS, OFFER_TYPE_LABELS } from "@/lib/offer-types";

const MONTHS_SHORT = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const MONTHS_LONG = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function parseIsoDate(isoString) {
  const [year, month, day] = isoString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatLongDate(isoString) {
  if (!isoString) return "Por definir";
  const date = parseIsoDate(isoString);
  return `${date.getDate()} de ${MONTHS_LONG[date.getMonth()]}, ${date.getFullYear()}`;
}

function addDaysToIso(isoString, daysToAdd) {
  const date = parseIsoDate(isoString);
  date.setDate(date.getDate() + daysToAdd);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatShortDeadline(isoString) {
  if (!isoString) return "Por definir";
  const date = parseIsoDate(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

function formatRow(o, hoy) {
  const active=o.estado_efectivo==='publicada';
  const overdue=o.estado_efectivo==='vencida';
  const draft=o.estado_efectivo==='borrador';
  const days=o.fecha_vencimiento ? Math.round((Date.parse(o.fecha_vencimiento+'T00:00:00Z')-Date.parse(hoy+'T00:00:00Z'))/86400000) : null;
  return {
    id:o.id,title:o.titulo,code:`ID: #${o.id}`,location:o.ciudad||'Sin ubicación',
    category:active?'Activas':draft?'Borradores':'Inactivas',
    type:OFFER_TYPE_LABELS[o.tipo]||o.tipo,typeFilter:o.tipo,
    places:`${o.plazas} plazas`,applicantsMain:`${o.postulaciones||0} postulaciones`,applicantsSub:'',
    closingIso:o.fecha_vencimiento||'',deadlineMain:o.fecha_vencimiento?formatShortDeadline(o.fecha_vencimiento):'Sin fecha',
    deadlineSub:days==null?'':days<0?'Vencida':`${days} días restantes`,deadlineUrgent:active&&days<=7,
    remainingLabel:days==null?'Sin fecha':`${Math.max(0,days)} días vigentes`,
    daysRemaining:days,
    promoState:o.promocion_fin&&o.promocion_fin>=hoy?'promoted':active?'available':'inactive',
    promoLabel:o.promocion_fin&&o.promocion_fin>=hoy?'Promocionada':'Sin promoción',
    status:active?'Activa':draft?'Borrador':overdue?'Vencida':'Cerrada',
    icon:o.tipo==='practicas'?Cpu:o.tipo==='servicio_social'?FlaskConical:o.tipo==='internship'?FolderKanban:Laptop,
    actionKind:draft?'publish':active?'promote':'reactivate',
  };
}

export default function CompanyOffersPage({ records=[], capacity={plan:'Gratuito',limite:10,activas:0}, hoy='', initialTab='Activas', initialMessage='', initialExtendId=null }) {
  const router=useRouter();
  const [offers, setOffers] = useState(()=>records.map(o=>formatRow(o,hoy)));
  useEffect(()=>setOffers(records.map(o=>formatRow(o,hoy))),[records,hoy]);
  const [actionError,setActionError]=useState('');
  const [actionInfo,setActionInfo]=useState(initialMessage);
  const [candidatesTarget,setCandidatesTarget] = useState(null);
  const [externalExtensionOpened,setExternalExtensionOpened] = useState(false);
  const doAction=async(id,action,extra={})=>{
    setActionError('');setActionInfo('');
    if(action==='cerrar' && !window.confirm('¿Cerrar esta oferta y liberar su cupo?')) return;
    try{
      const resp=await fetch(`/api/empresa/ofertas/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...extra})});
      const data=await resp.json();if(!resp.ok||!data.ok)throw new Error(data.message||'No pudimos realizar la operación.');
      setActionInfo('La oferta se actualizó correctamente.');
      const refreshed=await fetch('/api/empresa/ofertas',{cache:'no-store'});const body=await refreshed.json();
      if(refreshed.ok&&body.ok)setOffers(body.ofertas.map(o=>formatRow(o,hoy)));
      router.refresh();
      return true;
    }catch(error){setActionError(error.message||'No pudimos realizar la operación.');return false;}
  };

  const tabCounts = { Todas: offers.length, Activas: offers.filter((item) => item.category === "Activas").length, Inactivas: offers.filter((item) => item.category === "Inactivas").length, Borradores: offers.filter((item) => item.category === "Borradores").length };
  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("Vence: Más próxima");
  const [page, setPage] = useState(1);

  const [extendTarget, setExtendTarget] = useState(null);
  const [selectedDays, setSelectedDays] = useState(15);


  const [pageSize, setPageSize] = useState(5);

  // El dashboard puede abrir directamente el modal de prórroga de una oferta.
  useEffect(() => {
    if (!initialExtendId || externalExtensionOpened) return;
    const selected = offers.find(item => item.id === Number(initialExtendId));
    if (selected && selected.category === 'Activas') {
      setExtendTarget(selected);
      setExternalExtensionOpened(true);
    }
  }, [initialExtendId, externalExtensionOpened, offers]);

  const openExtendModal = (offer) => {
    setExtendTarget(offer);
    setSelectedDays(15);
  };

  const modalOptions = useMemo(() => {
    if (!extendTarget?.closingIso) return [];

    return [7, 15, 30].map((days) => {
      const future=addDaysToIso(hoy,days);
      const nextIso=extendTarget.closingIso>future?extendTarget.closingIso:future;
      return {
        days,
        label: `${days} días desde hoy`,
        sublabel:
          days === 7
            ? "Extensión de 7 días"
            : days === 15
            ? "Extensión de 15 días"
            : "Extensión de 30 días",
        nextIso,
        newDeadline: `Vence: ${formatShortDeadline(nextIso)}`,
        netLabel: days === 15 ? `+${days} días netos` : "",
        recommended: days === 15,
      };
    });
  }, [extendTarget]);

  const confirmExtension = async () => {
    if(!extendTarget)return;
    const ok = await doAction(extendTarget.id,'extender',{dias:selectedDays});
    if (ok) setExtendTarget(null);
  };

  const visibleOffers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return offers
      .filter((offer) => {
        const matchesTab =
          tab === "Todas"
            ? true
            : tab === "Activas"
            ? offer.category === "Activas"
            : tab === "Inactivas"
            ? offer.category === "Inactivas"
            : offer.category === "Borradores";

        const matchesType =
          typeFilter === "Todos" ? true : offer.typeFilter === typeFilter;

        const matchesQuery =
          !query ||
          offer.title.toLowerCase().includes(query) ||
          offer.code.toLowerCase().includes(query) ||
          offer.location.toLowerCase().includes(query) ||
          offer.type.toLowerCase().includes(query);

        return matchesTab && matchesType && matchesQuery;
      })
      .sort((a, b) => {
        const ta = a.closingIso ? Date.parse(`${a.closingIso}T00:00:00Z`) : Number.POSITIVE_INFINITY;
        const tb = b.closingIso ? Date.parse(`${b.closingIso}T00:00:00Z`) : Number.POSITIVE_INFINITY;
        return sortBy === "Vence: Más lejana" ? tb - ta : ta - tb;
      });
  }, [offers, tab, search, typeFilter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(visibleOffers.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pagedOffers = visibleOffers.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handlePublish = (id) => doAction(id,'publicar');
  const handleReactivate = async (id) => {
    const fechaFin=addDaysToIso(hoy,30);
    if(!window.confirm(`¿Reactivar esta oferta hasta el ${fechaFin}?`))return;
    await doAction(id,'reactivar',{fechaFin});
  };

  return (
    <DashboardShell
      role="empresa"
      title="Empresa"
      badge="CORPORATIVO"
      hidePageHeader
    >
      {/* Encabezado superior */}
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
              Mis ofertas
            </h1>
            <span className="rounded-full bg-[#eeefff] px-3 py-1 text-xs font-semibold text-brand-navy">
              {tabCounts.Activas} de {capacity.limite ?? '∞'} ofertas activas · {capacity.plan}
            </span>
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Info size={14} className="shrink-0 text-slate-400" />
            Al cerrar o eliminar una oferta se libera un cupo de forma inmediata.
          </p>
        </div>

        <Link
          href="/empresa/ofertas/nueva"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-navy/90"
        >
          <Plus size={15} />
          Crear nueva oferta
        </Link>
      </div>

      {actionError && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{actionError}</div>}
      {actionInfo && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{actionInfo}</div>}
      {/* Contenedor principal de pestañas, filtros y tabla */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div className="flex gap-6 overflow-x-auto border-b border-slate-200/80 px-5 pt-3">
          {["Todas", "Activas", "Inactivas", "Borradores"].map((item) => {
            const active = tab === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => { setTab(item); setPage(1); }}
                className={`relative flex items-center gap-2 whitespace-nowrap pb-3 text-xs font-semibold transition sm:text-sm ${
                  active
                    ? "text-brand-navy"
                    : "text-slate-500 hover:text-brand-navy"
                }`}
              >
                <span>{item}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    active
                      ? "bg-brand-navy text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tabCounts[item]}
                </span>
                {active && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-navy" />
                )}
              </button>
            );
          })}
        </div>

        {/* Barra de búsqueda y selectores */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 focus-within:border-brand-navy focus-within:bg-white">
            <Search size={15} className="shrink-0 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por cargo, ID de convocatoria o especialidad técnica..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="select-chevron rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-navy"
            >
              <option value="Todos">Tipo: Todos</option>
              {OFFER_TYPE_OPTIONS.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="select-chevron rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-navy"
            >
              <option value="Vence: Más próxima">Vence: Más próxima</option>
              <option value="Vence: Más lejana">Vence: Más lejana</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("Todos");
                setSortBy("Vence: Más próxima");
                router.refresh();
                setPage(1);
              }}
              aria-label="Actualizar listado"
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-brand-navy"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Tabla de escritorio */}
        <div className="hidden overflow-x-auto xl:block">
          <table className="conectu-table w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">OFERTA / CONVOCATORIA</th>
                <th className="px-3 py-3">TIPO</th>
                <th className="px-3 py-3">PLAZAS</th>
                <th className="px-3 py-3">POSTULACIONES</th>
                <th className="px-3 py-3">VENCIMIENTO</th>
                <th className="px-3 py-3">PROMOCIÓN</th>
                <th className="px-3 py-3">ESTADO</th>
                <th className="px-5 py-3 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {pagedOffers.map((offer) => {
                const OfferIcon = offer.icon;
                return (
                  <tr
                    key={offer.id}
                    className="transition hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200/80 bg-slate-50 text-brand-navy">
                          <OfferIcon size={15} />
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/empresa/ofertas/${offer.id}`}
                            className="block font-bold text-brand-navy hover:underline"
                          >
                            {offer.title}
                          </Link>
                          <p className="mt-0.5 text-[11px] text-slate-400">
                            {offer.code} • {offer.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4">
                      <span className="rounded-md bg-[#eeefff] px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                        {offer.type}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 font-semibold text-slate-700">
                      {offer.places}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4">
                      <p className="flex items-center gap-1.5 font-semibold text-brand-navy">
                        <Users size={13} className="text-slate-400" />
                        {offer.applicantsMain}
                      </p>
                      {offer.applicantsSub && (
                        <p className="mt-0.5 text-[11px] font-medium text-[#8b6600]">
                          {offer.applicantsSub}
                        </p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4">
                      <p
                        className={`font-semibold ${
                          offer.deadlineUrgent
                            ? "text-rose-600"
                            : offer.deadlineMain === "Por definir" ||
                              offer.deadlineMain === "Finalizada"
                            ? "text-slate-400"
                            : "text-brand-navy"
                        }`}
                      >
                        {offer.deadlineMain}
                      </p>
                      {offer.deadlineSub && (
                        <p
                          className={`mt-0.5 text-[11px] ${
                            offer.deadlineUrgent
                              ? "font-semibold text-rose-600"
                              : "text-[#8b6600]"
                          }`}
                        >
                          • {offer.deadlineSub}
                        </p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4">
                      {offer.promoState === "promoted" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold-soft px-2.5 py-1 text-[11px] font-bold text-[#765600]">
                          <Rocket size={12} className="text-[#9e7400]" />
                          {offer.promoLabel}
                        </span>
                      )}
                      {offer.promoState === "available" && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">Sin promoción</span>}
                      {(offer.promoState === "inactive" ||
                        offer.promoState === "closed") && (
                        <span className="italic text-slate-400">
                          {offer.promoLabel}
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4">
                      {offer.status === "Activa" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Activa
                        </span>
                      )}
                      {offer.status === "Borrador" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Borrador
                        </span>
                      )}
                      {(offer.status === "Cerrada" || offer.status === "Vencida") && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Cerrada
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {offer.actionKind === "publish" && (
                          <button
                            type="button"
                            onClick={() => handlePublish(offer.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-brand-navy px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-brand-navy/90"
                          >
                            <Send size={12} />
                            Publicar
                          </button>
                        )}

                        {offer.actionKind === "reactivate" && (
                          <button
                            type="button"
                            onClick={() => handleReactivate(offer.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-brand-navy transition hover:bg-slate-50"
                          >
                            <RotateCcw size={12} />
                            Reactivar
                          </button>
                        )}

                        {/* Candidatos: consulta y resolución desde el modal, con permisos de servidor. */}
                        <button type="button" onClick={() => setCandidatesTarget(offer)} aria-label={`Ver candidatos de ${offer.title}`} title="Ver candidatos" className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-brand-navy">
                          <Users size={16} />
                        </button>

                        {/* 2. Reloj -> Abre el modal de Extender Vigencia */}
                        {offer.category === "Activas" && (
                          <button
                            type="button"
                            onClick={() => openExtendModal(offer)}
                            aria-label={`Consultar extensión de vigencia de ${offer.title}`}
                            title={offer.daysRemaining>7?`Disponible cuando falten 7 días o menos; actualmente faltan ${offer.daysRemaining}`:'Extender vigencia'}
                            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-brand-navy"
                          >
                            <Clock size={15} />
                          </button>
                        )}

                        {/* 3. Lápiz -> Abre el modal de Editar Oferta */}
                        <Link href={`/empresa/ofertas/${offer.id}/editar`} aria-label={`Editar ${offer.title}`} title="Editar oferta" className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-brand-navy">
                          <Pencil size={14} />
                        </Link>

                      </div>
                    </td>
                  </tr>
                );
              })}

              {visibleOffers.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-xs text-slate-500"
                  >
                    No se encontraron convocatorias con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Vista móvil / tablet */}
        <div className="divide-y divide-slate-100 xl:hidden">
          {pagedOffers.map((offer) => {
            const OfferIcon = offer.icon;
            return (
              <article key={offer.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-brand-navy">
                      <OfferIcon size={16} />
                    </span>
                    <div>
                      <Link
                        href={`/empresa/ofertas/${offer.id}`}
                        className="text-sm font-bold text-brand-navy hover:underline"
                      >
                        {offer.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {offer.code} • {offer.location}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    {offer.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="rounded-md bg-[#eeefff] px-2 py-0.5 font-semibold text-indigo-700">
                    {offer.type}
                  </span>
                  <span>• {offer.places}</span>
                  <span>• {offer.applicantsMain}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2">
                  <span
                    className={`text-xs font-medium ${
                      offer.deadlineUrgent ? "text-rose-600" : "text-slate-500"
                    }`}
                  >
                    {offer.deadlineMain}
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" onClick={() => setCandidatesTarget(offer)} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy"><Users size={13} />Candidatos</button>
                    {offer.category === 'Activas' && <button
                      type="button"
                      onClick={() => openExtendModal(offer)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy"
                    >
                      <Clock size={13} />
                      Vigencia
                    </button>}
                    {offer.category === 'Borradores' && <button type="button" onClick={()=>handlePublish(offer.id)} className="text-xs font-bold text-brand-navy">Publicar</button>}
                    {offer.category === 'Inactivas' && <button type="button" onClick={()=>handleReactivate(offer.id)} className="text-xs font-bold text-brand-navy">Reactivar</button>}
                    <Link href={`/empresa/ofertas/${offer.id}/editar`} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy"><Pencil size={13} />Editar</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <TablePagination page={safePage} pages={pageCount} onChange={setPage} total={visibleOffers.length} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} label="ofertas" />
      </section>

      {/* Banner inferior dorado de promoción */}
      <section className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-[#e5c158]/80 bg-[#fffdf5] p-5 shadow-xs lg:flex-row lg:items-center">
        <div className="flex items-start gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gold-soft text-[#9e7400]">
            <Award size={20} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-brand-navy">
              ¿Necesitas acelerar tus procesos de contratación técnica?
            </h2>
            <p className="mt-0.5 text-xs leading-5 text-slate-600">
              Puedes destacar una oferta vigente desde Plan y promociones. La visibilidad adicional no garantiza postulaciones ni contrataciones.
            </p>
          </div>
        </div>

        <Link
          href="/empresa/plan"
          className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-xl bg-[#f5c22b] px-4 py-2 text-xs font-bold text-brand-navy shadow-xs transition hover:bg-[#e6b31e]"
        >
          <Award size={14} />
          Gestionar plan o paquetes
        </Link>
      </section>

      {/* Modal 1: Extender Vigencia de Convocatoria */}
      {extendTarget && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={() => setExtendTarget(null)}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
              <div className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gold-soft text-[#9e7400]">
                  <CalendarPlus size={20} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-brand-navy sm:text-lg">
                    Extender Vigencia de Convocatoria
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Oferta: {extendTarget.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExtendTarget(null)}
                aria-label="Cerrar"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 px-6 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                <div>
                  <p className="text-[11px] font-medium text-slate-500">
                    Fecha actual de cierre:
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-brand-navy">
                    {formatLongDate(extendTarget.closingIso)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-medium text-slate-500">
                    Tiempo remanente:
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-[#9e7400]">
                    {extendTarget.remainingLabel || "12 días vigentes"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-indigo-100/90 bg-[#f5f6ff] px-3.5 py-2.5 text-[11px] text-slate-600">
                <Info size={14} className="shrink-0 text-indigo-600" />
                <p>
                  <strong className="font-bold text-brand-navy">
                    Cálculo de vigencia:
                  </strong>{" "}
                  Se toma como base la fecha actual sin reducir el vencimiento previo ni acumular días al reintentar.
                </p>
              </div>

              {extendTarget.daysRemaining > 7 ? <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
                <p className="font-bold">Aún no puedes extender esta oferta.</p>
                <p className="mt-1">La extensión se habilita cuando faltan siete días o menos para su vencimiento. A esta oferta le quedan <strong>{extendTarget.daysRemaining} días</strong>.</p>
                <p className="mt-2 text-xs">Podrás elegir una extensión gratuita de 7, 15 o 30 días cuando se abra ese periodo.</p>
              </div> : <div className="space-y-2.5 pt-0.5">
                {modalOptions.map((opt) => {
                  const isSelected = selectedDays === opt.days;
                  return (
                    <label
                      key={opt.days}
                      onClick={() => setSelectedDays(opt.days)}
                      className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3.5 transition ${
                        isSelected
                          ? "border-brand-navy bg-[#fafbff] ring-1 ring-brand-navy/15"
                          : "border-slate-200/90 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                            isSelected
                              ? "border-brand-navy bg-brand-navy"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </span>

                        <div>
                          <p className="text-xs font-bold text-brand-navy sm:text-sm">
                            {opt.label}
                          </p>
                          <p
                            className={`mt-0.5 text-[11px] ${
                              opt.recommended
                                ? "font-semibold text-[#9e7400]"
                                : "text-slate-500"
                            }`}
                          >
                            {opt.sublabel}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-brand-navy">
                          {opt.newDeadline}
                        </p>
                        {opt.netLabel && (
                          <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">
                            {opt.netLabel}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendTarget(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  {extendTarget.daysRemaining > 7 ? 'Entendido' : 'Cancelar'}
                </button>
                {extendTarget.daysRemaining <= 7 && <button
                  type="button"
                  onClick={confirmExtension}
                  className="rounded-xl bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-navy/90"
                >
                  Confirmar extensión
                </button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {candidatesTarget && <CompanyCandidatesModal
        oferta={candidatesTarget}
        onClose={() => setCandidatesTarget(null)}
        onChanged={() => router.refresh()}
      />}
    </DashboardShell>
  );
}