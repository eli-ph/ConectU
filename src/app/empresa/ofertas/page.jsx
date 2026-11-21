"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, MoreHorizontal, Pencil, Plus } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DemoNotice, inputClass, ResponsiveTable, Status } from "@/components/dashboard-ui";

const offers = [
  { id: "trainee-software", title: "Ingeniería trainee de software", type: "Empleo", status: "Activa", tone: "green", cycle: "Ciclo 2", places: "4 plazas", applications: "8 postulaciones" },
  { id: "analisis-datos", title: "Practicante de análisis de datos", type: "Prácticas", status: "Activa", tone: "green", cycle: "Ciclo 1", places: "2 plazas", applications: "5 postulaciones" },
  { id: "automatizacion", title: "Automatización de procesos", type: "Servicio social", status: "Borrador", tone: "slate", cycle: "Sin publicar", places: "3 plazas", applications: "—" },
  { id: "frontend", title: "Desarrollo frontend inicial", type: "Becariado", status: "Inactiva", tone: "amber", cycle: "Ciclo 1 cerrado", places: "1 plaza", applications: "12 postulaciones" },
];

export default function CompanyOffersPage() {
  const [tab, setTab] = useState("Todas");
  const visible = tab === "Todas" ? offers : offers.filter((offer) => offer.status === tab.slice(0, -1) || offer.status === tab);
  return <DashboardShell role="empresa" title="Mis ofertas" eyebrow="Gestión de oportunidades">
    <DemoNotice />
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-slate-500">Crea, publica y administra ciclos y candidaturas.</p></div><Link href="/empresa/ofertas/nueva" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17} />Crear nueva oferta</Link></div>
    <section className="rounded-xl border border-slate-200 bg-white"><div className="flex gap-1 overflow-x-auto border-b border-slate-100 p-3">{["Todas","Activas","Inactivas","Borradores"].map((item) => <button key={item} onClick={() => setTab(item)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ${tab === item ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-100"}`}>{item}</button>)}</div><div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[1fr_190px_190px]"><input className={inputClass} placeholder="Buscar por título" /><select className={`${inputClass} select-chevron`}><option>Todos los tipos</option><option>Empleo</option><option>Prácticas</option><option>Becariado</option></select><select className={`${inputClass} select-chevron`}><option>Última actualización</option><option>Más postulaciones</option></select></div>
      <div className="hidden md:block"><ResponsiveTable headings={["Oferta", "Tipo", "Ciclo", "Plazas", "Estado", "Acciones"]}>{visible.map((offer) => <tr key={offer.id} className="border-b border-slate-100 last:border-0"><td className="px-4 py-4"><p className="font-semibold text-slate-800">{offer.title}</p><p className="mt-1 text-xs text-slate-500">{offer.applications}</p></td><td className="px-4 py-4 text-slate-600">{offer.type}</td><td className="px-4 py-4 text-slate-600">{offer.cycle}</td><td className="px-4 py-4 text-slate-600">{offer.places}</td><td className="px-4 py-4"><Status tone={offer.tone}>{offer.status}</Status></td><td className="px-4 py-4"><div className="flex justify-end gap-1"><Link href={`/empresa/ofertas/${offer.id}`} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-brand-navy" aria-label="Gestionar"><Eye size={16} /></Link><Link href={`/empresa/ofertas/${offer.id}/editar`} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-brand-navy" aria-label="Editar"><Pencil size={16} /></Link><button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500"><MoreHorizontal size={16} /></button></div></td></tr>)}</ResponsiveTable></div>
      <div className="divide-y divide-slate-100 md:hidden">{visible.map((offer) => <article key={offer.id} className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-800">{offer.title}</h3><p className="mt-1 text-xs text-slate-500">{offer.type} · {offer.cycle}</p></div><Status tone={offer.tone}>{offer.status}</Status></div><div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>{offer.places} · {offer.applications}</span><div className="flex gap-2"><Link href={`/empresa/ofertas/${offer.id}`} className="font-semibold text-brand-navy">Gestionar</Link><Link href={`/empresa/ofertas/${offer.id}/editar`} className="font-semibold text-brand-navy">Editar</Link></div></div></article>)}</div>
    </section>
  </DashboardShell>;
}
