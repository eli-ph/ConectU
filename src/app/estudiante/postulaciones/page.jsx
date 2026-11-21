"use client";

import { useState } from "react";
import { Building2, CalendarDays, Eye, FileText, MapPin } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DemoNotice, inputClass, Modal, primaryButton, ResponsiveTable, secondaryButton, Status } from "@/components/dashboard-ui";

const applications = [
  { id: "1", title: "Ingeniería trainee de software", company: "Empresa tecnológica demostrativa", type: "Empleo", mode: "Híbrida", date: "12 oct 2026", status: "En revisión", tone: "amber" },
  { id: "2", title: "Practicante de análisis de datos", company: "Organización demostrativa", type: "Prácticas", mode: "Remota", date: "8 oct 2026", status: "Aceptada", tone: "green" },
  { id: "3", title: "Desarrollo frontend inicial", company: "Estudio digital demostrativo", type: "Becariado", mode: "Presencial", date: "2 oct 2026", status: "Enviada", tone: "blue" },
  { id: "4", title: "Servicio social en investigación", company: "Centro demostrativo", type: "Servicio social", mode: "Híbrida", date: "27 sep 2026", status: "Retirada", tone: "slate" },
];

export default function StudentApplicationsPage() {
  const [selected, setSelected] = useState(null);
  return <DashboardShell role="estudiante" title="Mis postulaciones" eyebrow="Seguimiento de oportunidades">
    <DemoNotice />
    <div className="mb-5 grid gap-3 sm:grid-cols-3"><Summary label="Total" value="4" /><Summary label="En revisión" value="1" /><Summary label="Aceptadas" value="1" /></div>
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[1fr_180px_180px]"><input className={inputClass} placeholder="Buscar por puesto o empresa" /><select className={`${inputClass} select-chevron`}><option>Todos los estados</option><option>Enviada</option><option>En revisión</option><option>Aceptada</option><option>Rechazada</option><option>Retirada</option></select><select className={`${inputClass} select-chevron`}><option>Más recientes</option><option>Más antiguas</option></select></div>
      <div className="hidden md:block"><ResponsiveTable headings={["Puesto / convocatoria", "Empresa", "Modalidad", "Fecha", "Estado", ""]}>{applications.map((item) => <tr key={item.id} className="border-b border-slate-100 last:border-0"><td className="px-4 py-4"><p className="font-semibold text-slate-800">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.type}</p></td><td className="px-4 py-4 text-slate-600">{item.company}</td><td className="px-4 py-4 text-slate-600">{item.mode}</td><td className="px-4 py-4 text-slate-500">{item.date}</td><td className="px-4 py-4"><Status tone={item.tone}>{item.status}</Status></td><td className="px-4 py-4 text-right"><button onClick={() => setSelected(item)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-brand-navy" aria-label="Ver detalle"><Eye size={17} /></button></td></tr>)}</ResponsiveTable></div>
      <div className="divide-y divide-slate-100 md:hidden">{applications.map((item) => <button key={item.id} onClick={() => setSelected(item)} className="w-full p-4 text-left"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-800">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.company}</p></div><Status tone={item.tone}>{item.status}</Status></div><div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500"><span>{item.type}</span><span>{item.mode}</span><span>{item.date}</span></div></button>)}</div>
    </section>
    <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title} description={selected?.company} size="xl" footer={<><button className={secondaryButton} onClick={() => setSelected(null)}>Cerrar</button>{selected?.status !== "Retirada" && <button className="inline-flex min-h-10 items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white">Retirar postulación</button>}</>}>
      <div className="flex flex-wrap gap-2"><Status tone={selected?.tone}>{selected?.status}</Status><Status tone="navy">{selected?.type}</Status></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]"><div><h3 className="font-bold text-brand-navy">Detalle de la oportunidad</h3><p className="mt-3 text-sm leading-7 text-slate-600">Participarás en actividades del área, con acompañamiento del equipo responsable y objetivos definidos para el ciclo vigente.</p><div className="mt-5 rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-semibold text-slate-800">Seguimiento</h4><Timeline title="Postulación enviada" detail={selected?.date} active /><Timeline title={selected?.status || "En revisión"} detail="Estado actual" active /><Timeline title="Resolución" detail="Pendiente" /></div></div><aside className="space-y-3 rounded-xl bg-slate-50 p-4"><Info icon={Building2} label="Empresa" value={selected?.company} /><Info icon={MapPin} label="Modalidad" value={selected?.mode} /><Info icon={CalendarDays} label="Fecha" value={selected?.date} /><Info icon={FileText} label="CV asociado" value="CV vigente de la cuenta" /></aside></div>
    </Modal>
  </DashboardShell>;
}
function Summary({ label, value }) { return <article className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-brand-navy">{value}</p></article>; }
function Info({ icon: Icon, label, value }) { return <div className="flex gap-3"><Icon className="mt-0.5 shrink-0 text-brand-gold" size={18} /><div><p className="text-xs text-slate-500">{label}</p><p className="text-sm font-semibold text-slate-800">{value}</p></div></div>; }
function Timeline({ title, detail, active }) { return <div className="mt-4 flex gap-3"><span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${active ? "bg-brand-gold" : "bg-slate-200"}`} /><div><p className="text-sm font-semibold text-slate-800">{title}</p><p className="text-xs text-slate-500">{detail}</p></div></div>; }
