import {
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Send,
  XCircle,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { MetricCard } from "@/components/metric-card";

export const metadata = { title: "Panel del estudiante" };

export default function StudentDashboard() {
  return (
    <DashboardShell
      role="estudiante"
      title="¡Hola! Bienvenido a tu portal"
      eyebrow="Resumen del estudiante"
    >
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-600">
          Consulta el avance de tus postulaciones y explora nuevas oportunidades.
        </p>
        <span className="w-fit rounded-full bg-[#eeefff] px-3 py-1 text-xs font-semibold text-brand-navy">
          Vista de demostración
        </span>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Send}
          label="Total postulaciones"
          value="8"
          unit="históricas"
          meta="● Ciclo activo"
          rightNote="Máx. 12"
        />
        <MetricCard
          icon={Clock3}
          label="En revisión"
          value="3"
          unit="en evaluación"
          meta="Resp. prom. 48 hrs →"
          tone="gold"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Aceptadas"
          value="2"
          unit="ofertas listas"
          meta="Selección de plaza →"
          tone="blue"
        />
        <MetricCard
          icon={XCircle}
          label="Rechazadas"
          value="1"
          unit="concluida"
          meta="Sin penalización"
        />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.55fr_0.65fr]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-brand-navy">Postulaciones recientes</h2>
              <p className="text-sm text-slate-500">Postulaciones a las que has aplicado.</p>
            </div>
            <button className="hidden text-sm font-semibold text-brand-navy sm:block">
              Ver todas
            </button>
          </div>

          <div className="space-y-3">
            <Application
              initials="ET"
              company="Empresa tecnológica"
              tag="Oportunidad"
              title="Desarrollo frontend · nivel inicial"
              sentDate="Enviada: 14 Feb"
              location="Híbrida · Ciudad de México"
              state="En revisión"
            />
            <Application
              initials="OI"
              company="Organización industrial"
              tag="Oportunidad"
              title="Automatización de procesos"
              sentDate="Enviada: 10 Feb"
              location="Presencial · Estado de México"
              state="Aceptada"
            />
            <Application
              initials="CS"
              company="Consultoría de servicios"
              tag="Oportunidad"
              title="Análisis de datos"
              sentDate="Enviada: 05 Feb"
              location="Remota · México"
              state="Enviada"
            />
          </div>
        </section>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-navy">Actividad reciente</h2>
            <Clock3 size={18} className="text-brand-gold" />
          </div>
          <div className="mt-5 divide-y divide-slate-100">
            <Activity
              icon={FileText}
              title="CV actualizado"
              text="Tu archivo vigente está disponible."
            />
            <Activity
              icon={CheckCircle2}
              title="Estado actualizado"
              text="Una postulación cambió de estado."
            />
            <Activity
              icon={Send}
              title="Postulación enviada"
              text="La solicitud quedó registrada."
            />
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}

function Application({ initials, company, tag, title, sentDate, location, state }) {
  const badgeConfig = {
    Aceptada: {
      style: "bg-emerald-50 text-emerald-700",
      Icon: Check,
    },
    "En revisión": {
      style: "bg-amber-100 text-amber-800",
      Icon: Clock3,
    },
    Enviada: {
      style: "bg-[#eeefff] text-brand-navy",
      Icon: Send,
    },
  };

  const current = badgeConfig[state] || badgeConfig.Enviada;
  const StatusIcon = current.Icon;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#eeefff] font-bold text-brand-navy">
        {initials}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-brand-navy">{company}</h3>
          {tag && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              {tag}
            </span>
          )}
        </div>

        <p className="mt-1 text-sm font-medium text-slate-700">{title}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Calendar size={13} className="shrink-0 text-slate-400" />
            {sentDate}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} className="shrink-0 text-slate-400" />
            {location}
          </span>
        </div>
      </div>

      <span
        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${current.style}`}
      >
        <StatusIcon size={13} className="shrink-0" />
        {state}
      </span>
    </article>
  );
}

function Activity({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-3 py-4 first:pt-0">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eeefff] text-brand-navy">
        <Icon size={17} />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{text}</p>
      </div>
    </div>
  );
}