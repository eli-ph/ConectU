"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, Loader2, Search, UserRound, XCircle } from "lucide-react";
import { Modal } from "@/components/dashboard-ui";
import { estadoPostulacion } from "@/lib/application-status";
import { nombreVisibleCarrera } from "@/lib/career-name";

/** Candidatos reales de la oferta, con el mismo diálogo compartido que las demás vistas. */
export function CompanyCandidatesModal({ oferta, onClose, onChanged }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const isCurrent = oferta?.category === "Activas";
  const close = () => { if (busyId === null) onClose(); };

  const cargar = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/empresa/ofertas/${oferta.id}/postulaciones`, {
        cache: "no-store", signal,
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || "No pudimos consultar las postulaciones.");
      setInfo({ oferta: result.oferta, candidatos: result.candidatos });
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message || "No pudimos consultar las postulaciones.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [oferta.id]);

  useEffect(() => {
    const controller = new AbortController();
    cargar(controller.signal);
    return () => controller.abort();
  }, [cargar]);

  const cambiarEstado = async (candidato, nuevo) => {
    const accion = nuevo === "aceptada" ? "aceptar" : "rechazar";
    if (!window.confirm(`¿Confirmas ${accion} la postulación de ${candidato.nombre} ${candidato.apellidos}?`)) return;
    setBusyId(candidato.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/empresa/postulaciones/${candidato.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevo }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || "No pudimos cambiar el estado.");
      setInfo(previous => ({
        ...previous,
        candidatos: previous.candidatos.map(c => c.id === candidato.id ? { ...c, estado: nuevo } : c),
      }));
      setNotice("La postulación se actualizó correctamente.");
      onChanged?.();
    } catch (e) {
      setError(e.message || "No pudimos cambiar el estado.");
    } finally {
      setBusyId(null);
    }
  };

  const candidatos = info?.candidatos || [];
  const total = candidatos.length;
  const aceptados = candidatos.filter(c => c.estado === "aceptada").length;
  const plazas = info?.oferta?.plazas || 0;
  const busqueda = query.trim().toLocaleLowerCase("es");
  const visibles = candidatos.filter(c => `${c.nombre} ${c.apellidos}`.toLocaleLowerCase("es").includes(busqueda));

  return <Modal
    open
    onClose={close}
    size="xl"
    title="Candidatos de la oferta"
    description={`${oferta.title}${info ? ` · ${total} ${total === 1 ? "postulación" : "postulaciones"} · ${aceptados} de ${plazas} plazas aceptadas` : ""}`}
    footer={<button type="button" onClick={close} disabled={busyId !== null} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-50 disabled:opacity-50">Cerrar</button>}
  >
    <div className="space-y-4">
      {!isCurrent && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Esta oferta no está activa. Puedes consultar las candidaturas, pero no modificar su estado.</p>}
      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      <div className="relative">
        <Search size={17} className="pointer-events-none absolute left-3 top-3.5 text-slate-400" />
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar candidato..." aria-label="Buscar candidato" className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand-navy" />
      </div>

      {loading ? <div role="status" className="flex items-center justify-center gap-2 py-12 text-sm text-slate-600"><Loader2 size={19} className="animate-spin" />Consultando postulaciones...</div>
        : !error && total === 0 ? <div className="flex flex-col items-center justify-center gap-2 py-12 text-center"><UserRound size={28} className="text-slate-400"/><p className="font-semibold text-brand-navy">Todavía no hay candidatos</p><p className="text-sm text-slate-500">Las postulaciones aparecerán aquí cuando los estudiantes las envíen.</p></div>
        : !error && visibles.length === 0 ? <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No se encontraron candidatos con esa búsqueda.</p>
        : <div className="space-y-3">
          {visibles.map(c => {
            const nombre = `${c.nombre} ${c.apellidos}`.trim();
            const editable = isCurrent && ["enviada", "en_revision"].includes(c.estado);
            const plazasLlenas = c.estado !== "aceptada" && aceptados >= plazas;
            return <article key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start gap-3 sm:items-center">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eaf0fa] text-xs font-bold text-brand-navy">{c.nombre?.[0]}{c.apellidos?.[0]}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-brand-navy">{nombre}</p>
                  <p className="mt-1 text-xs text-slate-500">{nombreVisibleCarrera(c.carrera) || "Carrera no registrada"}{c.semestre ? ` · ${c.semestre}° semestre` : ""}</p>
                  <p className="mt-1 text-xs text-slate-400">Postulación: {String(c.postulada_at || "").slice(0, 16)}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.estado === "aceptada" ? "bg-emerald-50 text-emerald-700" : c.estado === "rechazada" ? "bg-rose-50 text-rose-700" : c.estado === "en_revision" ? "bg-amber-50 text-amber-700" : "bg-[#edf1ff] text-brand-navy"}`}>{estadoPostulacion(c.estado).label}</span>
              </div>
              <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                <Link href={`/empresa/postulaciones/${c.id}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-brand-navy transition hover:bg-slate-50"><Eye size={15}/>Ver candidato</Link>
                {editable && <>
                  <button type="button" disabled={busyId !== null} onClick={() => cambiarEstado(c, "rechazada")} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"><XCircle size={15}/>Rechazar</button>
                  <button type="button" disabled={busyId !== null || plazasLlenas} title={plazasLlenas ? "Todas las plazas están ocupadas" : "Aceptar candidato"} onClick={() => cambiarEstado(c, "aceptada")} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-brand-navy px-3 text-xs font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-45"><CheckCircle2 size={15}/>Aceptar</button>
                </>}
              </div>
            </article>;
          })}
        </div>}
    </div>
  </Modal>;
}
