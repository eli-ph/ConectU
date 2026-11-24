"use client";
import { useId, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";

const DEFAULT_SUGGESTIONS = ["JavaScript", "React", "Python", "SQL", "Docker", "Git", "Linux", "AWS", "Excel", "CAD", "IoT", "Redes"];

/** Selector de habilidades inspirado en el filtro del Catálogo: buscador arriba, etiquetas debajo. */
export function SkillPicker({ skills = [], onChange, suggestions = DEFAULT_SUGGESTIONS, label = "Buscar habilidades o herramientas", placeholder = "Ej. Python, React, SQL...", allowCustom = true }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const selectedLower = new Set(skills.map((skill) => skill.toLocaleLowerCase("es")));
  const matching = useMemo(() => suggestions.filter((item) => !selectedLower.has(item.toLocaleLowerCase("es")) && item.toLocaleLowerCase("es").includes(query.trim().toLocaleLowerCase("es"))).slice(0, 9), [query, suggestions, skills]);
  const add = (item) => {
    const value = item.trim();
    if (!allowCustom && !suggestions.some((s) => s.toLocaleLowerCase("es") === value.toLocaleLowerCase("es"))) return;
    if (value && !selectedLower.has(value.toLocaleLowerCase("es"))) onChange([...skills, value]);
    setQuery("");
  };
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600">{label}</label>
      <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-brand-navy focus-within:ring-2 focus-within:ring-brand-navy/10">
        <Search size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
        <input id={id} type="search" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); add(matching[0] || (allowCustom ? query : "")); } }} className="h-11 min-w-0 flex-1 bg-transparent text-sm text-brand-navy outline-none" placeholder={placeholder} />
        <button type="button" disabled={!query.trim() || (!allowCustom && !matching.length)} onClick={() => add(matching[0] || (allowCustom ? query : ""))} aria-label="Añadir habilidad" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-brand-navy hover:bg-slate-100 disabled:opacity-35"><Plus size={17} /></button>
      </div>
      {matching.length > 0 && <div className="flex flex-wrap gap-1.5" aria-label="Sugerencias de habilidades">
        {matching.map((item) => <button type="button" key={item} onClick={() => add(item)} className="rounded-lg bg-[#f1f3f9] px-2.5 py-1.5 text-xs font-medium text-brand-navy transition hover:bg-[#e2e9f8]">+ {item}</button>)}
      </div>}
      {!allowCustom && query.trim() && matching.length === 0 && <p className="text-xs text-slate-500">No encontramos esa habilidad en el catálogo.</p>}
      <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3" aria-label="Habilidades seleccionadas">
        {skills.length ? skills.map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-lg bg-[#edf1fb] px-2.5 py-1.5 text-xs font-semibold text-brand-navy">{item}<button type="button" aria-label={`Quitar ${item}`} className="rounded-full p-0.5 hover:bg-slate-200" onClick={() => onChange(skills.filter((s) => s !== item))}><X size={13}/></button></span>) : <span className="text-xs text-slate-500">No hay habilidades seleccionadas.</span>}
      </div>
    </div>
  );
}
