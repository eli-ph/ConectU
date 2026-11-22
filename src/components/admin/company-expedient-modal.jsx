"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Gavel,
  Info,
  PauseCircle,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

// Modal exclusivo del resumen administrativo. Gestión de empresas usa
// CompanyDetailModal para mostrar su expediente ampliado.
const decisions = [
  {
    value: "aprobar",
    title: "Aprobar empresa",
    description: "Habilitar publicación de ofertas y contratación de servicios.",
    icon: CheckCircle2,
  },
  {
    value: "rechazar",
    title: "Rechazar solicitud",
    description: "No aprobar la solicitud de registro empresarial.",
    icon: XCircle,
  },
  {
    value: "suspender",
    title: "Suspender cuenta",
    description: "Restringir temporalmente las funciones de la empresa.",
    icon: PauseCircle,
  },
];

export function CompanyExpedientModal({ company, onClose }) {
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const headingId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef(null);

  const open = Boolean(company);
  const reasonIsRequired = decision === "rechazar" || decision === "suspender";
  const canSubmit = Boolean(decision && confirmed && (!reasonIsRequired || reason.trim()));

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    setDecision("");
    setReason("");
    setConfirmed(false);
    setFeedback("");
  }, [company]);

  if (!open) return null;

  const selectDecision = (value) => {
    setDecision(value);
    setFeedback("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    // Las decisiones administrativas deben aplicarse mediante un servicio
    // autorizado en el servidor. La interfaz nunca modifica estados por sí sola.
    setFeedback("La decisión no se ha guardado. Esta acción se habilitará al conectar la gestión administrativa.");
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-[#071a31]/60 p-3 backdrop-blur-[5px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        className="my-auto flex max-h-[min(92dvh,850px)] w-full max-w-[650px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_28px_90px_rgba(3,17,39,0.3)]"
      >
        <header className="flex shrink-0 items-start gap-3 border-b border-slate-200 bg-[#f0f2ff] px-4 py-4 sm:px-6 sm:py-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-navy text-brand-gold" aria-hidden="true">
            <Gavel size={21} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={headingId} className="text-base font-extrabold leading-snug tracking-[-0.02em] text-brand-navy sm:text-lg">
              Confirmar decisión sobre la empresa
            </h2>
            <p id={descriptionId} className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
              <span className="font-semibold text-brand-navy">{company.name}</span>
              {company.state ? ` · Estado actual: ${company.state}` : ""}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-brand-navy focus-visible:outline-offset-2"
            aria-label="Cerrar ventana"
          >
            <X size={19} />
          </button>
        </header>

        <form id="admin-company-decision" onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
            <fieldset>
              <legend className="mb-3 text-[0.72rem] font-bold uppercase tracking-[0.065em] text-brand-navy sm:text-xs">
                1. Selección de resolución <span aria-hidden="true">*</span>
              </legend>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {decisions.map(({ value, title, description, icon: Icon }) => {
                  const selected = decision === value;
                  return (
                    <label
                      key={value}
                      className={`relative flex min-h-[144px] cursor-pointer flex-col rounded-xl border p-3.5 transition focus-within:ring-2 focus-within:ring-brand-gold focus-within:ring-offset-2 sm:min-h-[158px] ${
                        selected
                          ? "border-brand-navy bg-brand-navy text-white shadow-md"
                          : "border-[#e9edfa] bg-[#f1f3ff] text-brand-navy hover:border-brand-navy/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="decision-empresa"
                        value={value}
                        checked={selected}
                        onChange={() => selectDecision(value)}
                        className="sr-only"
                        required
                      />
                      <span className="flex items-start justify-between gap-2">
                        <Icon size={19} className={selected ? "text-brand-gold" : "text-[#ae8326]"} aria-hidden="true" />
                        <span
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                            selected ? "border-brand-gold bg-brand-gold" : "border-[#dce3ff] bg-[#dce3ff]"
                          }`}
                        />
                      </span>
                      <span className="mt-3 block text-sm font-bold leading-tight">{title}</span>
                      <span className={`mt-1.5 block text-xs leading-[1.45] ${selected ? "text-slate-200" : "text-slate-600"}`}>
                        {description}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-5 sm:mt-6">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <label htmlFor="admin-company-reason" className="text-xs font-bold text-brand-navy sm:text-sm">
                  Motivo de la decisión {reasonIsRequired ? "*" : "(opcional al aprobar)"}
                </label>
                <span className="text-[0.7rem] font-medium text-slate-500">{reason.length} / 1000 caracteres</span>
              </div>
              <textarea
                id="admin-company-reason"
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setFeedback("");
                }}
                maxLength={1000}
                required={reasonIsRequired}
                placeholder={reasonIsRequired ? "Explica el motivo de la decisión..." : "Agrega alguna observación, si es necesario..."}
                className="min-h-28 w-full resize-y rounded-xl border border-[#e5e9f5] bg-[#f3f5ff] px-4 py-3 text-sm leading-6 text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15 sm:min-h-32"
              />
              <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-500">
                <Info size={15} className="mt-0.5 shrink-0 text-[#a8791f]" aria-hidden="true" />
                {reasonIsRequired
                  ? "Es necesario indicar un motivo para rechazar o suspender una empresa."
                  : "Puedes añadir una observación para acompañar la aprobación."}
              </p>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-[#f0f2ff] px-4 py-4 text-xs leading-5 text-brand-navy sm:text-sm sm:leading-6">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => {
                  setConfirmed(event.target.checked);
                  setFeedback("");
                }}
                className="mt-1 h-4 w-4 shrink-0 accent-[#142b49]"
              />
              <span>
                Confirmo que revisé la información disponible de esta empresa y que seleccioné la decisión correcta.
              </span>
            </label>
            {feedback && (
              <p role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900 sm:text-sm">
                <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                {feedback}
              </p>
            )}
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-[#f0f2ff] px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ShieldCheck size={17} aria-hidden="true" /> Confirmar decisión
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
