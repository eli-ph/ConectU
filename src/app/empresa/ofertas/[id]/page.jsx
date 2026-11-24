import Link from "next/link";
import { CalendarDays, FileText, MapPin, Pencil, Users } from "lucide-react";
import { candidaturasOferta } from "@/server/services/postulaciones.service";
import { estadoPostulacion } from "@/lib/application-status";
import { DashboardShell } from "@/components/dashboard-shell";
import { Panel, Status } from "@/components/dashboard-ui";
import { exigirRol } from "@/server/auth/session";
import { detalleOfertaEmpresa } from "@/server/services/ofertas.service";
import { notFound } from "next/navigation";
import { OFFER_TYPE_LABELS } from "@/lib/offer-types";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const metadata={title:"Detalle de oferta | ConectU"};
export default async function OfertaGestionPage({params}){
  const usuario=await exigirRol('empresa');
  let oferta, candidatos;try{const id=(await params).id;oferta=detalleOfertaEmpresa(usuario,id);candidatos=candidaturasOferta(usuario,id).candidatos;}catch(e){if(e.status===404||e.status===400)notFound();throw e;}
  return <DashboardShell role="empresa" title="Gestión de oferta" eyebrow="Mis ofertas">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap justify-between gap-4">
        <div><div className="flex flex-wrap gap-2"><Status tone={oferta.estado==='publicada'?'green':'slate'}>{oferta.estado==='publicada'?'Publicada':oferta.estado==='borrador'?'Borrador':'Cerrada'}</Status><Status tone="navy">{OFFER_TYPE_LABELS[oferta.tipo]||oferta.tipo}</Status></div>
          <h1 className="mt-3 text-xl font-bold text-brand-navy">{oferta.titulo}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500"><span className="inline-flex items-center gap-1"><MapPin size={15}/>{oferta.ciudad}</span><span className="inline-flex items-center gap-1"><CalendarDays size={15}/>Vence: {oferta.fecha_vencimiento||'Sin definir'}</span><span>{oferta.plazas} plazas</span></div>
        </div>
        {oferta.estado!=='cerrada' && <Link href={`/empresa/ofertas/${oferta.id}/editar`} className="inline-flex items-center gap-2 self-start rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white"><Pencil size={15}/>Editar oferta</Link>}
      </div>
      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-700">{oferta.descripcion}</p>
      {!!oferta.habilidades.length&&<div className="mt-4 flex flex-wrap gap-2">{oferta.habilidades.map(h=><span key={h} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-brand-navy">{h}</span>)}</div>}
    </section>
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <Panel title={`Postulaciones (${candidatos.length})`} description="Candidatos que se postularon a esta oferta."><div className="divide-y divide-slate-100">{candidatos.length?candidatos.map(c=><div key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><div><p className="font-semibold text-brand-navy">{c.nombre} {c.apellidos}</p><p className="mt-1 text-xs text-slate-500">{c.carrera||'Carrera sin registrar'} · {c.postulada_at}</p><Status tone={estadoPostulacion(c.estado).tone}>{estadoPostulacion(c.estado).label}</Status></div><Link href={`/empresa/postulaciones/${c.id}`} className="rounded-lg bg-brand-navy px-3 py-2 text-xs font-semibold text-white">Ver candidato</Link></div>):<p className="p-5 text-sm text-slate-500">Todavía no hay postulaciones para esta oferta.</p>}</div></Panel>
      <Panel title="Documentos de la oferta"><div className="space-y-2 p-5">{oferta.adjuntos.length?oferta.adjuntos.map(doc=><a key={doc.id} target="_blank" rel="noreferrer" href={`/api/empresa/ofertas/${oferta.id}/archivos/${doc.id}`} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm text-brand-navy hover:bg-slate-50"><FileText size={17}/>{doc.nombre_original}</a>):<p className="text-sm text-slate-500">No hay documentos adjuntos.</p>}</div></Panel>
    </div>
    <Link href="/empresa/ofertas" className="mt-5 inline-block text-sm font-semibold text-brand-navy hover:underline">Volver a Mis ofertas</Link>
  </DashboardShell>;
}
