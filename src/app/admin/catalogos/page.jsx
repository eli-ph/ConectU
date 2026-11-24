"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BrainCircuit,
  Building2,
  Download,
  GraduationCap,
  Layers3,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { consultarAdministracion, operacionAdministracion } from "@/components/admin/admin-api";
import { DashboardShell } from "@/components/dashboard-shell";
import { TablePagination } from "@/components/table-pagination";

const TABS = [
  { id: "facultades", label: "Facultades", singular: "Facultad", icon: Building2 },
  { id: "carreras", label: "Carreras", singular: "Carrera", icon: GraduationCap },
  { id: "ejes", label: "Ejes de acción", singular: "Eje de acción", icon: Layers3 },
  { id: "habilidades", label: "Habilidades", singular: "Habilidad", icon: BrainCircuit },
];

const inputBase = "w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10";
const labelBase = "mb-2 block text-xs font-semibold text-slate-700";
const buttonBase = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-offset-2";

function emptyItem(tab) {
  const base = { id: null, nombre: "", activo: true };
  if (tab === "facultades") return { ...base, clave: "", sede: "" };
  if (tab === "carreras") return { ...base, clave: "", facultad: "" };
  if (tab === "ejes") return { ...base, descripcion: "" };
  return { ...base, categoria: "", sinonimos: "" };
}

function formatText(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function StatusPill({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${active ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

function getSummary(tab, item) {
  if (tab === "facultades") return item.sede || "Unidad académica";
  if (tab === "carreras") return item.facultad || "Sin facultad";
  if (tab === "ejes") return item.descripcion || "Sin descripción";
  return item.categoria || "Sin categoría";
}

export default function AdminCatalogsPage() {
  const [tab, setTab] = useState("habilidades");
  const [catalogs, setCatalogs] = useState({facultades:[],carreras:[],ejes:[],habilidades:[]});
  const [term, setTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [form, setForm] = useState(() => emptyItem("habilidades"));
  const [feedback, setFeedback] = useState("");
  const [formError, setFormError] = useState("");
  const formRef = useRef(null);
  const [busy,setBusy]=useState(false);
  const [loadState,setLoadState]=useState("Cargando catálogos…");
  useEffect(()=>{const controller=new AbortController();consultarAdministracion("catalogos",controller.signal).then(d=>{setCatalogs(d.catalogos);setLoadState("");}).catch(e=>{if(!controller.signal.aborted)setLoadState(e.message);});return ()=>controller.abort();},[]);

  const currentTab = TABS.find((item) => item.id === tab);
  const rows = catalogs[tab];
  const categories = useMemo(() => [...new Set(catalogs.habilidades.map(item => item.categoria).filter(Boolean))].sort((a,b) => a.localeCompare(b,"es")), [catalogs.habilidades]);
  const facultyNames = catalogs.facultades.filter(item=>item.activo).map((item) => item.nombre);
  const filtered = useMemo(() => rows.filter((item) => {
    const searchMatches = !term.trim() || formatText(Object.values(item).join(" ")).includes(formatText(term.trim()));
    const categoryMatches = !categoryFilter || (tab === "habilidades" ? item.categoria === categoryFilter : tab === "carreras" ? item.facultad === categoryFilter : true);
    return searchMatches && categoryMatches;
  }), [rows, term, categoryFilter, tab]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function changeTab(nextTab) {
    setTab(nextTab);
    setTerm("");
    setCategoryFilter("");
    setPage(1);
    setForm(emptyItem(nextTab));
    setFormError("");
    setFeedback("");
  }

  function startNew() {
    setForm(emptyItem(tab));
    setFormError("");
    setFeedback("");
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function startEdit(item) {
    setForm({ ...item });
    setFormError("");
    setFeedback("");
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function changeField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFormError("");
    setFeedback("");
  }

  async function persist(record){
    const saved={...record};
    if(tab==="carreras")saved.facultad_id=catalogs.facultades.find(f=>f.nombre===record.facultad)?.id;
    const data=await operacionAdministracion({operacion:"catalogo",tipo:tab,registro:saved});
    setCatalogs(data.catalogos);
    return data.catalogos[tab].find(item=>item.id===data.id);
  }
  async function updateStatus(item){if(busy)return;setBusy(true);setFormError("");setFeedback("");try{const saved=await persist({...item,activo:!item.activo});if(form.id===item.id)setForm(saved);setFeedback("Estado guardado en SQLite.");}catch(e){setFormError(e.message);}finally{setBusy(false);}}
  async function saveForm(event){event.preventDefault();if(busy)return;setBusy(true);setFormError("");setFeedback("");try{const saved=await persist(form);setForm(saved);setFeedback("Cambios guardados en SQLite.");setCategoryFilter("");setTerm("");setPage(1);}catch(e){setFormError(e.message);}finally{setBusy(false);}}

  function exportJson() {
    const content = JSON.stringify(catalogs, null, 2);
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "conectu-catalogos.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardShell role="admin" title="Catálogos" eyebrow="Configuración de la plataforma">
      <div className="space-y-5 sm:space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Configuración del sistema <span className="mx-1 text-slate-300">/</span><span className="text-[#a17b24]">Módulos de referencia</span></p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Administra facultades, carreras, ejes de acción y habilidades utilizados en los perfiles y las ofertas.</p>
          </div>
          <button type="button" onClick={exportJson} className={`${buttonBase} self-start border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 sm:shrink-0`}>
            <Download size={17} aria-hidden="true" /> Exportar catálogos (JSON)
          </button>
        </div>

        {loadState && <p role="status" className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">{loadState}</p>}
        <div role="tablist" aria-label="Tipos de catálogo" className="grid grid-cols-2 gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm lg:grid-cols-4">
          {TABS.map(({ id, label, icon: Icon }) => {
            const selected = tab === id;
            return (
              <button key={id} type="button" role="tab" aria-selected={selected} disabled={busy} onClick={() => changeTab(id)} className={`flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition sm:text-sm ${selected ? "bg-brand-navy text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy"}`}>
                <Icon size={18} className={selected ? "shrink-0 text-brand-gold" : "shrink-0"} aria-hidden="true" />
                <span>{label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${selected ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600"}`}>{catalogs[id].length}</span>
              </button>
            );
          })}
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,1fr)] xl:gap-6">
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-label={`Listado de ${currentTab.label.toLowerCase()}`}>
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block min-w-0 flex-1">
                <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <span className="sr-only">Buscar en {currentTab.label}</span>
                <input type="search" value={term} onChange={(event) => { setTerm(event.target.value); setPage(1); }} placeholder={tab === "habilidades" ? "Buscar habilidad o categoría..." : `Buscar en ${currentTab.label.toLowerCase()}...`} className={`${inputBase} pl-10`} />
              </label>
              {(tab === "habilidades" || tab === "carreras") && (
                <label className="min-w-0 sm:w-[210px]">
                  <span className="sr-only">{tab === "habilidades" ? "Filtrar por categoría" : "Filtrar por facultad"}</span>
                  <select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setPage(1); }} className={inputBase}>
                    <option value="">{tab === "habilidades" ? "Todas las categorías" : "Todas las facultades"}</option>
                    {(tab === "habilidades" ? categories : facultyNames).map((value) => <option value={value} key={value}>{value}</option>)}
                  </select>
                </label>
              )}
              <button type="button" onClick={startNew} className={`${buttonBase} shrink-0 bg-brand-navy text-white hover:bg-brand-navy-light`}>
                <Plus size={17} aria-hidden="true" /> Nuevo
              </button>
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="conectu-table w-full table-fixed text-left text-[12px]">
                <thead className="border-b border-slate-200 bg-[#f7f9fc] text-[10px] font-bold uppercase tracking-[0.06em] text-slate-500">
                  <tr>
                    <th className="w-[25%] px-3 py-3">{tab === "habilidades" ? "Habilidad técnica" : tab === "facultades" ? "Facultad / unidad" : tab === "carreras" ? "Carrera universitaria" : "Eje de acción"}</th>
                    <th className="w-[32%] px-3 py-3">{tab === "habilidades" ? "Categoría" : tab === "facultades" || tab === "carreras" ? "Clave / relación" : "Descripción"}</th>
                    <th className="w-[17%] px-3 py-3">{tab === "habilidades" ? "Referencias" : tab === "ejes" ? "Ofertas" : tab === "facultades" ? "Carreras" : "Facultad"}</th>
                    <th className="w-[13%] px-3 py-3">Estado</th>
                    <th className="w-[13%] px-3 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible.map((item) => (
                    <tr key={item.id} className="align-top transition hover:bg-slate-50/70">
                      <td className="break-words px-3 py-4 font-semibold text-brand-navy">{item.nombre}</td>
                      <td className="break-words px-3 py-4 text-slate-600">
                        {tab === "habilidades" ? <span className="rounded bg-slate-100 px-2 py-1 text-xs">{item.categoria || "Sin categoría"}</span> : tab === "ejes" ? item.descripcion : <><span className="font-medium text-brand-navy">{item.clave || "—"}</span>{tab === "facultades" && item.sede ? <span className="mt-1 block text-[11px] text-slate-500">{item.sede}</span> : null}</>}
                      </td>
                      <td className="break-words px-3 py-4 text-slate-600">{tab === "carreras" ? item.facultad : item.usos}</td>
                      <td className="px-3 py-4"><StatusPill active={item.activo} /></td>
                      <td className="px-3 py-3.5">
                        <div className="flex flex-col items-end gap-1.5">
                          <button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:underline" aria-label={`Editar ${item.nombre}`}><Pencil size={13} /> Editar</button>
                          <button type="button" disabled={busy} onClick={() => updateStatus(item)} className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-brand-navy" aria-label={`${item.activo ? "Desactivar" : "Activar"} ${item.nombre}`}>
                            {item.activo ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}{item.activo ? "Desactivar" : "Activar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
              {visible.map((item) => (
                <article key={item.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="font-bold text-brand-navy">{item.nombre}</p><p className="mt-1 text-xs leading-5 text-slate-500">{getSummary(tab, item)}</p></div>
                    <StatusPill active={item.activo} />
                  </div>
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <button type="button" disabled={busy} onClick={() => updateStatus(item)} className={`${buttonBase} border border-slate-200 bg-white text-slate-600`}>{item.activo ? "Desactivar" : "Activar"}</button>
                    <button type="button" onClick={() => startEdit(item)} className={`${buttonBase} bg-brand-navy text-white`}><Pencil size={15} /> Editar</button>
                  </div>
                </article>
              ))}
            </div>
            {filtered.length === 0 && <div className="p-10 text-center text-sm text-slate-500">No se encontraron resultados con esos filtros.</div>}

            <TablePagination
              page={safePage} pages={pages} onChange={setPage}
              total={filtered.length} pageSize={pageSize}
              label="registros"
            />
          </section>

          <section ref={formRef} className="min-w-0 scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-label={`Crear o editar ${currentTab.singular.toLowerCase()}`}>
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
              <div className="min-w-0">
                <h2 className="text-lg font-bold tracking-tight text-brand-navy">{form.id ? "Editar" : "Crear"} {currentTab.singular}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{tab === "habilidades" ? "Habilidades y herramientas para perfiles y ofertas" : tab === "facultades" ? "Unidades académicas del registro estudiantil" : tab === "carreras" ? "Programas y su relación con las facultades" : "Clasificación temática de oportunidades"}</p>
              </div>
              <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">{currentTab.singular}</span>
            </div>
            <form onSubmit={saveForm} className="space-y-5 p-5 sm:p-6">
              <div>
                <label htmlFor="catalog-name" className={labelBase}>{tab === "habilidades" ? "Nombre de la habilidad" : tab === "ejes" ? "Nombre del eje de acción" : tab === "facultades" ? "Nombre de la facultad o unidad" : "Nombre de la carrera"} <span className="text-rose-600">*</span></label>
                <input id="catalog-name" autoComplete="off" required value={form.nombre} onChange={(event) => changeField("nombre", event.target.value)} className={inputBase} placeholder={tab === "habilidades" ? "Ej. Python" : tab === "carreras" ? "Ej. Ingeniería en Computación" : tab === "ejes" ? "Ej. Ciencia, Tecnología e Innovación" : "Ej. Facultad de Ingeniería"} />
              </div>
              {(tab === "facultades" || tab === "carreras") && (
                <div>
                  <label htmlFor="catalog-code" className={labelBase}>Clave de referencia</label>
                  <input id="catalog-code" autoComplete="off" value={form.clave} onChange={(event) => changeField("clave", event.target.value)} className={inputBase} placeholder="Clave interna (opcional)" />
                </div>
              )}
              {tab === "facultades" && <div><label htmlFor="catalog-campus" className={labelBase}>Campus o sede (opcional)</label><input id="catalog-campus" value={form.sede} onChange={(event) => changeField("sede", event.target.value)} className={inputBase} placeholder="Ubicación de la unidad académica" /></div>}
              {tab === "carreras" && (
                <div><label htmlFor="catalog-faculty" className={labelBase}>Facultad adscrita <span className="text-rose-600">*</span></label>
                  <select id="catalog-faculty" required value={form.facultad} onChange={(event) => changeField("facultad", event.target.value)} className={inputBase}>
                    <option value="">Seleccionar facultad</option>
                    {facultyNames.map((name) => <option key={name} value={name}>{name}</option>)}
                  </select>
                </div>
              )}
              {tab === "ejes" && <div><label htmlFor="catalog-description" className={labelBase}>Descripción y alcance (opcional)</label><textarea id="catalog-description" rows={4} value={form.descripcion} onChange={(event) => changeField("descripcion", event.target.value)} className={`${inputBase} resize-y`} placeholder="Describe qué oportunidades incluye este eje" /></div>}
              {tab === "habilidades" && (
                <>
                  <div><label htmlFor="catalog-category" className={labelBase}>Categoría (opcional)</label>
                    <select id="catalog-category" value={form.categoria} onChange={(event) => changeField("categoria", event.target.value)} className={inputBase}>
                      <option value="">Seleccionar categoría</option>
                      {categories.map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>
                  </div>
                  <div><label htmlFor="catalog-synonyms" className={labelBase}>Sinónimos / etiquetas alternativas</label><input id="catalog-synonyms" value={form.sinonimos} onChange={(event) => changeField("sinonimos", event.target.value)} placeholder="Ej. py, python3" className={inputBase} /><p className="mt-1.5 text-xs leading-5 text-slate-500">Información de referencia del catálogo.</p></div>
                </>
              )}
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                <span><span className="block text-xs font-bold text-slate-700">Estado en catálogo</span><span className="mt-1 block text-xs text-slate-500">Disponible para seleccionar en la plataforma</span></span>
                <input type="checkbox" role="switch" aria-label="Entrada activa" checked={form.activo} onChange={(event) => changeField("activo", event.target.checked)} className="h-5 w-5 shrink-0 accent-emerald-600" />
              </label>
              {formError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{formError}</p>}
              {feedback && <p role="status" className="rounded-lg bg-blue-50 px-3 py-2 text-xs leading-5 text-brand-navy">{feedback}</p>}
              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button type="button" onClick={startNew} className={`${buttonBase} border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100`}><RotateCcw size={16} /> Limpiar</button>
                <button type="submit" disabled={busy||!!loadState} className={`${buttonBase} bg-brand-navy text-white hover:bg-brand-navy-light`}><Save size={16} /> Guardar {currentTab.singular}</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
