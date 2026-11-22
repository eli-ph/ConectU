"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Laptop,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

// Datos exclusivamente ilustrativos. Sustituir por el servicio de ofertas reales
// cuando estén implementados los repositorios, permisos y ciclos en SQLite.
const demoOffers = [
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
  },
  {
    id: 5,
    title: "Diseño mecánico y prototipado 3D",
    company: "Estudio de ingeniería",
    type: "Prácticas",
    mode: "Presencial",
    location: "Ciudad de México",
    axis: "Industria y energía",
    description: "Apoya la elaboración de modelos, planos y prototipos para proyectos de desarrollo de producto.",
    skills: ["CAD", "SolidWorks", "Modelado 3D"],
    promoted: false,
  },
  {
    id: 6,
    title: "Desarrollo IoT para monitoreo",
    company: "Organización de tecnología",
    type: "Becariado",
    mode: "Remota",
    location: "México",
    axis: "Ciencia y tecnología",
    description: "Colabora en prototipos de sensores y visualización de datos para aplicaciones conectadas.",
    skills: ["IoT", "Python", "MQTT"],
    promoted: false,
  },
];

const typeOptions = [
  { value: "Empleo", label: "Empleo inicial" },
  { value: "Prácticas", label: "Prácticas profesionales" },
  { value: "Becariado", label: "Becariado" },
  { value: "Servicio social", label: "Servicio social" },
];

const axisOptions = [
  "Ciencia y tecnología",
  "Industria y energía",
  "Salud y biotecnología",
  "Educación e impacto social",
  "Sustentabilidad y movilidad",
];
const modeOptions = [
  { value: "Remota", label: "Remota", icon: Laptop },
  { value: "Híbrida", label: "Híbrida", icon: Building2 },
  { value: "Presencial", label: "Presencial", icon: MapPin },
];
const allSkills = Array.from(new Set(demoOffers.flatMap((offer) => offer.skills))).sort((a, b) => a.localeCompare(b, "es"));
const emptyFilters = () => ({ types: [], axes: [], modes: [], skills: [] });
const normalize = (text) => String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");

function matchesFilters(offer, query, filters) {
  const searchable = [offer.title, offer.company, offer.type, offer.axis, offer.mode, offer.location, offer.description, ...offer.skills].join(" ");
  return (
    (!query.trim() || normalize(searchable).includes(normalize(query.trim()))) &&
    (!filters.types.length || filters.types.includes(offer.type)) &&
    (!filters.axes.length || filters.axes.includes(offer.axis)) &&
    (!filters.modes.length || filters.modes.includes(offer.mode)) &&
    (!filters.skills.length || filters.skills.some((skill) => offer.skills.some((item) => normalize(item) === normalize(skill))))
  );
}

function orderOffers(items, sort) {
  return [...items].sort((a, b) => {
    // Una promoción prioriza coincidencias sin modificar los filtros.
    if (a.promoted !== b.promoted) return Number(b.promoted) - Number(a.promoted);
    if (sort === "az") return a.title.localeCompare(b.title, "es");
    if (sort === "za") return b.title.localeCompare(a.title, "es");
    return a.id - b.id;
  });
}

export function OffersCatalog() {
  const params = useSearchParams();
  const incomingSearch = params.get("q") || "";
  const incomingAxis = params.get("axis") || "";
  const initialAxes = axisOptions.includes(incomingAxis) ? [incomingAxis] : [];

  const [search, setSearch] = useState(incomingSearch);
  const [types, setTypes] = useState([]);
  const [axes, setAxes] = useState(initialAxes);
  const [modes, setModes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [applied, setApplied] = useState({ ...emptyFilters(), axes: initialAxes });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState("relevance");
  const [selected, setSelected] = useState(null);
  const closeSelected = useCallback(() => setSelected(null), []);

  useEffect(() => {
    // Recibe la búsqueda y el eje seleccionados desde Inicio (sin servidor aún).
    const nextAxes = axisOptions.includes(incomingAxis) ? [incomingAxis] : [];
    setSearch(incomingSearch);
    setAxes(nextAxes);
    setApplied((previous) => ({ ...previous, axes: nextAxes }));
  }, [incomingSearch, incomingAxis]);

  const draftFilters = useMemo(() => ({ types, axes, modes, skills }), [types, axes, modes, skills]);
  const previewCount = useMemo(() => demoOffers.filter((offer) => matchesFilters(offer, search, draftFilters)).length, [search, draftFilters]);
  const results = useMemo(() => orderOffers(demoOffers.filter((offer) => matchesFilters(offer, search, applied)), sort), [search, applied, sort]);
  const activeCount = applied.types.length + applied.axes.length + applied.modes.length + applied.skills.length;
  const suggestedSkills = allSkills.filter((skill) => normalize(skill).includes(normalize(skillSearch)) && !skills.some((selectedSkill) => normalize(selectedSkill) === normalize(skill))).slice(0, 8);

  const toggle = (value, values, setter) => setter((previous) => previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value]);
  const addSkill = (value) => {
    const clean = value.trim();
    if (clean) setSkills((previous) => previous.some((item) => normalize(item) === normalize(clean)) ? previous : [...previous, clean]);
    setSkillSearch("");
  };
  const clearFilters = () => {
    setSearch("");
    setTypes([]); setAxes([]); setModes([]); setSkills([]);
    setSkillSearch("");
    setApplied(emptyFilters());
  };
  const applyFilters = () => {
    setApplied({ types: [...types], axes: [...axes], modes: [...modes], skills: [...skills] });
    setFiltersOpen(false);
  };
  const submitSearch = (event) => {
    event.preventDefault();
    document.getElementById("resultados-ofertas")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Hero de Stitch: búsqueda integrada, sin verificación institucional ficticia. */}
      <section className="relative isolate overflow-hidden bg-brand-navy-dark text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_16%_25%,rgba(37,75,117,.62),transparent_72%)]" aria-hidden="true" />
        <div className="container-page relative py-10 sm:py-12 lg:py-14">
          <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
            <Link href="/" className="rounded-sm hover:text-white focus-visible:text-white">Inicio</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-[#f0c76b]" aria-current="page">Catálogo de oportunidades</span>
          </nav>
          <div className="mt-6 max-w-[830px]">
            <p className="mb-2 text-xs font-bold uppercase tracking-[.14em] text-[#ecc474]">Explora tu siguiente oportunidad</p>
            <h1 className="text-[clamp(2rem,4.2vw,3.05rem)] font-extrabold leading-[1.12] tracking-[-.04em]">Catálogo de oportunidades profesionales</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">Descubre opciones de empleo inicial, prácticas profesionales, becariado y servicio social relacionadas con tus habilidades e intereses.</p>
          </div>
          <form onSubmit={submitSearch} role="search" className="mt-8 flex w-full max-w-[870px] flex-col gap-2 rounded-2xl border border-white/15 bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,.24)] sm:flex-row sm:items-center sm:p-2.5">
            <label className="relative block min-w-0 flex-1">
              <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <span className="sr-only">Buscar por puesto, habilidad, empresa o ubicación</span>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar puesto, habilidad, empresa o ubicación…" className="h-12 w-full min-w-0 rounded-xl bg-white pl-12 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-brand-navy/25 sm:h-12" />
            </label>
            <button type="submit" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-navy px-6 text-sm font-bold text-white transition hover:bg-brand-navy-light">Explorar <ArrowRight size={18} aria-hidden="true" /></button>
          </form>
        </div>
      </section>

      <section id="resultados-ofertas" className="container-catalog scroll-mt-24 pb-14 pt-6 sm:pb-18 sm:pt-8" style={{ maxWidth: "1920px" }} aria-label="Resultados del catálogo">
        <div className="ui-card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-gold sm:mt-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-brand-navy" aria-live="polite"><strong className="font-extrabold">{results.length}</strong> {results.length === 1 ? "oportunidad ilustrativa" : "oportunidades ilustrativas"}</p>
              <p className="text-xs text-slate-500">Datos de ejemplo para visualizar el diseño. No son vacantes publicadas.</p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 sm:shrink-0">
            <span>Ordenar:</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="select-chevron min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-[#f1f4fa] py-2 pl-3 pr-10 text-sm font-semibold text-brand-navy sm:flex-none" aria-label="Ordenar oportunidades">
              <option value="relevance">Sugeridas</option>
              <option value="az">Título A–Z</option>
              <option value="za">Título Z–A</option>
            </select>
          </label>
        </div>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[350px_minmax(0,1fr)] lg:items-start lg:gap-6">
          <div className="min-w-0">
            <button type="button" aria-expanded={filtersOpen} aria-controls="panel-filtros-ofertas" onClick={() => setFiltersOpen((previous) => !previous)} className="ui-card mb-4 flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-bold text-brand-navy lg:hidden">
              <span className="inline-flex items-center gap-2"><SlidersHorizontal size={18} aria-hidden="true" /> Filtrar oportunidades {activeCount > 0 && <span className="rounded-full bg-brand-gold-soft px-2 py-0.5 text-xs text-brand-gold-dark">{activeCount}</span>}</span>
              <span className="text-xs font-medium text-slate-500">{filtersOpen ? "Ocultar" : "Mostrar"}</span>
            </button>

            <div id="panel-filtros-ofertas" className={`${filtersOpen ? "block" : "hidden"} space-y-4 lg:block`}>
              <aside className="ui-card px-4 py-5 sm:px-5" aria-label="Filtros de oportunidades">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <h2 className="inline-flex items-center gap-2 text-base font-extrabold text-brand-navy"><SlidersHorizontal size={18} aria-hidden="true" /> Filtros</h2>
                  <button type="button" onClick={clearFilters} className="rounded px-1 text-xs font-semibold text-slate-500 underline underline-offset-4 hover:text-brand-navy">Limpiar todo</button>
                </div>

                <fieldset className="mt-5">
                  <legend className="text-[.7rem] font-extrabold uppercase tracking-[.09em] text-slate-700">Tipo de oferta</legend>
                  <div className="mt-3 space-y-3">
                    {typeOptions.map((option) => (
                      <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                        <input type="checkbox" checked={types.includes(option.value)} onChange={() => toggle(option.value, types, setTypes)} className="h-[18px] w-[18px] shrink-0 accent-brand-navy" />
                        <span className="min-w-0 flex-1">{option.label}</span>
                        <span className="rounded-full bg-[#f1f3f9] px-2 py-0.5 text-[.67rem] font-semibold text-slate-500">{demoOffers.filter((offer) => offer.type === option.value).length}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-5 border-t border-slate-100 pt-5">
                  <legend className="text-[.7rem] font-extrabold uppercase tracking-[.09em] text-slate-700">Eje de acción</legend>
                  <div className="mt-3 space-y-3">
                    {axisOptions.map((axis) => (
                      <label key={axis} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                        <input type="checkbox" checked={axes.includes(axis)} onChange={() => toggle(axis, axes, setAxes)} className="h-[18px] w-[18px] shrink-0 accent-brand-navy" />
                        <span>{axis}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-5 border-t border-slate-100 pt-5">
                  <legend className="text-[.7rem] font-extrabold uppercase tracking-[.09em] text-slate-700">Habilidades y herramientas</legend>
                  <p className="mt-1 text-xs text-slate-500">Escribe una habilidad o elige una sugerencia.</p>
                  <div className="relative mt-3">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input type="search" value={skillSearch} onChange={(event) => setSkillSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addSkill(skillSearch); } }} placeholder="Ej. Python, React, CAD" aria-label="Buscar habilidad" className="min-h-11 w-full rounded-xl border border-slate-200 bg-[#f4f6fb] py-2 pl-9 pr-10 text-xs text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/20" />
                    <button type="button" onClick={() => addSkill(skillSearch)} disabled={!skillSearch.trim()} aria-label="Agregar habilidad" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-brand-navy hover:bg-white disabled:opacity-40"><Plus size={18} aria-hidden="true" /></button>
                  </div>
                  {skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Habilidades seleccionadas">
                      {skills.map((skill) => <button type="button" key={skill} onClick={() => setSkills((previous) => previous.filter((value) => value !== skill))} aria-label={`Quitar ${skill}`} className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-brand-navy px-2.5 py-1 text-xs font-semibold text-white">{skill}<X size={13} aria-hidden="true" /></button>)}
                    </div>
                  )}
                  {suggestedSkills.length > 0 && <div className="mt-4"><p className="text-[.7rem] font-semibold text-slate-500">Sugerencias</p><div className="mt-2 flex flex-wrap gap-1.5">{suggestedSkills.map((skill) => <button type="button" key={skill} onClick={() => addSkill(skill)} className="rounded-lg bg-[#f1f3f9] px-2.5 py-1.5 text-[.7rem] font-medium text-brand-navy hover:bg-brand-gold-soft">+ {skill}</button>)}</div></div>}
                </fieldset>

                <fieldset className="mt-5 border-t border-slate-100 pt-5">
                  <legend className="text-[.7rem] font-extrabold uppercase tracking-[.09em] text-slate-700">Modalidad de trabajo</legend>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {modeOptions.map(({ value, label, icon: Icon }) => (
                      <button type="button" key={value} aria-pressed={modes.includes(value)} onClick={() => toggle(value, modes, setModes)} className={`flex min-h-[69px] min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border px-1 text-[.7rem] font-bold transition ${modes.includes(value) ? "border-brand-navy bg-brand-navy text-white" : "border-slate-200 bg-[#f4f6fb] text-slate-700 hover:border-slate-300"}`}>
                        <Icon size={18} aria-hidden="true" /><span className="break-words">{label}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <button type="button" onClick={applyFilters} className="ui-button-primary mt-6 w-full text-center">Aplicar filtros ({previewCount}) <ArrowRight size={17} aria-hidden="true" /></button>
              </aside>

              <aside className="overflow-hidden rounded-2xl bg-brand-navy px-5 py-5 text-white shadow-card" aria-label="Publicación empresarial">
                <div className="flex items-center gap-2 text-[#e8bd61]"><ShieldCheck size={20} aria-hidden="true" /><span className="text-[.68rem] font-bold uppercase tracking-[.1em]">Publicación empresarial</span></div>
                <h3 className="mt-3 text-lg font-extrabold">Empresas aprobadas</h3>
                <p className="mt-2 text-xs leading-6 text-slate-200">Las empresas deben pasar la revisión administrativa de ConectU antes de poder publicar ofertas.</p>
                <p className="mt-2 text-[.7rem] text-slate-300">Esta revisión no representa un aval oficial de la UNAM.</p>
              </aside>
            </div>
          </div>

          <div className="min-w-0">
            {activeCount > 0 && <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-600"><span className="font-semibold">Filtros aplicados:</span>{[...applied.types, ...applied.axes, ...applied.modes, ...applied.skills].map((tag) => <span key={tag} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-brand-navy">{tag}</span>)}</div>}
            <div className="grid min-w-0 grid-cols-1 gap-4 min-[650px]:grid-cols-2 min-[1430px]:grid-cols-3 min-[1770px]:grid-cols-4 sm:gap-5">
              {results.map((offer) => <OfferCard key={offer.id} offer={offer} onOpen={() => setSelected(offer)} />)}
            </div>
            {results.length === 0 && (
              <div className="ui-card flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
                <Search size={28} className="text-slate-400" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-extrabold text-brand-navy">No encontramos coincidencias</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Prueba con otro término o modifica los filtros para encontrar otros ejemplos.</p>
                <button type="button" onClick={clearFilters} className="ui-button-secondary mt-5">Limpiar búsqueda y filtros</button>
              </div>
            )}

            <div className="ui-card mt-4 flex flex-col gap-2 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>Mostrando {results.length} de {demoOffers.length} ejemplos disponibles en esta demostración.</span>
              <span className="font-semibold text-brand-navy">La paginación se conectará con los datos reales.</span>
            </div>

            <section className="mt-5 overflow-hidden rounded-2xl bg-brand-navy-dark px-5 py-6 text-white sm:px-7 sm:py-7" aria-labelledby="catalog-cta-title">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-lg">
                  <div className="flex items-center gap-2 text-[#f0c76b]"><Sparkles size={19} aria-hidden="true" /><span className="text-[.7rem] font-extrabold uppercase tracking-[.11em]">ConectU para estudiantes</span></div>
                  <h2 id="catalog-cta-title" className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">Prepara tu perfil para postularte</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-200">El acceso para estudiantes es gratuito. Cuando la plataforma esté conectada, podrás consultar las ofertas publicadas y dar seguimiento a tus solicitudes.</p>
                </div>
                <Link href="/registro/estudiante" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 py-3 text-sm font-extrabold text-brand-navy-dark transition hover:bg-[#e4b957]">Crear cuenta <ArrowRight size={17} aria-hidden="true" /></Link>
              </div>
            </section>
          </div>
        </div>
      </section>

      {selected && <OfferModal offer={selected} onClose={closeSelected} />}
    </>
  );
}

export function OfferCard({ offer, onOpen }) {
  return (
    <article className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-white p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-card sm:p-5 ${offer.promoted ? "border-brand-gold/60" : "border-slate-200"}`}>
      {offer.promoted && <span className="absolute inset-y-0 left-0 w-1 bg-brand-gold" aria-hidden="true" />}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {offer.promoted && <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold-soft px-2.5 py-1 text-[.66rem] font-extrabold text-brand-gold-dark"><Sparkles size={12} aria-hidden="true" /> Promocionada</span>}
          <span className="rounded-full bg-[#edf2fb] px-2.5 py-1 text-[.66rem] font-semibold text-brand-navy">{offer.axis}</span>
        </div>
        <span className="rounded-full border border-slate-200 px-2 py-1 text-[.65rem] font-semibold text-slate-500">Ejemplo</span>
      </div>
      <h3 className="mt-3 text-[1.05rem] font-extrabold leading-[1.4] tracking-[-.02em] text-brand-navy sm:text-lg">{offer.title}</h3>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500"><Building2 size={14} className="shrink-0 text-brand-gold-dark" aria-hidden="true" /> {offer.company}</p>
      <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600">{offer.description}</p>
      <div className="mt-4 space-y-2 rounded-xl bg-[#f2f4fb] px-3 py-3 text-xs">
        <div className="flex min-w-0 items-start justify-between gap-3"><span className="inline-flex items-center gap-1.5 text-slate-600"><GraduationCap size={15} aria-hidden="true" /> Tipo</span><strong className="text-right font-bold text-brand-navy">{typeOptions.find((option) => option.value === offer.type)?.label || offer.type}</strong></div>
        <div className="flex min-w-0 items-start justify-between gap-3"><span className="inline-flex items-center gap-1.5 text-slate-600"><Laptop size={15} aria-hidden="true" /> Modalidad</span><strong className="text-right font-bold text-brand-navy">{offer.mode}</strong></div>
        <div className="flex min-w-0 items-start justify-between gap-3"><span className="inline-flex items-center gap-1.5 text-slate-600"><MapPin size={15} aria-hidden="true" /> Ubicación</span><strong className="text-right font-bold text-brand-navy">{offer.location}</strong></div>
      </div>
      <div className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">{offer.skills.map((skill) => <span key={skill} className="h-fit rounded-md bg-[#f1f3f9] px-2.5 py-1 text-[.7rem] font-semibold text-slate-600">{skill}</span>)}</div>
      <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-4">
        <button type="button" onClick={onOpen} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-navy-light">Ver detalles <ArrowRight size={16} aria-hidden="true" /></button>
      </div>
    </article>
  );
}

function OfferModal({ offer, onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]')];
        if (!focusable.length) return;
        if (event.shiftKey && document.activeElement === focusable[0]) {
          event.preventDefault();
          focusable[focusable.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
          event.preventDefault();
          focusable[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-[3px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="offer-modal-title" aria-describedby="offer-modal-description" className="flex max-h-[96dvh] w-full max-w-[860px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[91dvh] sm:rounded-3xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-navy text-white sm:grid"><BriefcaseBusiness size={23} aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500">{offer.company} <span className="mx-1 text-slate-300">·</span> Ejemplo de interfaz</p>
              <h2 id="offer-modal-title" className="mt-1 text-lg font-extrabold leading-tight tracking-[-.025em] text-brand-navy sm:text-2xl">{offer.title}</h2>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-600"><span className="inline-flex items-center gap-1"><MapPin size={14} aria-hidden="true" /> {offer.location}</span><span className="inline-flex items-center gap-1"><Laptop size={14} aria-hidden="true" /> {offer.mode}</span></p>
            </div>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Cerrar detalle" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-600 hover:bg-slate-100"><X size={21} aria-hidden="true" /></button>
        </div>

        <div className="ui-modal-scroll min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-contain px-5 py-5 sm:px-7 sm:py-6" style={{ WebkitOverflowScrolling: "touch" }}>
          <p id="offer-modal-description" className="rounded-xl border border-amber-100 bg-[#fbf5e8] px-4 py-3 text-xs leading-5 text-[#785c22]">Esta oportunidad es un ejemplo visual, no una vacante real ni una oferta verificada.</p>
          <section className="mt-6"><h3 className="text-base font-extrabold text-brand-navy">Acerca de la oportunidad</h3><p className="mt-3 text-sm leading-7 text-slate-600">{offer.description}</p></section>
          <section className="mt-7"><h3 className="flex items-center gap-2 text-base font-extrabold text-brand-navy"><GraduationCap size={19} className="text-brand-gold-dark" aria-hidden="true" /> Información general</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <InfoTile icon={BriefcaseBusiness} label="Tipo de oportunidad" value={typeOptions.find((option) => option.value === offer.type)?.label || offer.type} />
              <InfoTile icon={Laptop} label="Modalidad" value={offer.mode} />
              <InfoTile icon={MapPin} label="Ubicación" value={offer.location} />
              <InfoTile icon={Sparkles} label="Eje de acción" value={offer.axis} />
            </div>
          </section>
          <section className="mt-7" aria-labelledby="informacion-empresa-titulo">
            <h3 id="informacion-empresa-titulo" className="flex items-center gap-2 text-base font-extrabold text-brand-navy"><Building2 size={19} className="text-brand-gold-dark" aria-hidden="true" /> Información de la empresa</h3>
            <div className="mt-3 flex items-start gap-4 rounded-xl border border-slate-200 bg-[#f8fafd] p-4 sm:p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-navy text-white"><Building2 size={23} aria-hidden="true" /></span>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-brand-navy">{offer.company}</p>
                <p className="mt-1 text-xs leading-6 text-slate-600">Este nombre es ilustrativo. La descripción y otros datos públicos de la empresa se mostrarán aquí cuando la plataforma utilice perfiles empresariales reales.</p>
              </div>
            </div>
          </section>
          <section className="mt-7"><h3 className="text-base font-extrabold text-brand-navy">Habilidades y herramientas</h3><div className="mt-3 flex flex-wrap gap-2">{offer.skills.map((skill) => <span key={skill} className="rounded-xl bg-[#eef2fb] px-3 py-2 text-xs font-bold text-brand-navy">{skill}</span>)}</div></section>
          <section className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="flex items-center gap-2 text-sm font-extrabold text-brand-navy"><GraduationCap size={17} aria-hidden="true" /> Requisitos y plazas</h3><p className="mt-2 text-xs leading-6 text-slate-500">La información detallada se mostrará cuando las empresas publiquen ofertas reales.</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="flex items-center gap-2 text-sm font-extrabold text-brand-navy"><FileText size={17} aria-hidden="true" /> Documentos adjuntos</h3><p className="mt-2 text-xs leading-6 text-slate-500">Los documentos PDF, si existen, se podrán consultar aquí con los permisos correspondientes.</p></div>
          </section>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-[#f5f7fc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <span className="hidden items-center gap-2 text-xs text-slate-500 sm:inline-flex"><Clock3 size={16} aria-hidden="true" /> Interfaz de demostración</span>
          <Link href="/ingresar" className="ui-button-primary text-center sm:ml-auto">Iniciar sesión para postularme <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return <div className="flex items-start gap-3 rounded-xl bg-[#f2f4fb] p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-brand-gold-dark"><Icon size={17} aria-hidden="true" /></span><div className="min-w-0"><p className="text-[.7rem] font-bold uppercase tracking-[.08em] text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-extrabold text-brand-navy">{value}</p></div></div>;
}
