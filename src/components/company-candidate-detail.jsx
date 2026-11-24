"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, BriefcaseBusiness, CheckCircle2, Clock3, FileText, GraduationCap, Mail, MapPin, ShieldCheck, XCircle } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Status } from "@/components/dashboard-ui";
import { estadoPostulacion } from "@/lib/application-status";
import { nombreVisibleCarrera } from "@/lib/career-name";

function Block({ icon: Icon, title, subtitle, children }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
      <Icon size={19} className="shrink-0 text-brand-gold-dark" />
      <div><h2 className="text-sm font-bold text-brand-navy sm:text-base">{title}</h2>{subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}</div>
    </div>
    <div className="p-5 sm:p-6">{children}</div>
  </section>;
}

function Info({ title, value }) {
  return <div className="rounded-xl bg-[#f2f4fd] p-4">
    <p className="text-xs text-slate-500">{title}</p>
    <p className="mt-2 break-words text-sm font-semibold text-brand-navy">{value ?? "—"}</p>
  </div>;
}

export function CompanyCandidateDetail({ candidate }) {
  const [status, setStatus] = useState(candidate.estado);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const person = `${candidate.nombre} ${candidate.apellidos}`.trim();
  const fecha = Object.fromEntries(new Intl.DateTimeFormat("en", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).map(x => [x.type, x.value]));
  const hoy = `${fecha.year}-${fecha.month}-${fecha.day}`;
  const editable = ["enviada", "en_revision"].includes(status) && candidate.oferta_estado === "publicada" && candidate.fecha_vencimiento >= hoy;

  async function cambiarEstado(nuevo) {
    if (!window.confirm(`¿Confirmas ${nuevo === "aceptada" ? "aceptar" : "rechazar"} la postulación de ${person}?`)) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/empresa/postulaciones/${candidate.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estado: nuevo }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || "No pudimos actualizar la postulación.");
      setStatus(nuevo);
      setMessage("La postulación se actualizó correctamente.");
      router.refresh();
    } catch (error) {
      setMessage(error.message || "No pudimos completar la operación.");
    } finally {
      setBusy(false);
    }
  }

  return <DashboardShell role="empresa" title="Detalle de candidatura" eyebrow="Revisión de postulaciones">
    {/* Encabezado original: ruta a la izquierda, botón de regreso a la derecha. */}
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="text-xs font-semibold text-slate-500">Mis ofertas / Postulaciones / {person}</div>
      <Link href="/empresa/ofertas" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-brand-navy transition hover:bg-slate-50">
        <ArrowLeft size={16}/>Volver a mis ofertas
      </Link>
    </div>

    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.95fr)]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-brand-navy text-xl font-extrabold text-white">{candidate.nombre?.[0]}{candidate.apellidos?.[0]}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">{person}</h1>
                <Status tone={estadoPostulacion(status).tone}>{estadoPostulacion(status).label}</Status>
              </div>
              <p className="mt-2 text-sm text-slate-600">Estudiante · {nombreVisibleCarrera(candidate.carrera) || "Carrera no registrada"}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2"><Mail size={14}/>{candidate.email || "Correo no disponible"}</span>
                {candidate.ubicacion && <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2"><MapPin size={14}/>{candidate.ubicacion}</span>}
              </div>
            </div>
          </div>
        </section>

        <Block icon={GraduationCap} title="Ficha académica" subtitle="Información que el estudiante registró en su cuenta">
          <div className="grid gap-3 sm:grid-cols-2">
            <Info title="Facultad o escuela" value={candidate.facultad}/>
            <Info title="Carrera" value={nombreVisibleCarrera(candidate.carrera)}/>
            <Info title="Semestre" value={candidate.semestre ? `${candidate.semestre}° semestre` : "—"}/>
            <Info title="Promedio" value={candidate.promedio?.toString()}/>
          </div>
        </Block>

        <Block icon={BriefcaseBusiness} title="Habilidades técnicas">
          <div className="flex flex-wrap gap-2">{candidate.habilidades?.length ? candidate.habilidades.map(h => <span key={h} className="rounded-lg bg-[#eef1fc] px-3 py-2 text-xs font-semibold text-brand-navy">{h}</span>) : <p className="text-sm text-slate-500">El estudiante no ha registrado habilidades.</p>}</div>
        </Block>

        <Block icon={BookOpen} title="Extracto profesional">
          <p className="whitespace-pre-wrap rounded-xl bg-[#f4f5fb] p-4 text-sm leading-7 text-slate-700">{candidate.resumen_profesional || "El estudiante no ha registrado un extracto profesional."}</p>
        </Block>

        {candidate.mensaje && <Block icon={FileText} title="Mensaje de postulación" subtitle="Mensaje enviado por el estudiante al postularse">
          <p className="whitespace-pre-wrap rounded-xl bg-[#f4f5fb] p-4 text-sm leading-7 text-slate-700">{candidate.mensaje}</p>
        </Block>}

        <Block icon={Clock3} title="Historial de la postulación">
          <ol className="space-y-3">{(candidate.historial || []).map((h, i) => <li key={i} className="flex flex-wrap justify-between gap-4 border-b border-slate-100 pb-2 text-xs"><span className="font-semibold text-brand-navy">{estadoPostulacion(h.estado).label}</span><span className="text-slate-500">{h.created_at}</span></li>)}</ol>
        </Block>
      </div>

      <aside className="space-y-5 xl:sticky xl:top-24">
        <Block icon={FileText} title="CV vigente del candidato" subtitle="Siempre se consulta el archivo actual de su perfil">
          <div className="flex items-center gap-3 rounded-xl bg-[#f3f5fb] p-4">
            <FileText size={26} className="shrink-0 text-brand-navy" />
            <div className="min-w-0"><p className="text-sm font-bold text-brand-navy">CV del estudiante</p><p className="break-words text-xs text-slate-500">{candidate.cv_nombre || "No hay archivo registrado"}</p></div>
          </div>
          {candidate.cv_nombre ? <a href={`/api/empresa/postulaciones/${candidate.id}/cv`} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-brand-navy hover:bg-slate-50">Ver CV</a> : <button type="button" disabled className="mt-4 min-h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-semibold text-brand-navy opacity-50">Ver CV</button>}
        </Block>

        <Block icon={ShieldCheck} title="Resolución de postulación" subtitle={`Solicitud recibida el ${candidate.postulada_at || "—"}`}>
          <p className="mb-3 text-xs text-slate-500">Estado actual: <strong>{estadoPostulacion(status).label}</strong></p>
          <button type="button" disabled={busy || !editable} onClick={() => cambiarEstado("aceptada")} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-semibold text-white disabled:opacity-50"><CheckCircle2 size={17}/>Aceptar candidato</button>
          <button type="button" disabled={busy || !editable} onClick={() => cambiarEstado("rechazada")} className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 text-sm font-semibold text-rose-700 disabled:opacity-50"><XCircle size={17}/>Rechazar postulación</button>
          {!editable && <p className="mt-3 text-xs text-slate-500">La solicitud ya tiene resolución o la oferta no está vigente.</p>}
          {message && <p role="status" className="mt-3 text-xs leading-5 text-slate-600">{message}</p>}
        </Block>
      </aside>
    </div>
  </DashboardShell>;
}
