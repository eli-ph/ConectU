"use client";

import { useMemo, useState } from "react";
import { Building2, CheckCircle2, Clock3, Laptop, MapPin, Plus, Search, SlidersHorizontal, X } from "lucide-react";

const typeOptions = [
  { value: "Empleo", label: "Empleo inicial", count: 18 },
  { value: "Prácticas", label: "Prácticas profesionales", count: 14 },
  { value: "Becariado", label: "Becariado / Trainee", count: 9 },
  { value: "Servicio social", label: "Servicio social", count: 7 },
];

const axisOptions = [
  "Ciencia y tecnología",
  "Industria y energía",
  "Salud y biotecnología",
  "Educación e impacto social",
  "Sustentabilidad y movilidad",
];

const suggestedSkills = ["AWS", "CAD", "SolidWorks", "IoT", "SQL", "Docker"];

const offers = [
  {
    id: 1,
    title: "Desarrollo frontend · nivel inicial",
    company: "Empresa tecnológica",
    type: "Becariado",
    mode: "Híbrida",
    location: "Ciudad de México",
    axis: "Ciencia y tecnología",
    description: "Participa en la construcción de interfaces web y colabora con un equipo de producto.",
    skills: ["JavaScript", "React", "Git"],
    promoted: true,
    published: "Publicada recientemente",
  },
  {
    id: 2,
    title: "Análisis de datos para operaciones",
    company: "Organización de servicios",
    type: "Prácticas",
    mode: "Remota",
    location: "México",
    axis: "Ciencia y tecnología",
    description: "Apoya el análisis de información operativa y la preparación de tableros de seguimiento.",
    skills: ["Python", "SQL", "Excel"],
    promoted: false,
    published: "Publicada recientemente",
  },
  {
    id: 3,
    title: "Apoyo en automatización de procesos",
    company: "Empresa industrial",
    type: "Servicio social",
    mode: "Presencial",
    location: "Estado de México",
    axis: "Industria y energía",
    description: "Colabora en la documentación y automatización de procesos internos de ingeniería.",
    skills: ["Procesos", "Python", "Documentación"],
    promoted: false,
    published: "Publicada recientemente",
  },
  {
    id: 4,
    title: "Ingeniería de soporte junior",
    company: "Consultoría de tecnología",
    type: "Empleo",
    mode: "Híbrida",
    location: "Ciudad de México",
    axis: "Ciencia y tecnología",
    description: "Atiende requerimientos técnicos y contribuye a mejorar las guías internas del equipo.",
    skills: ["Linux", "Redes", "Comunicación"],
    promoted: false,
    published: "Publicada recientemente",
  },
];

export function OffersCatalog() {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState(["Empleo", "Prácticas"]);
  const [selectedAxes, setSelectedAxes] = useState(["Ciencia y tecnología", "Industria y energía"]);
  const [selectedModes, setSelectedModes] = useState(["Remota"]);
  const [selectedSkills, setSelectedSkills] = useState(["Python", "React", "PLC"]);
  const [skillSearch, setSkillSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({ types: [], axes: [], modes: [], skills: [] });
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return offers.filter((offer) => {
      const matchesSearch = !term || `${offer.title} ${offer.company} ${offer.skills.join(" ")}`.toLowerCase().includes(term);
      const matchesType = activeFilters.types.length === 0 || activeFilters.types.includes(offer.type);
      const matchesAxis = activeFilters.axes.length === 0 || activeFilters.axes.includes(offer.axis);
      const matchesMode = activeFilters.modes.length === 0 || activeFilters.modes.some((mode) => offer.mode.toLowerCase().startsWith(mode.toLowerCase().slice(0, 5)));
      const matchesSkills = activeFilters.skills.length === 0 || activeFilters.skills.some((skill) => offer.skills.some((offerSkill) => offerSkill.toLowerCase().includes(skill.toLowerCase())));
      return matchesSearch && matchesType && matchesAxis && matchesMode && matchesSkills;
    });
  }, [search, activeFilters]);

  const toggleValue = (value, values, setValues) => {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const addSkill = (skill) => {
    const cleanSkill = skill.trim();
    if (cleanSkill && !selectedSkills.includes(cleanSkill)) setSelectedSkills([...selectedSkills, cleanSkill]);
    setSkillSearch("");
  };

  const applyFilters = () => setActiveFilters({
    types: [...selectedTypes],
    axes: [...selectedAxes],
    modes: [...selectedModes],
    skills: [...selectedSkills],
  });

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedAxes([]);
    setSelectedModes([]);
    setSelectedSkills([]);
    setSkillSearch("");
    setActiveFilters({ types: [], axes: [], modes: [], skills: [] });
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-7">
        <div className="h-fit space-y-4 lg:sticky lg:top-24">
          <aside className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="flex items-center gap-2 text-base font-bold text-brand-navy"><SlidersHorizontal size={18} /> Filtros activos</span>
              <button type="button" onClick={clearFilters} className="text-xs font-medium text-slate-500 underline">Limpiar filtros</button>
            </div>

            <fieldset className="mt-5">
              <div className="flex items-center justify-between gap-3"><legend className="text-xs font-bold uppercase tracking-[0.08em] text-slate-700">Tipo de oferta</legend><span className="text-[0.68rem] uppercase tracking-[0.06em] text-slate-400">Selección múltiple</span></div>
              <div className="mt-3 space-y-2.5">
                {typeOptions.map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                    <input type="checkbox" checked={selectedTypes.includes(option.value)} onChange={() => toggleValue(option.value, selectedTypes, setSelectedTypes)} className="h-4 w-4 border-slate-300 accent-brand-navy" />
                    <span className="min-w-0 flex-1">{option.label}</span>
                    <span className="rounded-full bg-[#f4f3ff] px-2 py-0.5 text-[0.68rem] text-slate-500">{option.count}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-5 border-t border-slate-100 pt-5">
              <legend className="text-xs font-bold uppercase tracking-[0.08em] text-slate-700">Eje de acción</legend>
              <div className="mt-3 space-y-2.5">
                {axisOptions.map((value) => (
                  <label key={value} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                    <input type="checkbox" checked={selectedAxes.includes(value)} onChange={() => toggleValue(value, selectedAxes, setSelectedAxes)} className="h-4 w-4 border-slate-300 accent-brand-navy" /> {value}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-5 border-t border-slate-100 pt-5">
              <div className="flex items-start justify-between gap-3"><legend className="max-w-32 text-xs font-bold uppercase leading-4 tracking-[0.08em] text-slate-700">Habilidades y herramientas</legend><span className="text-right text-[0.68rem] leading-4 text-slate-400">Filtrar por competencias</span></div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input value={skillSearch} onChange={(event) => setSkillSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addSkill(skillSearch); } }} className="h-10 w-full rounded-lg border border-slate-200 bg-[#f7f6ff] pl-9 pr-9 text-xs" placeholder="Buscar habilidad o tecnología" />
                <button type="button" onClick={() => addSkill(skillSearch)} className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-slate-500" aria-label="Agregar habilidad"><Plus size={15} /></button>
              </div>
              <div className="mt-3 flex items-center justify-between text-[0.68rem] text-slate-500"><span>Seleccionadas ({selectedSkills.length})</span><button type="button" onClick={() => setSelectedSkills([])} className="underline">Quitar todas</button></div>
              <div className="mt-2 flex flex-wrap gap-1.5">{selectedSkills.map((skill) => <button type="button" key={skill} onClick={() => setSelectedSkills(selectedSkills.filter((item) => item !== skill))} className="inline-flex items-center gap-1 rounded-full bg-brand-navy px-2.5 py-1 text-[0.68rem] font-semibold text-white">{skill}<X size={11} /></button>)}</div>
              <p className="mt-4 text-[0.68rem] font-semibold text-slate-500">Sugerencias populares</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{suggestedSkills.map((skill) => <button type="button" key={skill} onClick={() => addSkill(skill)} className="rounded-md bg-[#f4f3ff] px-2.5 py-1 text-[0.68rem] text-slate-600">+ {skill}</button>)}</div>
            </fieldset>

            <fieldset className="mt-5 border-t border-slate-100 pt-5">
              <legend className="text-xs font-bold uppercase tracking-[0.08em] text-slate-700">Modalidad de trabajo</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[{ value: "Remota", icon: Laptop }, { value: "Híbrida", icon: Building2 }, { value: "Presencial", icon: MapPin }].map(({ value, icon: Icon }) => {
                  const active = selectedModes.includes(value);
                  return <button type="button" key={value} onClick={() => toggleValue(value, selectedModes, setSelectedModes)} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg border px-1.5 py-2 text-[0.68rem] font-semibold ${active ? "border-brand-navy bg-brand-navy text-white" : "border-transparent bg-[#f4f3ff] text-slate-600"}`}><Icon size={15} />{value}</button>;
                })}
              </div>
            </fieldset>

            <button type="button" onClick={applyFilters} className="mt-6 w-full rounded-lg bg-brand-navy px-4 py-3 text-sm font-semibold text-white">Aplicar filtros ({offers.length})</button>
          </aside>

          <div className="rounded-xl bg-brand-navy p-5 text-white">
            <CheckCircle2 size={20} className="text-brand-gold" />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-brand-gold">Publicación empresarial</p>
            <h2 className="mt-1 text-lg font-bold">Empresas aprobadas</h2>
            <p className="mt-2 text-xs leading-5 text-slate-300">Solo las empresas que completan la revisión administrativa pueden publicar oportunidades.</p>
          </div>
        </div>

        <section>
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm shadow-sm" placeholder="Buscar por puesto, empresa o habilidad" aria-label="Buscar ofertas" />
          </div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600"><strong className="text-slate-900">{filtered.length}</strong> oportunidades de demostración</p>
            <select className="select-chevron rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700" aria-label="Ordenar ofertas"><option>Más recientes</option><option>Relevancia</option></select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 min-[1536px]:grid-cols-4 min-[1920px]:grid-cols-5">
            {filtered.map((offer) => <OfferCard key={offer.id} offer={offer} onOpen={() => setSelected(offer)} />)}
          </div>
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><p className="font-semibold text-slate-800">No encontramos coincidencias</p><p className="mt-1 text-sm text-slate-500">Prueba con otra palabra o tipo de oportunidad.</p></div>
          )}
        </section>
      </div>

      {selected && <OfferModal offer={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

export function OfferCard({ offer, onOpen }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-brand-navy"><Building2 size={21} /></span>
        {offer.promoted && <span className="rounded-full bg-brand-gold-soft px-2.5 py-1 text-xs font-semibold text-[#765600]">Promocionada</span>}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-brand-gold">{offer.type}</p>
      <h3 className="mt-1 text-lg font-semibold leading-6 text-brand-navy">{offer.title}</h3>
      <p className="mt-1 text-sm font-medium text-slate-500">{offer.company}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500"><span className="flex items-center gap-1.5"><MapPin size={14} /> {offer.mode}</span><span className="flex items-center gap-1.5"><Clock3 size={14} /> {offer.published}</span></div>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{offer.description}</p>
      <div className="mt-4 rounded-lg bg-[#f4f3ff] p-3 text-xs text-slate-600"><div className="flex items-center justify-between gap-3"><span>Plazas disponibles</span><strong className="text-slate-800">2</strong></div><div className="mt-2 flex items-center justify-between gap-3"><span>Modalidad</span><strong className="text-slate-800">{offer.mode}</strong></div></div>
      <div className="mt-4 flex flex-wrap gap-2">{offer.skills.map((skill) => <span key={skill} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{skill}</span>)}</div>
      <button type="button" onClick={onOpen} className="mt-5 w-full rounded-lg border border-brand-navy px-4 py-2.5 text-sm font-semibold text-brand-navy transition group-hover:bg-brand-navy group-hover:text-white">Ver detalles</button>
    </article>
  );
}

function OfferModal({ offer, onClose }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/55 p-4" role="dialog" aria-modal="true" aria-labelledby="offer-title">
      <button className="absolute inset-0" aria-label="Cerrar detalle" onClick={onClose} />
      <div className="relative my-6 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-5 border-b border-slate-100 p-6 sm:p-8">
          <div><p className="text-sm font-semibold text-brand-gold">{offer.type}</p><h2 id="offer-title" className="mt-1 text-2xl font-bold tracking-[-0.03em] text-brand-navy">{offer.title}</h2><p className="mt-2 text-sm text-slate-500">{offer.company} · {offer.mode}</p></div>
          <button onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200" aria-label="Cerrar"><X size={18} /></button>
        </div>
        <div className="p-6 sm:p-8">
          <div className="rounded-xl bg-slate-50 p-5"><h3 className="font-semibold text-slate-900">Descripción</h3><p className="mt-2 text-sm leading-6 text-slate-600">{offer.description} Esta vista demuestra cómo se presentará la información de una oportunidad cuando los datos reales estén conectados.</p></div>
          <div className="mt-6"><h3 className="font-semibold text-slate-900">Habilidades relacionadas</h3><div className="mt-3 flex flex-wrap gap-2">{offer.skills.map((skill) => <span key={skill} className="rounded-md bg-brand-navy/6 px-3 py-1.5 text-sm font-medium text-brand-navy">{skill}</span>)}</div></div>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={onClose} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">Cerrar</button><button className="rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white">Inicia sesión para postularte</button></div>
        </div>
      </div>
    </div>
  );
}
