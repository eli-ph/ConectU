"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

export function DemoNotice({ children = "Los contenidos de esta vista son demostrativos y se conectarán a los datos de la plataforma." }) {
  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm leading-6 text-amber-900 sm:px-5">
      <strong>Vista de demostración.</strong> {children}
    </div>
  );
}

export function Panel({ title, description, action, children, className = "" }) {
  return (
    <section className={`ui-card min-w-0 overflow-hidden ${className}`}>
      {(title || description || action) && (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div className="min-w-0">
            {title && <h2 className="ui-heading text-base sm:text-lg">{title}</h2>}
            {description && <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>}
          </div>
          {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

export const inputClass = "ui-control outline-none";
export const textareaClass = "ui-control min-h-28 resize-y py-3 outline-none";
export const primaryButton = "ui-button-primary";
export const secondaryButton = "ui-button-secondary";

export function Status({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-800 ring-amber-100",
    red: "bg-rose-50 text-rose-700 ring-rose-100",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    navy: "bg-brand-gold-soft text-brand-navy ring-brand-gold/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}

export function Modal({ open, onClose, title, description, children, footer, size = "lg" }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open]);

  if (!open) return null;
  const widths = { md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl", wide: "max-w-[1120px]" };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-brand-navy-dark/60 p-3 backdrop-blur-[3px] sm:p-6">
      <button type="button" className="absolute inset-0" aria-label="Cerrar ventana" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`relative flex max-h-[calc(100dvh-1.5rem)] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-raised sm:max-h-[min(92dvh,900px)] ${widths[size] || widths.lg}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h2 id={titleId} className="ui-heading text-lg sm:text-xl">{title}</h2>
            {description && <p id={descriptionId} className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>}
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100" aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>
        <div className="ui-modal-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:flex-wrap sm:justify-end sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ResponsiveTable({ headings, children, minWidth = "760px" }) {
  return (
    <div className="ui-table-scroll" role="region" tabIndex={0} aria-label="Tabla desplazable horizontalmente">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="border-y border-slate-200 bg-slate-50/90 text-[0.7rem] font-bold uppercase tracking-[0.055em] text-slate-500">
          <tr>{headings.map((heading) => <th scope="col" className="whitespace-nowrap px-4 py-3.5 font-bold" key={heading}>{heading}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function EmptyMetric({ label, value = "—", detail }) {
  return (
    <article className="ui-card p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-bold tracking-[-0.035em] text-brand-navy sm:text-3xl">{value}</p>
      {detail && <p className="mt-1.5 text-xs leading-5 text-slate-500">{detail}</p>}
    </article>
  );
}
