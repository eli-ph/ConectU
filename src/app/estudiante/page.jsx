import Link from 'next/link';
import {Clock3,Send,CheckCircle2,XCircle,FileText,MapPin,ArrowRight} from 'lucide-react';
import {DashboardShell} from '@/components/dashboard-shell';
import {MetricCard} from '@/components/metric-card';
import {Status} from '@/components/dashboard-ui';
import {exigirRol} from '@/server/auth/session';
import {misPostulaciones} from '@/server/services/postulaciones.service';
import {estadoPostulacion} from '@/lib/application-status';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const metadata={title:'Resumen estudiantil | ConectU'};
export default async function StudentDashboard(){
  const user=await exigirRol('estudiante');
  const apps=misPostulaciones(user);
  const total=apps.length;
  const count=state=>apps.filter(a=>a.estado===state).length;
  return <DashboardShell role="estudiante" title={`¡Hola, ${user.nombre}!`} eyebrow="Resumen del estudiante">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-600">Consulta tus solicitudes y encuentra nuevas oportunidades.</p></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard icon={Send} label="Total postulaciones" value={String(total)} unit="históricas" />
      <MetricCard icon={Clock3} label="En revisión" value={String(count('en_revision'))} unit="solicitudes" tone="gold"/>
      <MetricCard icon={CheckCircle2} label="Aceptadas" value={String(count('aceptada'))} unit="solicitudes" tone="blue"/>
      <MetricCard icon={XCircle} label="Rechazadas" value={String(count('rechazada'))} unit="solicitudes"/>
    </div>
    <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(250px,.65fr)]">
      <section><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-brand-navy">Postulaciones recientes</h2><p className="mt-1 text-sm text-slate-500">Los últimos movimientos de tus solicitudes.</p></div><Link href="/estudiante/postulaciones" className="text-sm font-semibold text-brand-navy hover:underline">Ver todas</Link></div>
        <div className="space-y-3">{apps.slice(0,4).map(p=><article key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-5"><div className="min-w-0"><p className="font-bold text-brand-navy">{p.titulo}</p><p className="mt-1 text-sm text-slate-600">{p.empresa_nombre}</p><p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><MapPin size={14}/>{p.ciudad||'Ubicación no especificada'}</p></div><Status tone={estadoPostulacion(p.estado).tone}>{estadoPostulacion(p.estado).label}</Status></article>)}{!apps.length&&<div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">Todavía no tienes postulaciones. <Link href="/ofertas" className="font-semibold text-brand-navy underline">Explorar oportunidades</Link></div>}</div>
      </section>
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-2"><FileText size={19} className="text-brand-gold-dark"/><h2 className="text-lg font-bold text-brand-navy">Tu perfil</h2></div><p className="mt-3 text-sm leading-6 text-slate-600">Mantén actualizados tus datos, habilidades y CV para que las empresas puedan consultar tu información vigente.</p><Link href="/estudiante/cuenta" className="ui-button-secondary mt-5 w-full justify-center">Ir a Mi cuenta</Link></aside>
    </div>
  </DashboardShell>;
}
