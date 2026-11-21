"use client";

import { useMemo, useState } from "react";
import { Building2, Clock3, MapPin, Search, SlidersHorizontal, X } from "lucide-react";

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
    axis: "Innovación",
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
  const [type, setType] = useState("Todas");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return offers.filter((offer) => {
      const matchesSearch = !term || `${offer.title} ${offer.company} ${offer.skills.join(" ")}`.toLowerCase().includes(term);
      const matchesType = type === "Todas" || offer.type === type;
      return matchesSearch && matchesType;
    });
  }, [search, type]);

  return (
    <>
      <div className="grid gap-7 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4"><span className="flex items-center gap-2 text-base font-bold text-brand-navy"><SlidersHorizontal size={18} /> Filtros activos</span><button className="text-xs font-medium text-slate-500 underline">Limpiar</button></div>
          <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="type-filter">Tipo de oportunidad</label>
          <select id="type-filter" value={type} onChange={(event) => setType(event.target.value)} className="select-chevron mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700">
            {['Todas', 'Empleo', 'Becariado', 'Prácticas', 'Servicio social'].map((value) => <option key={value}>{value}</option>)}
          </select>
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-sm font-semibold text-slate-700">Modalidad</p>
            <div className="mt-3 space-y-2.5">
              {['Presencial', 'Híbrida', 'Remota'].map((value) => (
                <label key={value} className="flex items-center gap-2.5 text-sm text-slate-600"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-brand-navy" /> {value}</label>
              ))}
            </div>
          </div>
          <div className="mt-5 border-t border-slate-100 pt-5"><p className="text-sm font-semibold text-slate-700">Eje de acción</p><div className="mt-3 space-y-2.5">{['Ciencia y tecnología', 'Industria y energía', 'Salud', 'Educación'].map((value) => <label key={value} className="flex items-center gap-2.5 text-sm text-slate-600"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-brand-navy" /> {value}</label>)}</div></div>
          <button className="mt-6 w-full rounded-lg bg-brand-navy px-4 py-3 text-sm font-semibold text-white">Aplicar filtros</button>
        </aside>

        <section>
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm shadow-sm" placeholder="Buscar por puesto, empresa o habilidad" aria-label="Buscar ofertas" />
          </div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-600"><strong className="text-slate-900">{filtered.length}</strong> oportunidades de demostración</p>
            <select className="select-chevron rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700" aria-label="Ordenar ofertas"><option>Más recientes</option><option>Relevancia</option></select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
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
