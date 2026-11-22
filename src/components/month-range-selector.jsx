"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function MonthGrid({ title, value, onChange, start, end }) {
  const [displayYear, setDisplayYear] = useState(Number(value?.slice(0, 4)) || 2026);

  useEffect(() => {
    if (value) setDisplayYear(Number(value.slice(0, 4)));
  }, [value]);

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-brand-navy">
          <CalendarDays size={16} className="shrink-0 text-brand-gold-dark" aria-hidden="true" />
          <span>{title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setDisplayYear((year) => year - 1)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-brand-navy transition hover:bg-slate-50"
            aria-label={`Ver el año ${displayYear - 1} en ${title.toLowerCase()}`}
          >
            <ChevronLeft size={17} />
          </button>
          <span className="w-11 text-center text-sm font-extrabold tabular-nums text-brand-navy">{displayYear}</span>
          <button
            type="button"
            onClick={() => setDisplayYear((year) => year + 1)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-brand-navy transition hover:bg-slate-50"
            aria-label={`Ver el año ${displayYear + 1} en ${title.toLowerCase()}`}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label={`Meses del año ${displayYear}: ${title.toLowerCase()}`}>
        {MONTHS.map((month, index) => {
          const id = `${displayYear}-${String(index + 1).padStart(2, "0")}`;
          const selected = value === id;
          const inRange = start && end && start <= id && id <= end;
          return (
            <button
              type="button"
              key={id}
              onClick={() => onChange(id)}
              aria-pressed={selected}
              aria-label={`${month} de ${displayYear}`}
              className={`min-h-11 rounded-xl border px-1.5 py-2.5 text-center text-[0.8125rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-dark sm:min-h-12 ${
                selected
                  ? "border-brand-navy bg-brand-navy text-white shadow-sm"
                  : inRange
                    ? "border-[#dce5f3] bg-[#eaf0fb] text-brand-navy hover:border-brand-navy/40"
                    : "border-slate-200 bg-[#f7f9fc] text-slate-700 hover:border-brand-navy/40 hover:bg-[#edf2fc]"
              }`}
            >
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Selector de rango por mes, sin calendarios externos ni dependencias adicionales. */
export function MonthRangeSelector({ start, end, onStartChange, onEndChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <MonthGrid title="Mes de inicio" value={start} start={start} end={end} onChange={onStartChange} />
      <MonthGrid title="Mes de finalización" value={end} start={start} end={end} onChange={onEndChange} />
    </div>
  );
}
