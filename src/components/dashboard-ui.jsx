"use client";

import { X } from "lucide-react";

export function DemoNotice({ children = "Los contenidos de esta vista son demostrativos y se conectarán a los datos de la plataforma." }) {
  return <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"><strong>Vista de demostración.</strong> {children}</div>;
}

export function Panel({ title, description, action, children, className = "" }) {
  return <section className={`rounded-xl border border-slate-200 bg-white ${className}`}>
    {(title || description || action) && <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>{title && <h2 className="font-bold text-brand-navy">{title}</h2>}{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>{action}
    </div>}
    {children}
  </section>;
}

export function Field({ label, hint, children, className = "" }) {
  return <label className={`block ${className}`}><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>{children}{hint && <span className="mt-1.5 block text-xs leading-5 text-slate-500">{hint}</span>}</label>;
}

export const inputClass = "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10";
export const textareaClass = "min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10";
export const primaryButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light";
export const secondaryButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

export function Status({ children, tone = "slate" }) {
  const tones = { slate: "bg-slate-100 text-slate-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-700", blue: "bg-sky-50 text-sky-700", navy: "bg-[#eeefff] text-brand-navy" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function Modal({ open, onClose, title, description, children, footer, size = "lg" }) {
  if (!open) return null;
  const widths = { md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-brand-navy-dark/55 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
    <button className="absolute inset-0" aria-label="Cerrar" onClick={onClose} />
    <div className={`relative flex max-h-[92vh] w-full ${widths[size]} flex-col overflow-hidden rounded-xl bg-white shadow-2xl`}>
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="text-lg font-bold text-brand-navy">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div><button onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Cerrar modal"><X size={19} /></button></div>
      <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      {footer && <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">{footer}</div>}
    </div>
  </div>;
}

export function ResponsiveTable({ headings, children, minWidth = "760px" }) {
  return <div className="overflow-x-auto"><table className="w-full text-left text-sm" style={{ minWidth }}><thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.05em] text-slate-500"><tr>{headings.map((heading) => <th className="px-4 py-3 font-semibold" key={heading}>{heading}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

export function EmptyMetric({ label, value = "—", detail }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-brand-navy">{value}</p>{detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}</article>;
}
