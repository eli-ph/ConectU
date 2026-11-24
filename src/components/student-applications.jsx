'use client';
import {useCallback,useMemo,useState} from 'react';
import Link from 'next/link';
import {Search,Eye,CalendarDays} from 'lucide-react';
import {DashboardShell} from '@/components/dashboard-shell';
import {Status} from '@/components/dashboard-ui';
import {TablePagination} from '@/components/table-pagination';
import {OFFER_TYPE_LABELS} from '@/lib/offer-types';
import {estadoPostulacion} from '@/lib/application-status';
import {OfferModal,toOfferDetail} from '@/components/offer-detail-modal';

const statusFilters=[['Todas','Todas'],['enviada','Enviadas'],['en_revision','En revisión'],['aceptada','Aceptadas'],['rechazada','Rechazadas'],['retirada','Retiradas']];
const fecha=(v)=>v?new Date(String(v).replace(' ','T')+'Z').toLocaleDateString('es-MX',{year:'numeric',month:'short',day:'numeric'}):'—';
export function StudentApplications({initialApplications=[]}){
  const [apps,setApps]=useState(initialApplications);
  const [status,setStatus]=useState('Todas');
  const [type,setType]=useState('Todos');
  const [query,setQuery]=useState('');
  const [sort,setSort]=useState('recientes');
  const [page,setPage]=useState(1);
  const [pageSize,setPageSize]=useState(5);
  const [selectedId,setSelectedId]=useState(null);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const closeDetail=useCallback(()=>setSelectedId(null),[]);
  const chosen=apps.find(p=>p.id===selectedId)||null;
  const filtered=useMemo(()=>apps.filter(p=>
    (status==='Todas'||p.estado===status)&&
    (type==='Todos'||p.tipo===type)&&
    [p.titulo,p.empresa_nombre,p.ciudad].join(' ').toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))
  ).sort((a,b)=>sort==='antiguas'?a.id-b.id:b.id-a.id),[apps,status,type,query,sort]);
  const pages=Math.max(1,Math.ceil(filtered.length/pageSize));
  const safePage=Math.min(page,pages);
  const rows=filtered.slice((safePage-1)*pageSize,safePage*pageSize);
  const counts=Object.fromEntries(statusFilters.map(([key])=>[key,key==='Todas'?apps.length:apps.filter(a=>a.estado===key).length]));
  async function retirar(){
    if(!chosen||!window.confirm('¿Deseas retirar esta postulación?'))return;
    setBusy(true);setMessage('');
    try{
      const res=await fetch(`/api/estudiante/postulaciones/${chosen.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'retirar'})});
      const body=await res.json();if(!res.ok)throw new Error(body.message||'No fue posible retirar la solicitud.');
      setApps(old=>old.map(p=>p.id===chosen.id?{...p,estado:'retirada'}:p));
      setMessage('Tu postulación fue retirada.');
    }catch(e){setMessage(e.message||'No fue posible completar la operación.');}
    finally{setBusy(false);}
  }
  return <DashboardShell role="estudiante" title="Mis postulaciones" eyebrow="Seguimiento de solicitudes" description="Consulta el estado de tus postulaciones y sus detalles.">
    <div className="mb-4 flex flex-wrap gap-2">
      {statusFilters.map(([key,label])=><button key={key} type="button" onClick={()=>{setStatus(key);setPage(1);}} className={`rounded-full border px-3.5 py-2 text-xs font-semibold ${status===key?'border-brand-navy bg-brand-navy text-white':'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>{label} <span className="ml-1 opacity-75">{counts[key]}</span></button>)}
    </div>
    <section className="ui-card overflow-hidden">
      <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 p-4 sm:p-5">
        <label className="min-w-[190px] flex-1 text-xs font-semibold text-slate-600"><span>Buscar</span><div className="relative mt-2"><Search size={16} className="absolute left-3 top-3 text-slate-400"/><input className="ui-control pl-10" placeholder="Oferta o empresa" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}}/></div></label>
        <label className="min-w-[190px] flex-1 text-xs font-semibold text-slate-600">Tipo de oferta<select className="ui-control mt-2" value={type} onChange={e=>{setType(e.target.value);setPage(1);}}><option value="Todos">Todos los tipos</option>{Object.entries(OFFER_TYPE_LABELS).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
        <label className="min-w-[160px] text-xs font-semibold text-slate-600">Ordenar<select className="ui-control mt-2" value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}><option value="recientes">Más recientes</option><option value="antiguas">Más antiguas</option></select></label>
      </div>
      <div className="overflow-x-auto"><table className="conectu-table w-full border-collapse text-left text-sm"><thead><tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-600"><th className="px-5 py-3">Oportunidad</th><th className="px-5 py-3">Tipo</th><th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3 text-right">Acción</th></tr></thead><tbody>
        {rows.map(item=><tr key={item.id} className="border-b border-slate-100 last:border-0"><td className="px-5 py-4"><span className="font-bold text-brand-navy">{item.titulo}</span><div className="text-xs text-slate-500">{item.empresa_nombre}</div></td><td className="px-5 py-4 text-slate-600">{OFFER_TYPE_LABELS[item.tipo]||item.tipo}</td><td className="px-5 py-4 text-slate-600">{fecha(item.postulada_at)}</td><td className="px-5 py-4"><Status tone={estadoPostulacion(item.estado).tone}>{estadoPostulacion(item.estado).label}</Status></td><td className="px-5 py-4 text-right"><button type="button" className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-3 py-2 text-xs font-bold text-white" onClick={()=>{setSelectedId(item.id);setMessage('');}}><Eye size={15}/>Ver detalle</button></td></tr>)}
        {!rows.length&&<tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">{apps.length?'No hay resultados con esos filtros.':'Todavía no has enviado postulaciones.'} {!apps.length&&<Link href="/ofertas" className="font-semibold text-brand-navy underline">Explorar ofertas</Link>}</td></tr>}
      </tbody></table></div>
      <TablePagination page={safePage} pages={pages} onChange={setPage} total={filtered.length} pageSize={pageSize} onPageSizeChange={s=>{setPageSize(s);setPage(1);}} label="postulaciones"/>
    </section>
    {chosen && <OfferModal key={chosen.id} offer={toOfferDetail({...chosen,id:chosen.oferta_id})} onClose={closeDetail}
      applicationDetails={<section className="mt-6 space-y-3 rounded-xl border border-slate-200 p-4">
        <h3 className="font-extrabold text-brand-navy">Tu postulación</h3>
        <div className="flex flex-wrap items-center gap-3"><Status tone={estadoPostulacion(chosen.estado).tone}>{estadoPostulacion(chosen.estado).label}</Status><span className="inline-flex items-center gap-1 text-xs text-slate-500"><CalendarDays size={14}/>Enviada: {fecha(chosen.postulada_at)}</span></div>
        {chosen.mensaje&&<div><p className="text-sm font-bold text-brand-navy">Mensaje enviado</p><p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{chosen.mensaje}</p></div>}
        {message&&<p role="status" className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{message}</p>}
      </section>}
      applicationFooter={<div className="flex flex-wrap justify-end gap-2 sm:ml-auto"><button type="button" className="ui-button-secondary" onClick={closeDetail}>Cerrar</button>{['enviada','en_revision'].includes(chosen.estado)&&<button type="button" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60" disabled={busy} onClick={retirar}>{busy?'Procesando…':'Retirar postulación'}</button>}</div>}/>}
  </DashboardShell>;
}
