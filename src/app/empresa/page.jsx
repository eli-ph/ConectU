import Link from "next/link";
import {
  Award, BriefcaseBusiness, Building2, Calendar, CheckCircle2, ChevronRight,
  Clock, Eye, FileText, GraduationCap, MapPin, Rocket, ShieldCheck,
  Timer, UserCheck, Users,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { exigirRol } from "@/server/auth/session";
import { obtenerDashboardEmpresa } from "@/server/services/dashboard-empresa.service";
import { OFFER_TYPE_LABELS } from "@/lib/offer-types";
import { estadoPostulacion } from "@/lib/application-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = { title: "Resumen empresarial | ConectU" };

function fechaCorta(valor) {
  if (!valor) return "Sin definir";
  const iso = String(valor).slice(0,10);
  const date = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(date.valueOf()) ? iso : new Intl.DateTimeFormat("es-MX", {timeZone:"UTC",day:"numeric",month:"short",year:"numeric"}).format(date);
}
function fechaActividad(valor) {
  if (!valor) return "";
  const date = new Date(String(valor).replace(" ","T")+ (String(valor).includes("Z")?"":"Z"));
  return Number.isNaN(date.valueOf()) ? String(valor) : new Intl.DateTimeFormat("es-MX", {
    timeZone:"America/Mexico_City",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"
  }).format(date);
}
function diasRestantes(hoy,fin) {
  return Math.round((Date.parse(fin+'T00:00:00Z')-Date.parse(hoy+'T00:00:00Z'))/86400000);
}
function StatCard({ title, icon:Icon, value, suffix, description, foot, accent="gold", children }) {
  const tone = accent === "gold" ? "bg-brand-gold-soft text-[#9e7400]" : "bg-[#eeefff] text-indigo-600";
  return <article className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${tone}`}><Icon size={16}/></span>
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
        <span className="text-3xl font-bold text-brand-navy">{value}</span>
        {suffix && <span className="text-xs font-medium text-slate-500">{suffix}</span>}
      </div>
      {description && <p className="mt-2 text-[11px] text-slate-500">{description}</p>}
      {children}
    </div>
    {foot && <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">{foot}</div>}
  </article>;
}
function ExpiringOffer({ oferta, hoy }) {
  const dias = diasRestantes(hoy,oferta.fecha_vencimiento);
  const urgente = dias<=3;
  const libres=Math.max(0,oferta.plazas-oferta.aceptadas);
  return <article className={`rounded-2xl border border-slate-200/90 border-l-[5px] bg-white p-5 shadow-xs ${urgente?'border-l-rose-600':'border-l-[#9e7400]'}`}>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${urgente?'bg-rose-50 text-rose-700':'bg-brand-gold-soft text-[#765600]'}`}><Clock size={12}/> {dias===0?'Vence hoy':`Vence en ${dias} ${dias===1?'día':'días'}`}</span>
          <span className="rounded-full bg-[#eeefff] px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">{OFFER_TYPE_LABELS[oferta.tipo]||oferta.tipo}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">{oferta.modalidad==='hibrida'?'Híbrida':oferta.modalidad==='remota'?'Remota':'Presencial'}</span>
        </div>
        <h3 className="mt-2.5 text-base font-bold text-brand-navy">{oferta.titulo}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">{oferta.eje_nombre||'Sin eje asignado'} · Publicada: {fechaCorta(oferta.fecha_publicacion)} · Vence: {fechaCorta(oferta.fecha_vencimiento)}</p>
      </div>
      <div className="shrink-0 text-left sm:text-right"><p className="text-2xl font-bold leading-none text-brand-navy">{oferta.postulaciones}</p><p className="mt-1 text-[11px] font-medium text-slate-500">Postulados</p></div>
    </div>
    <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-3.5 sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5 font-medium"><CheckCircle2 size={14} className="text-[#9e7400]"/>{libres} plazas disponibles</span>
        <span className="text-slate-300">•</span>
        <span className="inline-flex items-center gap-1.5 text-slate-500"><Eye size={14} className="text-slate-400"/>{oferta.vistas} vistas</span>
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/empresa/ofertas?extender=${oferta.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-navy/90"><Clock size={14}/>Extender vigencia</Link>
        <Link href={`/empresa/ofertas/${oferta.id}`} aria-label={`Ver detalle de ${oferta.titulo}`} className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-brand-navy"><ChevronRight size={16}/></Link>
      </div>
    </div>
  </article>;
}
function RecentActivity({item}) {
  const nombre = `${item.nombre} ${item.apellidos}`.trim();
  const label = item.estado==='enviada'?'Nueva postulación':`Postulación ${estadoPostulacion(item.estado).label.toLowerCase()}`;
  return <Link href={`/empresa/postulaciones/${item.postulacion_id}`} className="flex items-start gap-3 rounded-lg py-3.5 transition hover:bg-slate-50">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-gold-soft text-[#9e7400]"><Users size={16}/></span>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-xs font-bold text-brand-navy">{nombre}</p><time className="text-[10px] text-slate-400">{fechaActividad(item.created_at)}</time></div><p className="mt-0.5 text-xs leading-5 text-slate-500">{label} · {item.oferta_titulo}</p></div>
  </Link>;
}

export default async function CompanyDashboard() {
  const user=await exigirRol('empresa');
  const approved=user.estado_verificacion==='aprobada';
  if(!approved){
    const estado={pendiente:'En revisión administrativa',rechazada:'Solicitud rechazada',suspendida:'Cuenta empresarial suspendida'}[user.estado_verificacion]||'Estado pendiente';
    return <DashboardShell role="empresa" title="Resumen empresarial" eyebrow="Estado de tu cuenta">
      <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-soft sm:p-8"><div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700"><ShieldCheck size={25}/></span>
        <div><h2 className="text-xl font-bold text-brand-navy">{user.nombre_comercial}</h2><p className="mt-1 text-sm font-semibold text-amber-700">{estado}</p><p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Tu cuenta está registrada. Para gestionar ofertas y contratar servicios, tu empresa debe contar con aprobación administrativa.</p>
          {user.motivo_rechazo&&<p className="mt-3 text-sm text-rose-700">Motivo: {user.motivo_rechazo}</p>}
          <p className="mt-3 text-xs text-slate-500">RFC: {user.rfc} · {user.email}</p>
          <Link href="/empresa/cuenta" className="ui-button-primary mt-5 inline-flex min-h-11 items-center">Consultar mi cuenta</Link>
        </div>
      </div></section>
    </DashboardShell>;
  }
  const resumen=obtenerDashboardEmpresa(user);
  const cap=resumen.capacidad, porcentaje=cap.limite?Math.min(100,Math.round(cap.activas*100/cap.limite)):null;
  const otrasActivas=Math.max(0,cap.activas-resumen.totalProximas);
  return <DashboardShell role="empresa" title="Empresa" badge="CORPORATIVO" hidePageHeader>
    <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-navy text-brand-gold shadow-sm"><Building2 size={26}/></span>
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-brand-navy sm:text-xl">{user.nombre_comercial}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold-soft px-3 py-1 text-xs font-semibold text-[#765600]"><CheckCircle2 size={13}/>Empresa aprobada por administración</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eeefff] px-3 py-1 text-xs font-semibold text-indigo-700"><Award size={13}/>Plan {cap.plan}</span>
        </div>
        <div className="mt-2"><span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"><Calendar size={12}/>{user.plan_fecha_fin?`Vigencia: ${fechaCorta(user.plan_fecha_fin)}`:'Sin fecha de vencimiento'}</span></div>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5"><FileText size={13}/>RFC: {user.rfc}</span><span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5"><MapPin size={13}/>Sede: {[user.ciudad,user.entidad].filter(Boolean).join(', ')||'No especificada'}</span>
          <span className="text-slate-300">•</span><span className="inline-flex items-center gap-1.5"><GraduationCap size={13}/>Registro empresarial en ConectU</span>
        </div></div>
      </div>
    </section>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Ofertas actuales" icon={BriefcaseBusiness} value={cap.activas} suffix={cap.limite==null?'sin límite':`/ ${cap.limite} activas`} foot={<>{cap.limite==null?'Capacidad sin límite numérico':`${cap.libres} cupos disponibles`}</>}>
        {porcentaje!=null&&<div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#9e7400]" style={{width:`${porcentaje}%`}}/></div>}
      </StatCard>
      <StatCard title="PLAZAS UNIVERSITARIAS" icon={UserCheck} accent="indigo" value={resumen.plazas.total} suffix="plazas" description="En las ofertas publicadas y vigentes" foot={`${resumen.plazas.disponibles} plazas disponibles`}/>
      <StatCard title="POSTULACIONES RECIBIDAS" icon={Users} accent="indigo" value={resumen.postulaciones.total} suffix="solicitudes" description="Historial de postulaciones a tus ofertas" foot={`${resumen.postulaciones.por_revisar} pendientes de resolución · ${resumen.postulaciones.nuevas} nuevas`}/>
      <StatCard title="PROMOCIONES INCLUIDAS" icon={Rocket} value={resumen.promociones.disponibles} suffix={`disponibles de ${resumen.promociones.incluidas}`} description="Activaciones pendientes de utilizar de tu plan actual" foot={<Link href="/empresa/plan" className="font-bold text-[#8b6600] hover:underline">Ir a Plan y promociones</Link>}/>
    </div>
    <div className="mt-7 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
      <section>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div><h2 className="flex items-center gap-2 text-lg font-bold text-brand-navy"><Timer size={20} className="text-[#9e7400]"/>Ofertas próximas a vencer (≤ 7 días)</h2><p className="mt-0.5 text-xs text-slate-500">Publicaciones que ya pueden extenderse si cumplen las condiciones del plan.</p></div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${resumen.totalProximas?'bg-rose-100 text-rose-700':'bg-slate-100 text-slate-600'}`}>{resumen.totalProximas} {resumen.totalProximas===1?'oferta':'ofertas'}</span>
        </div>
        <div className="space-y-4">{resumen.proximas.length?resumen.proximas.map(o=><ExpiringOffer key={o.id} oferta={o} hoy={resumen.hoy}/>):<div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-xs">No hay ofertas próximas a vencer en los siguientes siete días.</div>}</div>
        {resumen.totalProximas>resumen.proximas.length&&<p className="mt-3 text-xs text-slate-500">Se muestran las seis ofertas con vencimiento más próximo. Consulta el listado para ver las demás.</p>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-5 py-3.5 shadow-xs"><span className="inline-flex items-center gap-2 text-xs text-slate-600"><CheckCircle2 size={16} className="text-[#9e7400]"/>{otrasActivas} {otrasActivas===1?'oferta activa adicional tiene':'ofertas activas adicionales tienen'} más de siete días de vigencia.</span><Link href="/empresa/ofertas" className="text-xs font-bold text-brand-navy hover:underline">Ver todas ({cap.activas})</Link></div>
      </section>
      <aside className="flex h-fit flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs"><div>
        <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-base font-bold text-brand-navy"><Clock size={18} className="text-[#9e7400]"/>Actividad reciente</h2><span className="rounded-full bg-[#eeefff] px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">Últimos movimientos</span></div>
        <div className="mt-4 divide-y divide-slate-100">{resumen.actividad.length?resumen.actividad.map(item=><RecentActivity key={item.id} item={item}/>):<p className="py-5 text-sm text-slate-500">Aún no hay movimientos de postulaciones para mostrar.</p>}</div>
      </div><Link href="/empresa/ofertas" className="mt-5 block w-full rounded-xl bg-slate-100 px-4 py-2.5 text-center text-xs font-bold text-brand-navy transition hover:bg-slate-200/70">Ver mis ofertas</Link></aside>
    </div>
  </DashboardShell>;
}
