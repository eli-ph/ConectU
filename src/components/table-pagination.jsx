"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
export function TablePagination({ page, pages, onChange, total, pageSize = 5, onPageSizeChange, label = "registros" }) {
  const safe = Math.min(Math.max(1, page), Math.max(1, pages));
  return (
    <div className="conectu-pagination flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-[#f8faff] px-4 py-3 text-xs text-slate-600">
      <div className="flex flex-wrap items-center gap-3"><span>Mostrando <strong>{total ? (safe - 1) * pageSize + 1 : 0}–{Math.min(safe * pageSize, total)}</strong> de <strong>{total}</strong> {label}</span>
        {onPageSizeChange && <label className="flex items-center gap-2">Filas: <select className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-brand-navy" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>{[5,10,20].map((size)=><option key={size} value={size}>{size}</option>)}</select></label>}
      </div>
      <nav aria-label={`Paginación de ${label}`} className="flex items-center gap-1">
        <button type="button" disabled={safe===1} onClick={() => onChange(safe-1)} aria-label="Página anterior" className="conectu-page-button"><ChevronLeft size={17}/></button>
        {Array.from({length:Math.max(1,pages)},(_,i)=>i+1).filter((n)=>n===1||n===pages||Math.abs(n-safe)<=1).map((n)=><button key={n} type="button" aria-label={`Página ${n}`} aria-current={safe===n?"page":undefined} onClick={()=>onChange(n)} className={`conectu-page-button ${n===safe?"conectu-page-active":""}`}>{n}</button>)}
        <button type="button" disabled={safe>=pages} onClick={() => onChange(safe+1)} aria-label="Página siguiente" className="conectu-page-button"><ChevronRight size={17}/></button>
      </nav>
    </div>
  );
}
