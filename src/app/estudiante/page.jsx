import { CheckCircle2, Clock3, FileText, Send, XCircle } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { MetricCard } from "@/components/metric-card";

export const metadata = { title: "Panel del estudiante" };

export default function StudentDashboard() {
  return (
    <DashboardShell role="estudiante" title="¡Hola, David! Bienvenido a tu portal de vinculación" eyebrow="Resumen del estudiante">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="text-sm text-slate-600">Consulta el avance de tus postulaciones y explora nuevas oportunidades.</p><span className="w-fit rounded-full bg-[#eeefff] px-3 py-1 text-xs font-semibold text-brand-navy">Vista de demostración</span></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Send} label="Total de postulaciones" value="—" detail="Histórico del estudiante" />
        <MetricCard icon={Clock3} label="En revisión" value="—" detail="Pendientes de resolución" tone="gold" />
        <MetricCard icon={CheckCircle2} label="Aceptadas" value="—" detail="Dentro del ciclo" tone="blue" />
        <MetricCard icon={XCircle} label="Rechazadas" value="—" detail="Historial conservado" />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.55fr_0.65fr]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-brand-navy">Postulaciones recientes</h2><p className="text-sm text-slate-500">Estados de ejemplo para definir la presentación.</p></div><button className="hidden text-sm font-semibold text-brand-navy sm:block">Ver todas</button></div>
          <div className="space-y-3">
            <Application initials="ET" company="Empresa tecnológica" title="Desarrollo frontend · nivel inicial" meta="Híbrida · Ciudad de México" state="En revisión" />
            <Application initials="OI" company="Organización industrial" title="Automatización de procesos" meta="Presencial · Estado de México" state="Aceptada" />
            <Application initials="CS" company="Consultoría de servicios" title="Análisis de datos" meta="Remota · México" state="Enviada" />
          </div>
        </section>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-brand-navy">Actividad reciente</h2><Clock3 size={18} className="text-brand-gold" /></div>
          <div className="mt-5 divide-y divide-slate-100">
            <Activity icon={FileText} title="CV actualizado" text="Tu archivo vigente está disponible." />
            <Activity icon={CheckCircle2} title="Estado actualizado" text="Una postulación cambió de estado." />
            <Activity icon={Send} title="Postulación enviada" text="La solicitud quedó registrada." />
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}

function Application({ initials, company, title, meta, state }) {
  const tone = state === "Aceptada" ? "bg-emerald-50 text-emerald-700" : state === "En revisión" ? "bg-amber-100 text-amber-800" : "bg-[#eeefff] text-brand-navy";
  return <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#eeefff] font-bold text-brand-navy">{initials}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-brand-navy">{company}</h3><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Oportunidad</span></div><p className="mt-1 text-sm font-medium text-slate-700">{title}</p><p className="mt-1 text-xs text-slate-500">{meta}</p></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{state}</span></article>;
}

function Activity({ icon: Icon, title, text }) { return <div className="flex gap-3 py-4 first:pt-0"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eeefff] text-brand-navy"><Icon size={17} /></span><div><p className="text-sm font-semibold text-slate-800">{title}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{text}</p></div></div>; }
