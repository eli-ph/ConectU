"use client";

import { operacionAdministracion } from "@/components/admin/admin-api";
import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, Ban, CheckCircle2, ClipboardCheck, PauseCircle, ShieldAlert, X } from "lucide-react";

const closureReasons = [
  "Incumplimiento del apoyo económico o beneficios ofrecidos",
  "Información falsa o engañosa",
  "Condiciones distintas a las aprobadas en la publicación",
  "Contenido inapropiado o discriminatorio",
  "Oferta duplicada o publicación abusiva",
  "Otra causa",
];

function ResolutionCard({ selected, title, description, icon: Icon, tone = "neutral", onClick }) {
  const styles = selected
    ? tone === "danger"
      ? "border-red-700 bg-red-700 text-white shadow-[0_8px_20px_rgba(185,28,28,.18)]"
      : tone === "warning"
        ? "border-amber-600 bg-amber-50 text-amber-900"
        : "border-brand-navy bg-brand-navy text-white shadow-[0_8px_20px_rgba(15,35,64,.16)]"
    : "border-slate-200 bg-[#f4f6ff] text-brand-navy hover:border-slate-300";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex min-h-[108px] w-full flex-col items-start rounded-2xl border px-4 py-4 text-left transition ${styles}`}
    >
      <span className={`mb-3 grid h-7 w-7 place-items-center rounded-full ${selected ? (tone === "danger" ? "bg-red-500/20" : tone === "warning" ? "bg-amber-200/70" : "bg-white/12") : "bg-white"}`}>
        <Icon size={15} />
      </span>
      <span className="text-sm font-bold leading-5">{title}</span>
      <span className={`mt-1 text-xs leading-5 ${selected ? "text-white/80" : "text-slate-500"}`}>{description}</span>
      <span className={`absolute right-4 top-4 h-3 w-3 rounded-full border ${selected ? (tone === "danger" ? "border-yellow-300 bg-yellow-300" : "border-brand-gold bg-brand-gold") : "border-[#d9def2] bg-[#d9def2]"}`} />
    </button>
  );
}

// La resolución se guarda en el servidor con bitácora y permisos.
export function OfferModerationModal({ offer, onClose, onSaved }) {
  const [decision, setDecision] = useState("mantener");
  const [reason, setReason] = useState("");
  const [justification, setJustification] = useState("");
  const [notifyStudents, setNotifyStudents] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [busy,setBusy]=useState(false);
  const modalTitle = useId();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!offer) return;
    setDecision("mantener");
    setReason("");
    setJustification("");
    setNotifyStudents(true);
    setConfirmed(false);
    setError("");
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const keyHandler = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", keyHandler);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", keyHandler);
    };
  }, [offer, onClose]);

  if (!offer) return null;

  const closingOffer = decision === "cerrar";
  const pausingOffer = decision === "pausar";
  const requiresReason = closingOffer || pausingOffer;
  const criteria = closingOffer ? "Cierre definitivo por administración" : pausingOffer ? "Pausa preventiva" : "Publicación vigente";

  async function validate(event) {
    event.preventDefault();
    setError("");
    if (requiresReason && !reason) {
      setError("Selecciona el motivo de la resolución.");
      return;
    }
    if (requiresReason && justification.trim().length < 20) {
      setError("Escribe una justificación de al menos 20 caracteres.");
      return;
    }
    if (!confirmed) {
      setError("Confirma que revisaste la oferta y su información relacionada.");
      return;
    }
    if(busy)return;
    setBusy(true);
    try{onSaved(await operacionAdministracion({operacion:"oferta",id:offer.id,decision,motivo:reason,justificacion:justification,notificar:notifyStudents,confirmed}));}
    catch(e){setError(e.message);}finally{setBusy(false);}
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-brand-navy-dark/60 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitle}
        className="relative flex max-h-[min(92dvh,940px)] w-full max-w-[830px] flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_26px_75px_rgba(0,22,49,.30)]"
      >
        <header className="flex shrink-0 items-start gap-3 border-b border-slate-200 bg-[#f4f6ff] px-5 py-4 sm:px-7 sm:py-5">
          <span className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-red-700">
            <ShieldAlert size={14} aria-hidden="true" /> Moderación de ofertas
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={modalTitle} className="text-lg font-bold leading-snug text-brand-navy sm:text-xl">
              Revisión y moderación de convocatoria
            </h2>
            <p className="mt-1 break-words text-sm text-slate-600">{offer.title}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-200/70"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={validate} className="flex min-h-0 flex-col">
          <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
            <section className="rounded-xl border border-slate-200 bg-[#f8f9fe] p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.06em] text-slate-500">Empresa</p>
                  <p className="mt-1 text-sm font-semibold text-brand-navy">{offer.company || "—"}</p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.06em] text-slate-500">Modalidad</p>
                  <p className="mt-1 text-sm font-semibold text-brand-navy">{offer.mode || "—"}</p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.06em] text-slate-500">Plazas</p>
                  <p className="mt-1 text-sm font-semibold text-brand-navy">{offer.vacancies || "—"}</p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.06em] text-slate-500">Postulantes</p>
                  <p className="mt-1 text-sm font-semibold text-red-700">{offer.applications ?? "—"}</p>
                </div>
              </div>
            </section>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.06em] text-brand-navy">
                1. Selección de resolución
              </label>
              <span className="text-xs font-medium text-slate-500">Criterio de revisión: {criteria}</span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <ResolutionCard
                selected={decision === "mantener"}
                title="Mantener activa"
                description="La vacante permanece visible en la plataforma."
                icon={CheckCircle2}
                tone="primary"
                onClick={() => { setDecision("mantener"); setError(""); }}
              />
              <ResolutionCard
                selected={decision === "cerrar"}
                title="Cerrar convocatoria"
                description="Cierre administrativo que impide la reactivación directa por la empresa."
                icon={Ban}
                tone="danger"
                onClick={() => { setDecision("cerrar"); setError(""); }}
              />

            </div>

            <div className="mt-5 grid gap-4">
              <label className="block text-sm font-semibold text-slate-700">
                Motivo de la clausura o sanción {requiresReason ? <span className="text-red-600">*</span> : null}
                <select
                  className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  {closureReasons.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Justificación detallada obligatoria {requiresReason ? <span className="text-red-600">*</span> : null}
                <textarea
                  className="mt-2 block min-h-32 w-full resize-y rounded-xl border border-slate-300 bg-[#f8f9fe] px-4 py-3 text-sm leading-6 text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
                  maxLength={600}
                  value={justification}
                  onChange={(event) => setJustification(event.target.value)}
                  placeholder="Describe la revisión realizada y el fundamento de la resolución."
                />
                <span className="mt-1 block text-right text-xs font-normal text-slate-500">{justification.length} / 600 caracteres</span>
              </label>
            </div>

            <p className="mt-4 flex gap-2 text-xs leading-5 text-slate-500">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
              Esta resolución quedará asociada al expediente administrativo de la oferta y a la bitácora de moderación.
            </p>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-[#eef2ff] px-4 py-4 text-sm leading-6 text-brand-navy">
              <input
                type="checkbox"
                checked={notifyStudents}
                onChange={(event) => setNotifyStudents(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-brand-navy"
              />
              <span>
                <span className="font-semibold">Notificar inmediatamente a los estudiantes postulados (Recomendado)</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Notificar a quienes hayan postulado cuando la vacante deje de estar disponible o cambie de estado.
                </span>
              </span>
            </label>

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-[#f6f7fd] px-4 py-4 text-sm leading-6 text-brand-navy">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => { setConfirmed(event.target.checked); setError(""); }}
                className="mt-1 h-4 w-4 shrink-0 accent-brand-navy"
              />
              <span>Confirmo que revisé la oferta y la documentación disponible antes de emitir esta resolución.</span>
            </label>

            {requiresReason && (
              <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                Acción con efectos inmediatos: la vacante dejará de ser visible en el catálogo público al confirmar la resolución.
              </p>
            )}

            {error && (
              <p role="status" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {error}
              </p>
            )}
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-[#f4f6ff] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={busy}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition ${closingOffer ? "bg-red-700 hover:bg-red-800" : pausingOffer ? "bg-amber-600 hover:bg-amber-700" : "bg-brand-navy hover:bg-brand-navy-light"}`}
            >
              <ClipboardCheck size={17} />
              {closingOffer ? "Confirmar cierre de oferta" : pausingOffer ? "Confirmar pausa temporal" : "Confirmar revisión"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
