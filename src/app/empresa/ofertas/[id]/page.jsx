import Link from "next/link";
import { CalendarDays, Clock3, Eye, FileText, MapPin, Pencil } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DemoNotice, EmptyMetric, Panel, primaryButton, ResponsiveTable, secondaryButton, Status } from "@/components/dashboard-ui";

export const metadata = { title: "Gestión de oferta" };
export function generateStaticParams() { return [{ id: "trainee-software" }, { id: "analisis-datos" }, { id: "automatizacion" }, { id: "frontend" }]; }

export default async function OfferManagementPage({ params }) {
  const { id } = await params;
  return <DashboardShell role="empresa" title="Ingeniería trainee de software" eyebrow="Gestión de oferta">
    <DemoNotice />
    <section className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap gap-2"><Status tone="green">Activa</Status><Status tone="navy">Empleo</Status><Status>Híbrida</Status></div><h2 className="mt-4 text-xl font-bold text-brand-navy">Ingeniería trainee de software</h2><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500"><span className="inline-flex items-center gap-1.5"><MapPin size={15} />Ciudad de México</span><span className="inline-flex items-center gap-1.5"><CalendarDays size={15} />Cierre: 30 nov 2026</span><span className="inline-flex items-center gap-1.5"><Clock3 size={15} />Ciclo 2</span></div></div><div className="flex flex-wrap gap-2"><Link href={`/empresa/ofertas/${id}/editar`} className={secondaryButton}><Pencil size={16} />Editar</Link><button className={primaryButton}>Extender vigencia</button></div></div></section>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><EmptyMetric label="Postulaciones" value="8" detail="Ciclo actual" /><EmptyMetric label="En revisión" value="4" /><EmptyMetric label="Aceptadas" value="2" /><EmptyMetric label="Plazas" value="2 / 4" detail="Cubiertas" /></div>
    <Panel className="mt-6" title="Candidaturas del ciclo actual" description="Cada candidatura consulta el único CV vigente del estudiante."><ResponsiveTable headings={["Estudiante", "Programa académico", "Fecha", "Estado", "Acción"]}>{[
      ["David Hernández", "Programa académico demostrativo", "12 oct 2026", "En revisión", "amber"],
      ["Andrea Moreno", "Programa académico demostrativo", "11 oct 2026", "Enviada", "blue"],
      ["Luis Torres", "Programa académico demostrativo", "10 oct 2026", "Aceptada", "green"],
    ].map(([name, program, date, status, tone], index) => <tr key={name} className="border-b border-slate-100 last:border-0"><td className="px-4 py-4 font-semibold text-slate-800">{name}</td><td className="px-4 py-4 text-slate-600">{program}</td><td className="px-4 py-4 text-slate-500">{date}</td><td className="px-4 py-4"><Status tone={tone}>{status}</Status></td><td className="px-4 py-4 text-right"><Link href={`/empresa/postulaciones/candidato-${index + 1}`} className="inline-flex items-center gap-1.5 font-semibold text-brand-navy"><Eye size={15} />Ver perfil</Link></td></tr>)}</ResponsiveTable></Panel>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.65fr]"><Panel title="Historial de ciclos"><div className="divide-y divide-slate-100"><Cycle title="Ciclo 2 · actual" date="1 oct — 30 nov 2026" applications="8 postulaciones" active /><Cycle title="Ciclo 1 · cerrado" date="15 jul — 15 sep 2026" applications="12 postulaciones" /></div></Panel><Panel title="Documentos de la oferta"><div className="space-y-3 p-5"><Document name="Descripción_técnica.pdf" /><Document name="Información_del_programa.pdf" /></div></Panel></div>
  </DashboardShell>;
}
function Cycle({ title, date, applications, active }) { return <div className="flex items-center justify-between gap-4 p-5"><div><p className="font-semibold text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-500">{date} · {applications}</p></div><Status tone={active ? "green" : "slate"}>{active ? "En curso" : "Finalizado"}</Status></div>; }
function Document({ name }) { return <button className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left"><FileText size={18} className="text-brand-gold" /><span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">{name}</span><span className="text-xs font-semibold text-brand-navy">Ver</span></button>; }
