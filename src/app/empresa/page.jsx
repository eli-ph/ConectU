import { BarChart3, BriefcaseBusiness, Building2, CheckCircle2, Clock3, Send, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { MetricCard } from "@/components/metric-card";

export const metadata = { title: "Panel empresarial" };

export default function CompanyDashboard() {
  return (
    <DashboardShell role="empresa" title="Resumen empresarial" eyebrow="Panel de la organización">
      <div className="mb-5 flex flex-col justify-between gap-3 rounded-xl bg-[#eeefff] px-5 py-3 sm:flex-row sm:items-center"><p className="text-sm text-brand-navy"><strong>Vista de demostración.</strong> Los datos reales se mostrarán después de conectar la cuenta.</p><span className="w-fit rounded-lg bg-brand-navy px-4 py-2 text-xs font-semibold text-white">Aprobada y activa</span></div>

      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-navy text-brand-gold"><Building2 size={25} /></span>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold text-brand-navy">Empresa demostrativa</h2><span className="rounded-full bg-brand-gold-soft px-3 py-1 text-xs font-semibold text-[#765600]">Empresa aprobada</span></div><div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500"><span>RFC protegido</span><span>Perfil empresarial</span><span>Plan gratuito</span></div></div>
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-5 border-l-[5px] border-brand-navy p-6 sm:flex-row sm:items-center"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-gold-soft text-[#765600]"><ShieldCheck size={23} /></span><div className="flex-1"><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#765600]">Estado administrativo</p><h2 className="mt-1 text-lg font-bold text-brand-navy">Aprobación empresarial</h2><p className="mt-2 text-sm leading-6 text-slate-600">Una empresa pendiente puede consultar su cuenta. La creación, publicación, reactivación y promoción de ofertas se habilita después de la aprobación administrativa.</p></div><span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">Aprobación activa</span></div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={BriefcaseBusiness} label="Ofertas activas" value="— / 10" detail="Capacidad del plan gratuito" />
        <MetricCard icon={Send} label="Plazas publicadas" value="—" detail="En ciclos abiertos" tone="gold" />
        <MetricCard icon={BarChart3} label="Postulaciones del ciclo" value="—" detail="En ofertas activas" tone="blue" />
        <MetricCard icon={CheckCircle2} label="Promociones disponibles" value="—" detail="Según el plan y compras" tone="gold" />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-brand-navy">Ofertas próximas a vencer</h2><p className="text-sm text-slate-500">Ejemplos de la estructura de seguimiento.</p></div><button className="hidden text-sm font-semibold text-brand-navy sm:block">Ver todas</button></div>
          <div className="space-y-3"><ExpiringOffer title="Desarrollo frontend · nivel inicial" type="Prácticas profesionales" days="3 días" applications="— postulaciones" /><ExpiringOffer title="Automatización de procesos" type="Servicio social" days="5 días" applications="— postulaciones" /></div>
        </section>
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-brand-navy">Actividad reciente</h2><Clock3 size={18} className="text-brand-gold" /></div><div className="mt-5 divide-y divide-slate-100"><Activity title="Nueva postulación" text="Se registró una solicitud." /><Activity title="Oferta actualizada" text="Los cambios quedaron guardados." /><Activity title="Plan consultado" text="La capacidad permanece disponible." /></div><button className="mt-4 w-full rounded-lg bg-[#eeefff] px-4 py-2.5 text-sm font-semibold text-brand-navy">Ver historial completo</button></aside>
      </div>
    </DashboardShell>
  );
}

function ExpiringOffer({ title, type, days, applications }) { return <article className="border-l-4 border-amber-500 rounded-xl bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Vence en {days}</span><span className="rounded-full bg-[#eeefff] px-3 py-1 text-xs text-brand-navy">{type}</span></div><h3 className="mt-3 font-bold text-brand-navy">{title}</h3><p className="mt-2 text-xs text-slate-500">Ciclo activo · La extensión respeta las reglas del plan</p></div><div className="flex items-end gap-3 sm:flex-col sm:items-end"><span className="text-sm font-semibold text-slate-600">{applications}</span><button className="rounded-lg bg-brand-navy px-4 py-2.5 text-xs font-semibold text-white">Extender vigencia</button></div></div></article>; }
function Activity({ title, text }) { return <div className="flex gap-3 py-3 first:pt-0"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-gold" /><div><p className="text-sm font-semibold text-slate-800">{title}</p><p className="text-xs leading-5 text-slate-500">{text}</p></div></div>; }
