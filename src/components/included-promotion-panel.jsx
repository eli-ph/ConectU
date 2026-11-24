'use client';

import { useCallback, useEffect, useState } from 'react';
import { Gift, Loader2, Megaphone, Sparkles } from 'lucide-react';

const ENDPOINT='/api/empresa/promociones-incluidas';
const EVENT='conectu:promocion-incluida-activada';

function useIncludedPromotions() {
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const reload=useCallback(async () => {
    setLoading(true);setError('');
    try {
      const response=await fetch(ENDPOINT,{cache:'no-store'});
      const body=await response.json();
      if (!response.ok||!body.ok) throw new Error(body.message||'No fue posible consultar tus promociones.');
      setData(body);
    }catch(e){setError(e.message||'No fue posible consultar tus promociones.');}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{reload();},[reload]);
  useEffect(()=>{
    window.addEventListener(EVENT,reload);
    return ()=>window.removeEventListener(EVENT,reload);
  },[reload]);
  return {data,loading,error,reload};
}

function Info({value,label}){
  return <div className="min-w-[110px] flex-1 rounded-xl bg-[#f7f9fc] p-4"><strong className="block text-2xl text-brand-navy">{value}</strong><span className="text-xs text-slate-500">{label}</span></div>;
}

/** Sustituye exclusivamente el artículo 'Mis promociones' demostrativo. */
export function IncludedPromotionsOverview() {
  const {data,loading,error,reload}=useIncludedPromotions();
  const activas=(data?.promociones||[]).filter(p=>p.estado_visible==='en_uso').length;
  const usadas=data?.usadas??0;
  const disponibles=data?.disponibles??0;
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf1fb] text-brand-navy"><Megaphone size={19}/></span><div><h2 className="text-base font-bold text-brand-navy sm:text-lg">Mis promociones</h2><p className="mt-1 text-sm leading-6 text-slate-500">Promociones registradas directamente para tus ofertas.</p></div></div>
    {loading && <p role="status" className="mt-5 flex items-center gap-2 text-sm text-slate-500"><Loader2 size={16} className="animate-spin"/> Consultando promociones...</p>}
    {error && <div role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error} <button type="button" onClick={reload} className="ml-2 underline">Reintentar</button></div>}
    {data && <>
      <div className="mt-5 flex flex-wrap gap-3"><Info value={activas} label="En uso"/><Info value={usadas} label="Incluidas utilizadas"/><Info value={disponibles} label="Activaciones disponibles"/></div>
      <div className="mt-5 space-y-2">{data.promociones.slice(0,5).map(p=><div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"><div className="min-w-0"><p className="text-sm font-semibold text-brand-navy">{p.titulo}</p><p className="mt-1 text-xs text-slate-500">{p.dias} días · {p.origen==='incluida'?'Incluida en el plan':'Adicional'} · Hasta {p.fecha_fin}</p></div><span className="inline-flex items-center gap-1 rounded-full bg-[#fff3d6] px-3 py-1 text-xs font-semibold text-[#846013]"><Sparkles size={13}/>{p.estado_visible==='en_uso'?'En uso':p.estado_visible==='vencida'?'Vencida':p.estado_visible==='cancelada'?'Cancelada':p.estado_visible}</span></div>)}
        {!data.promociones.length && <p className="rounded-xl bg-[#f7f9fc] px-4 py-5 text-sm text-slate-500">Todavía no has activado promociones.</p>}
      </div>
    </>}
  </article>;
}

/** Sustituye únicamente 'Utilizar una promoción incluida'; no cambia compras ni planes. */
export function IncludedPromotionsActivation() {
  const {data,loading,error,reload}=useIncludedPromotions();
  const [ofertaId,setOfertaId]=useState('');
  const [sending,setSending]=useState(false);
  const [feedback,setFeedback]=useState('');
  const [actionError,setActionError]=useState('');
  const ofertas=data?.ofertas||[];
  const habilitadas=ofertas.filter(o=>!!o.elegible);
  async function activar(){
    if(!ofertaId||sending)return;
    if(!window.confirm('¿Activar una promoción incluida para esta oferta? Se descontará una activación de tu plan.'))return;
    setSending(true);setFeedback('');setActionError('');
    try {
      const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ofertaId:Number(ofertaId)})});
      const result=await response.json();
      if(!response.ok||!result.ok)throw new Error(result.message||'No se pudo activar la promoción.');
      setFeedback('Promoción activada correctamente. Ya está vinculada a la oferta seleccionada.');
      setOfertaId('');
      window.dispatchEvent(new Event(EVENT));
      reload();
    }catch(e){setActionError(e.message||'No fue posible activar la promoción.');}
    finally{setSending(false);}
  }
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf1fb] text-brand-navy"><Gift size={19}/></span><div><h2 className="text-base font-bold text-brand-navy sm:text-lg">Utilizar una promoción incluida</h2><p className="mt-1 text-sm leading-6 text-slate-500">Selecciona la oferta que deseas promocionar.</p></div></div><span className="rounded-full bg-[#eef1fb] px-3 py-1.5 text-xs font-bold text-brand-navy">{data?`${data.disponibles} disponibles de ${data.incluidas}`:'Cargando…'}</span></div>
    {loading && <p role="status" className="mt-4 flex items-center gap-2 text-sm text-slate-500"><Loader2 size={16} className="animate-spin"/> Revisando beneficios del plan...</p>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error} <button type="button" onClick={reload} className="ml-2 underline">Reintentar</button></p>}
    {data && <>
      <div className="mt-5 rounded-xl bg-[#f7f9fc] px-4 py-4 text-sm leading-6 text-slate-600"><p className="font-semibold text-brand-navy">{data.dias} días de prioridad en búsquedas relevantes</p><p className="mt-1">La activación se consume al utilizarla; no se crean promociones sin oferta. Las que no utilices vencen junto con tu suscripción.</p></div>
      <label className="mt-4 block text-sm font-semibold text-brand-navy" htmlFor="promotion-included-offer">Oferta a promocionar</label>
      <select id="promotion-included-offer" value={ofertaId} onChange={e=>{setOfertaId(e.target.value);setActionError('');setFeedback('');}} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-brand-navy" disabled={data.disponibles===0||sending}>
        <option value="">Selecciona una oferta vigente</option>
        {ofertas.map(o=><option key={o.id} value={o.id} disabled={!o.elegible}>{o.titulo}{!o.elegible?` — ${o.motivo}`:''}</option>)}
      </select>
      {data.disponibles>0&&!habilitadas.length&&<p className="mt-2 text-xs text-amber-800">No hay ofertas elegibles. Necesitas una oferta publicada con al menos {data.dias} días de vigencia y sin promoción activa.</p>}
      {data.disponibles===0&&<p className="mt-2 text-xs text-slate-500">No tienes activaciones incluidas disponibles en tu plan actual.</p>}
      <button type="button" disabled={sending||data.disponibles<=0||!ofertaId} onClick={activar} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white transition hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:bg-slate-300"><Sparkles size={17}/>{sending?'Activando…':'Activar promoción incluida'}</button>
      {feedback&&<p role="status" className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{feedback}</p>}
      {actionError&&<p role="alert" className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{actionError}</p>}
    </>}
  </article>;
}
