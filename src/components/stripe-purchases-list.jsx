'use client';
import {useEffect,useMemo,useState} from 'react';
import {useRouter} from 'next/navigation';
import {CalendarDays,CheckCircle2,Clock3,CreditCard,FileText,Gift,Search,ShieldCheck} from 'lucide-react';
import {TablePagination} from '@/components/table-pagination';

const peso=(n)=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format((n||0)/100);
const estados={confirmada:['Confirmado','bg-emerald-50 text-emerald-700'],pendiente:['Pendiente','bg-amber-50 text-amber-800'],fallida:['Fallido','bg-rose-50 text-rose-700'],reembolsada:['Reembolsado','bg-amber-50 text-amber-800']};
function concepto(r){return r.tipo==='plan'?`Plan ${r.plan_nombre||'empresarial'}`:`Promoción adicional ${r.dias_promocion||''} días`;}
function fecha(x){return x?new Date(String(x).replace(' ','T')+'Z').toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'numeric',timeZone:'America/Mexico_City'}):'—';}
function Pill({status}){const [name,style]=estados[status]||[status,'bg-slate-50 text-slate-600'];return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{name}</span>;}
export function StripePurchasesList({initialPurchases=[],role='empresa',checkout=null,sessionId=null}){
 const [q,setQ]=useState(''),[type,setType]=useState('todos'),[status,setStatus]=useState('todos'),[period,setPeriod]=useState('todos'),[page,setPage]=useState(1),[pageSize,setPageSize]=useState(5);
 const admin=role==='admin';
 const router=useRouter();
 // Stripe puede redirigir antes de que llegue el webhook. Actualiza la tabla en
 // silencio; jamás confirma una compra desde la URL de retorno.
 useEffect(()=>{
   if(admin||!sessionId)return;
   let canceled=false,attempts=0;
   async function check(){
     if(canceled)return;
     try{
       const r=await fetch(`/api/empresa/compras/estado?session_id=${encodeURIComponent(sessionId)}`,{cache:'no-store'});
       const data=await r.json();
       if(r.ok&&['confirmada','reembolsada','fallida'].includes(data.compra?.estatus)){
         if(!canceled){router.replace('/empresa/compras');router.refresh();}return;
       }
     }catch{}
     if(!canceled&&++attempts<12)setTimeout(check,2000);
   }
   check();return ()=>{canceled=true;};
 },[admin,sessionId,router]);
 const filtered=useMemo(()=>initialPurchases.filter(r=>{
  const match=[r.folio,r.empresa_nombre,r.plan_nombre,r.oferta_titulo,concepto(r)].join(' ').toLocaleLowerCase('es').includes(q.trim().toLocaleLowerCase('es'));
  if(!match||(type!=='todos'&&r.tipo!==type)||(status!=='todos'&&r.estatus!==status))return false;
  if(period==='todos')return true;
  const item=new Date(String(r.created_at).replace(' ','T')+'Z');const now=new Date();
  if(period==='30dias')return item>=new Date(now.getTime()-30*86400000);
  if(period==='actual')return item.getUTCFullYear()===now.getUTCFullYear()&&item.getUTCMonth()===now.getUTCMonth();
  if(period==='anterior')return item.getUTCFullYear()===new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-1,1)).getUTCFullYear()&&item.getUTCMonth()===new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-1,1)).getUTCMonth();
  return true;
 }),[initialPurchases,q,type,status,period]);
 const pages=Math.max(1,Math.ceil(filtered.length/pageSize));const currentPage=Math.min(page,pages),visible=filtered.slice((currentPage-1)*pageSize,currentPage*pageSize);
 const paid=filtered.filter(r=>r.estatus==='confirmada');
 const total=paid.reduce((sum,r)=>sum+r.monto_centavos,0);
 const statTiles=[{label:'Compras confirmadas',value:paid.length,icon:CheckCircle2},{label:'Planes contratados',value:paid.filter(r=>r.tipo==='plan').length,icon:CreditCard},{label:'Promociones adicionales',value:paid.filter(r=>r.tipo==='promocion').length,icon:Gift},{label:'Importe confirmado',value:peso(total),icon:ShieldCheck}];
 return <>

  <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{statTiles.map(({label,value,icon:Icon})=><article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-500">{label}<Icon size={17} className="text-brand-navy"/></div><p className="mt-3 text-2xl font-bold text-brand-navy">{value}</p></article>)}</div>
  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
   <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4 sm:p-5">
    <label className="relative min-w-[190px] flex-1"><Search size={17} className="absolute left-3 top-3.5 text-slate-400"/><input type="search" aria-label="Buscar compra" placeholder="Buscar empresa, oferta o folio..." value={q} onChange={e=>{setQ(e.target.value);setPage(1);}} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm"/></label>
    <select aria-label="Tipo de compra" value={type} onChange={e=>{setType(e.target.value);setPage(1);}} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="todos">Todos los tipos</option><option value="plan">Planes</option><option value="promocion">Promociones</option></select>
    <select aria-label="Estado" value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="todos">Todos los estados</option>{Object.entries(estados).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select>
    <select aria-label="Periodo" value={period} onChange={e=>{setPeriod(e.target.value);setPage(1);}} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="todos">Todos los periodos</option><option value="actual">Mes actual</option><option value="anterior">Mes anterior</option><option value="30dias">Últimos 30 días</option></select>
   </div>
   <div className="overflow-x-auto"><table className="conectu-table w-full min-w-[760px] border-collapse text-left text-xs">
    <thead className="border-b border-slate-200 bg-[#f6f7fd] text-[11px] font-bold uppercase tracking-wide text-slate-600"><tr>{admin&&<th className="px-5 py-3.5">Empresa</th>}<th className="px-5 py-3.5">Concepto / Folio</th><th className="px-3 py-3.5">Fecha</th><th className="px-3 py-3.5 text-right">Importe</th><th className="px-3 py-3.5">Estado</th><th className="px-5 py-3.5">Medio de pago</th></tr></thead>
    <tbody className="divide-y divide-slate-100">{visible.map(r=><tr key={r.id} className="hover:bg-slate-50">{admin&&<td className="px-5 py-4 font-semibold text-brand-navy">{r.empresa_nombre||'—'}</td>}<td className="px-5 py-4"><p className="font-bold text-brand-navy">{concepto(r)}</p><p className="mt-1 text-[11px] text-slate-500">{r.folio}{r.oferta_titulo?` · ${r.oferta_titulo}`:''}</p></td><td className="px-3 py-4 text-slate-600">{fecha(r.created_at)}</td><td className="px-3 py-4 text-right font-bold text-brand-navy">{peso(r.monto_centavos)}</td><td className="px-3 py-4"><Pill status={r.estatus}/></td><td className="px-5 py-4 text-slate-600"><CreditCard size={14} className="mr-2 inline"/>{r.proveedor==='stripe'?'Stripe Checkout (tarjeta)':r.proveedor||'No especificado'}</td></tr>)}</tbody>
   </table>{!filtered.length&&<div className="p-10 text-center text-sm text-slate-500">No hay compras registradas con esos filtros.</div>}</div>
   <TablePagination page={currentPage} pages={pages} onChange={setPage} total={filtered.length} pageSize={pageSize} onPageSizeChange={v=>{setPageSize(v);setPage(1);}} label="compras"/>
  </section>
  <p className="mt-4 text-xs text-slate-500">Los registros reflejan el estado confirmado por Stripe. Este historial no sustituye una factura fiscal CFDI.</p>
 </>;
}
