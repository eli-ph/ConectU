"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FilterX,
  MapPin,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { CompanyDetailModal } from "@/components/admin/company-detail-modal";

// Información de muestra para preparar la interfaz. Los registros reales
// se obtendrán del repositorio de empresas al conectar SQLite.
const companies = [
  { id: 1, name: "Empresa demostrativa", sector: "Tecnología", location: "Ciudad de México", state: "Pendiente" },
  { id: 2, name: "Organización ejemplo", sector: "Servicios", location: "Estado de México", state: "Aprobada" },
  { id: 3, name: "Industria demostrativa", sector: "Industria", location: "Querétaro", state: "Aprobada" },
  { id: 4, name: "Institución ejemplo", sector: "Educación", location: "Puebla", state: "Rechazada" },
];

const statusTabs = [
  { value: "Todas", label: "Todas" },
  { value: "Pendiente", label: "Pendientes" },
  { value: "Aprobada", label: "Aprobadas" },
  { value: "Rechazada", label: "Rechazadas" },
  { value: "Suspendida", label: "Suspendidas" },
];

const statusStyles = {
  Pendiente: "border-amber-200 bg-amber-50 text-amber-800",
  Aprobada: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Rechazada: "border-rose-200 bg-rose-50 text-rose-700",
  Suspendida: "border-slate-300 bg-slate-100 text-slate-700",
};

const statusIcons = {
  Pendiente: Clock3,
  Aprobada: CheckCircle2,
  Rechazada: XCircle,
  Suspendida: CircleHelp,
};

function initials(name) {
  return name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function StatusBadge({ state }) {
  const Icon = statusIcons[state] ?? CircleHelp;
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[state] ?? statusStyles.Suspendida}`}>
      <Icon size={13} aria-hidden="true" />
      {state}
    </span>
  );
}

export default function AdminCompaniesPage() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todas");
  const [sector, setSector] = useState("Todos");

  const sectors = useMemo(() => [...new Set(companies.map((company) => company.sector))].sort(), []);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("es");
    return companies.filter((company) => {
      const matchesSearch = !term || [company.name, company.sector, company.location, company.rfc]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase("es").includes(term));
      return matchesSearch && (status === "Todas" || company.state === status) &&
        (sector === "Todos" || company.sector === sector);
    });
  }, [search, status, sector]);

  const activeFilters = Boolean(search || status !== "Todas" || sector !== "Todos");
  const clearFilters = () => {
    setSearch("");
    setStatus("Todas");
    setSector("Todos");
  };

  return (
    <DashboardShell role="admin" title="Gestión de empresas" eyebrow="Directorio empresarial">
      <div className="space-y-6 sm:space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm leading-6 text-slate-600">
              Consulta las empresas registradas, filtra por su estado y revisa sus expedientes antes de tomar decisiones administrativas.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600">
            <ShieldCheck size={15} className="text-brand-gold" aria-hidden="true" />
            Revisión administrativa
          </span>
        </div>

        <section aria-label="Filtros del directorio" className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-soft">
          <div className="border-b border-slate-100 p-3 sm:px-5 sm:py-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
              {statusTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatus(tab.value)}
                  aria-pressed={status === tab.value}
                  className={`min-h-10 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                    status === tab.value
                      ? "bg-brand-navy text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-brand-navy"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-center xl:grid-cols-[minmax(0,1fr)_260px_auto]">
            <label className="relative min-w-0">
              <span className="sr-only">Buscar empresa, sector o ubicación</span>
              <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar empresa, sector o ubicación"
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#f8fafc] pl-11 pr-4 text-sm text-brand-navy outline-none transition focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/10"
              />
            </label>
            <label className="min-w-0">
              <span className="sr-only">Filtrar por sector</span>
              <select
                value={sector}
                onChange={(event) => setSector(event.target.value)}
                className="select-chevron h-12 w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 text-sm text-brand-navy outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10"
              >
                <option value="Todos">Todos los sectores</option>
                {sectors.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <button
              type="button"
              onClick={clearFilters}
              disabled={!activeFilters}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-brand-navy transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <FilterX size={17} aria-hidden="true" /> Limpiar filtros
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-soft" aria-labelledby="directorio-titulo">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 id="directorio-titulo" className="text-lg font-bold tracking-tight text-brand-navy">Directorio de empresas</h2>
              <p className="mt-1 text-sm text-slate-500">Consulta el estado de registro y abre el expediente de cada organización.</p>
            </div>
            <span aria-live="polite" className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-14 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#edf0ff] text-brand-navy"><Building2 size={25} aria-hidden="true" /></div>
              <h3 className="mt-4 text-base font-bold text-brand-navy">No se encontraron empresas</h3>
              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">Prueba con otra búsqueda o cambia los filtros seleccionados.</p>
              <button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-light">Mostrar todas</button>
            </div>
          ) : (
            <>
              <div className="grid gap-3 p-4 sm:hidden">
                {filtered.map((company) => (
                  <article key={company.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf0ff] text-xs font-extrabold text-brand-navy">{initials(company.name)}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-sm font-bold text-brand-navy">{company.name}</h3>
                        <p className="mt-1 text-xs text-slate-500">{company.sector}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <StatusBadge state={company.state} />
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={14} aria-hidden="true" /> {company.location}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(company)}
                      className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-semibold text-white hover:bg-brand-navy-light"
                    >
                      Revisar
                    </button>
                  </article>
                ))}
              </div>
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-[#f4f6fb] text-xs font-semibold uppercase tracking-[0.045em] text-slate-500">
                    <tr>
                      <th scope="col" className="px-5 py-4 sm:px-6">Empresa</th>
                      <th scope="col" className="px-4 py-4">Sector</th>
                      <th scope="col" className="px-4 py-4">Ubicación</th>
                      <th scope="col" className="px-4 py-4">Estado</th>
                      <th scope="col" className="px-5 py-4 text-right sm:px-6">Expediente</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((company) => (
                      <tr key={company.id} className="transition-colors hover:bg-[#fafbff]">
                        <td className="px-5 py-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf0ff] text-xs font-bold text-brand-navy">{initials(company.name)}</span>
                            <div className="min-w-0">
                              <p className="font-bold text-brand-navy">{company.name}</p>
                              <p className="mt-0.5 text-xs text-slate-500">Cuenta empresarial</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">{company.sector}</td>
                        <td className="px-4 py-4 text-slate-600">{company.location}</td>
                        <td className="px-4 py-4"><StatusBadge state={company.state} /></td>
                        <td className="px-5 py-4 text-right sm:px-6">
                          <button
                            type="button"
                            onClick={() => setSelected(company)}
                            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light focus-visible:outline-offset-2"
                          >
                            Revisar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <div className="border-t border-slate-100 bg-[#f8f9fd] px-5 py-4 text-xs text-slate-500 sm:px-6">
            {filtered.length} {filtered.length === 1 ? "empresa visible" : "empresas visibles"} en el directorio
          </div>
        </section>
      </div>
      <CompanyDetailModal company={selected} onClose={() => setSelected(null)} />
    </DashboardShell>
  );
}
