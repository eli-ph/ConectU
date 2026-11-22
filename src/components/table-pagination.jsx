"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// Muestra un número acotado de páginas aunque existan miles de registros.
function displayedPages(current, total) {
  const numbers = new Set([1, total]);
  for (let number = Math.max(1, current - 1); number <= Math.min(total, current + 1); number++) {
    numbers.add(number);
  }
  const sorted = [...numbers].sort((a, b) => a - b);
  const result = [];
  for (let index = 0; index < sorted.length; index++) {
    const number = sorted[index];
    if (index > 0 && number - sorted[index - 1] > 1) result.push(`ellipsis-${number}`);
    result.push(number);
  }
  return result;
}

/** Navegación única para los listados de estudiantes, empresas y administración. */
export function TablePagination({
  page, pages, onChange, total, pageSize = 5,
  onPageSizeChange, label = "registros", pageSizeOptions = [5, 10, 20],
}) {
  const safePages = Math.max(1, Number(pages) || 1);
  const safe = Math.min(Math.max(1, Number(page) || 1), safePages);
  const first = total ? (safe - 1) * pageSize + 1 : 0;
  const last = Math.min(safe * pageSize, total);
  const options = [...new Set([...pageSizeOptions, pageSize])].sort((a, b) => a - b);

  return (
    <div className="conectu-pagination flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-[#f8faff] px-4 py-3 text-xs text-slate-600">
      <div className="flex flex-wrap items-center gap-3">
        <span aria-live="polite">Mostrando <strong>{first}–{last}</strong> de <strong>{total}</strong> {label}</span>
        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            Filas por página:
            <select
              aria-label={`Filas por página de ${label}`}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-brand-navy"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {options.map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
        )}
      </div>
      <nav aria-label={`Paginación de ${label}`} className="flex items-center gap-1">
        <button type="button" disabled={safe === 1} onClick={() => onChange(safe - 1)} aria-label="Página anterior" className="conectu-page-button"><ChevronLeft size={17} /></button>
        {displayedPages(safe, safePages).map((number) => typeof number === "string" ? (
          <span key={number} aria-hidden="true" className="px-1 text-slate-500">…</span>
        ) : (
          <button
            key={number}
            type="button"
            aria-label={`Página ${number}`}
            aria-current={safe === number ? "page" : undefined}
            onClick={() => onChange(number)}
            className={`conectu-page-button ${safe === number ? "conectu-page-active" : ""}`}
          >{number}</button>
        ))}
        <button type="button" disabled={safe === safePages} onClick={() => onChange(safe + 1)} aria-label="Página siguiente" className="conectu-page-button"><ChevronRight size={17} /></button>
      </nav>
    </div>
  );
}
