"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, BookOpen, BriefcaseBusiness, CheckCircle2, Clock3, FileText, GraduationCap, Mail, MapPin, ShieldCheck, XCircle } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

const examples = {
  "candidato-1": { name:"David Hernández", initials:"DH", faculty:"Facultad demostrativa", career:"Programa académico demostrativo", semester:"7° semestre", average:"9.1", location:"Ciudad de México", status:"En revisión", skills:["Python", "SQL", "Git"], summary:"Me interesa participar en la oportunidad y fortalecer mi experiencia profesional mediante proyectos de desarrollo.", applied:"12 oct 2026" },
  "candidato-2": { name:"Andrea Moreno", initials:"AM", faculty:"—", career:"Programa académico demostrativo", semester:"—", average:"—", location:"—", status:"Enviada", skills:[], summary:"—", applied:"11 oct 2026" },
  "candidato-3": { name:"Luis Torres", initials:"LT", faculty:"—", career:"Programa académico demostrativo", semester:"—", average:"—", location:"—", status:"Aceptada", skills:[], summary:"—", applied:"10 oct 2026" },
};
function Block({ icon: Icon, title, subtitle, children }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"><Icon size={19} className="text-brand-gold-dark"/><div><h2 className="text-sm font-bold text-brand-navy sm:text-base">{title}</h2>{subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}</div></div>
    <div className="p-5 sm:p-6">{children}</div>
  </section>;
}
function Info({ title, value }) {return <div className="rounded-xl bg-[#f2f4fd] p-4"><p className="text-xs text-slate-500">{title}</p><p className="mt-2 font-semibold text-brand-navy">{value || "—"}</p></div>;}
export function CompanyCandidateDetail({ id }) {
  const candidate = examples[id] || examples["candidato-1"];
  const [status, setStatus] = useState(candidate.status);
  const [feedback, setFeedback] = useState("");
  function setPreview(next) { setStatus(next); setFeedback("Estado actualizado en la vista de ejemplo. El cambio real requerirá guardado y autorización del servidor."); }
  return <DashboardShell role="empresa" title="Detalle de candidatura" eyebrow="Revisión de postulaciones">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="text-xs font-semibold text-slate-500">Mis ofertas / Postulaciones / {candidate.name}</div><Link href="/empresa/ofertas" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-brand-navy"><ArrowLeft size={16}/>Volver a mis ofertas</Link></div>
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.95fr)]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start"><span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-brand-navy text-xl font-extrabold text-white">{candidate.initials}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-bold text-brand-navy sm:text-2xl">{candidate.name}</h1><span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-bold text-brand-navy">{status}</span></div><p className="mt-2 text-sm text-slate-600">Estudiante · {candidate.career}</p><div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600"><span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2"><Mail size={14}/>Correo protegido</span><span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2"><MapPin size={14}/>{candidate.location}</span></div></div></div></section>
        <Block icon={GraduationCap} title="Ficha académica" subtitle="Información que el estudiante registró en su cuenta"><div className="grid gap-3 sm:grid-cols-2"><Info title="Facultad o escuela" value={candidate.faculty}/><Info title="Carrera" value={candidate.career}/><Info title="Semestre" value={candidate.semester}/><Info title="Promedio" value={candidate.average}/></div></Block>
        <Block icon={Clock3} title="Disponibilidad" subtitle="Información proporcionada por el candidato"><div className="grid gap-3 sm:grid-cols-3"><Info title="Horas disponibles" value="—"/><Info title="Modalidad preferida" value="—"/><Info title="Fecha de incorporación" value="—"/></div></Block>
        <Block icon={BriefcaseBusiness} title="Habilidades técnicas"><div className="flex flex-wrap gap-2">{candidate.skills.length ? candidate.skills.map((skill)=><span key={skill} className="rounded-lg bg-[#eef1fc] px-3 py-2 text-xs font-semibold text-brand-navy">{skill}</span>) : <p className="text-sm text-slate-500">No hay habilidades registradas en este ejemplo.</p>}</div></Block>
        <Block icon={BookOpen} title="Extracto profesional"><p className="rounded-xl bg-[#f4f5fb] p-4 text-sm leading-7 text-slate-700">{candidate.summary}</p></Block>
      </div>
      <aside className="space-y-5 xl:sticky xl:top-24">
        <Block icon={FileText} title="CV vigente del candidato" subtitle="Siempre se consulta el archivo actual de su perfil"><div className="flex items-center gap-3 rounded-xl bg-[#f3f5fb] p-4"><FileText size={26} className="text-brand-navy"/><div><p className="text-sm font-bold text-brand-navy">CV del estudiante</p><p className="text-xs text-slate-500">No hay archivo conectado</p></div></div><button type="button" disabled className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-brand-navy opacity-50">Ver CV</button></Block>
        <Block icon={ShieldCheck} title="Resolución de postulación" subtitle={`Solicitud recibida el ${candidate.applied}`}><p className="mb-3 text-xs text-slate-500">Estado actual: <strong>{status}</strong></p><button type="button" disabled={status==="Aceptada"} onClick={()=>setPreview("Aceptada")} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-semibold text-white disabled:opacity-50"><CheckCircle2 size={17}/>Aceptar candidato</button><button type="button" disabled={status==="Rechazada"} onClick={()=>setPreview("Rechazada")} className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 text-sm font-semibold text-rose-700 disabled:opacity-50"><XCircle size={17}/>Rechazar postulación</button>{feedback && <p role="status" className="mt-3 text-xs leading-5 text-slate-600">{feedback}</p>}</Block>
      </aside>
    </div>
  </DashboardShell>;
}
