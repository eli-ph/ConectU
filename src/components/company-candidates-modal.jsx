"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Eye, Search, UserRound, X, XCircle } from "lucide-react";

// Registros de demostración ya representados en la gestión de oferta.
// El backend proporcionará todas las candidaturas reales del ciclo seleccionado.
const initial = [
  { id: "candidato-1", name: "David Hernández", study: "Programa académico demostrativo", status: "En revisión" },
  { id: "candidato-2", name: "Andrea Moreno", study: "Programa académico demostrativo", status: "Enviada" },
  { id: "candidato-3", name: "Luis Torres", study: "Programa académico demostrativo", status: "Aceptada" },
];

export function CompanyCandidatesModal({ offer, onClose }) {
  const [candidates, setCandidates] = useState(initial);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    if (!offer) return;
    setCandidates(initial); setQuery(""); setFeedback("");
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [offer, onClose]);
  if (!offer) return null;
  const matches = candidates.filter((candidate) => candidate.name.toLocaleLowerCase("es").includes(query.trim().toLocaleLowerCase("es")));
  const vacancies = Number.parseInt(offer.places, 10) || 0;
  const accepted = candidates.filter((candidate) => candidate.status === "Aceptada").length;
  const decide = (candidate, status) => {
    if (status === "Aceptada" && candidate.status !== "Aceptada" && vacancies > 0 && accepted >= vacancies) {
      setFeedback("No puedes aceptar más personas que plazas disponibles."); return;
    }
    setCandidates((current) => current.map((item) => item.id === candidate.id ? { ...item, status } : item));
    setFeedback(`Estado de ${candidate.name} actualizado solo en esta vista; se guardará mediante el servidor cuando esté conectado.`);
  };
  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-brand-navy-dark/55 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-label="Candidatos de la oferta" className="flex max-h-[92dvh] w-full max-w-[920px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 bg-[#f7f8fd] px-5 py-4 sm:px-6">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-brand-gold-dark">Postulaciones del ciclo actual</p><h2 className="mt-1 text-xl font-bold text-brand-navy">Candidatos de la oferta</h2><p className="mt-1 text-sm text-slate-600">{offer.title} · {offer.places}</p></div>
          <button type="button" onClick={onClose} aria-label="Cerrar modal" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg hover:bg-slate-100"><X size={20}/></button>
        </header>
        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
          <div className="relative mb-4"><Search size={17} className="pointer-events-none absolute left-3 top-3.5 text-slate-400"/><input type="search" placeholder="Buscar candidato..." value={query} onChange={(e) => setQuery(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand-navy" /></div>
          <div className="space-y-3">
            {matches.map((candidate) => <article key={candidate.id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eaf0fa] text-brand-navy"><UserRound size={19}/></span>
              <div className="min-w-0 flex-1"><p className="font-bold text-brand-navy">{candidate.name}</p><p className="text-xs text-slate-500">{candidate.study}</p><span className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${candidate.status === "Aceptada" ? "bg-emerald-50 text-emerald-700" : candidate.status === "Rechazada" ? "bg-rose-50 text-rose-700" : "bg-[#edf1ff] text-brand-navy"}`}>{candidate.status}</span></div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <Link href={`/empresa/postulaciones/${candidate.id}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-brand-navy hover:bg-slate-50"><Eye size={15}/>Ver perfil</Link>
                <button type="button" disabled={candidate.status === "Aceptada" || (vacancies > 0 && accepted >= vacancies)} onClick={() => decide(candidate,"Aceptada")} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-brand-navy px-3 text-xs font-semibold text-white disabled:opacity-50"><CheckCircle2 size={15}/>Aceptar</button>
                <button type="button" disabled={candidate.status === "Rechazada"} onClick={() => decide(candidate,"Rechazada")} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 disabled:opacity-50"><XCircle size={15}/>Rechazar</button>
              </div>
            </article>)}
            {!matches.length && <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">No se encontraron candidatos.</p>}
          </div>
          <p className="mt-4 text-xs text-slate-500">En esta versión se muestran las tres candidaturas de ejemplo disponibles en el proyecto. Al integrar SQLite se cargarán todos los postulantes de la oferta y su ciclo.</p>
          {feedback && <p role="status" className="mt-3 rounded-lg bg-[#f1f4fb] px-4 py-3 text-xs text-brand-navy">{feedback}</p>}
        </div>
        <footer className="flex justify-end border-t border-slate-200 bg-[#f7f8fd] p-4"><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-brand-navy">Cerrar</button></footer>
      </section>
    </div>
  );
}
