'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';
import {ArrowRight, BadgeCheck, BriefcaseBusiness, CreditCard, Gift, Loader2, Megaphone, ShieldCheck} from 'lucide-react';

const API='/api/empresa/checkout';
const money=(centavos)=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(centavos||0)/100);
function useCatalogo(){
 const [data,setData]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const reload=useCallback(async()=>{
  setLoading(true);setError('');
  try {const response=await fetch(API,{cache:'no-store'}),body=await response.json();
   if(!response.ok||!body.ok)throw new Error(body.message||'No se pudo consultar el catálogo.');
   setData(body);
  }catch(e){setError(e.message||'No fue posible consultar los planes.');}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{reload();},[reload]);
 return {data,loading,error,reload};
}
function LoadingState({loading,error,retry}){
 if(loading)return <p role="status" className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500"><Loader2 size={17} className="animate-spin"/>Consultando condiciones del plan...</p>;
 if(error)return <p role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error} <button type="button" onClick={retry} className="font-bold underline">Reintentar</button></p>;
 return null;
}
function useCheckout(){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function checkout(input){
  if(busy)return;
  setBusy(true);setError('');
  try{
   const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
   const body=await response.json();if(!response.ok||!body.ok)throw new Error(body.message||'No fue posible iniciar el pago.');
   if(!/^https:\/\/checkout\.stripe\.com\//.test(body.url||''))throw new Error('Stripe devolvió una URL inesperada.');
   window.location.assign(body.url);
  }catch(e){setError(e.message||'No se pudo iniciar Stripe Checkout.');setBusy(false);}
 }
 return {busy,error,checkout};
}
export function StripeCurrentPlan(){
 const {data,loading,error,reload}=useCatalogo();
 const current=data?.actual;const free=data?.planes?.find(x=>x.nombre==='Gratuito');
 const plan=current||{plan:'Gratuito',limite_ofertas_activas:free?.limite_ofertas_activas||10,promociones_incluidas:0,promociones_usadas:0};
 const published=data?.ofertasActivas||0;
 return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#102a4b] px-5 py-5 text-white sm:px-7">
   <div><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#ead29a]"><BadgeCheck size={14}/>Plan actual</span><h2 className="mt-3 text-2xl font-bold">{plan.plan}</h2><p className="mt-1 text-sm text-slate-200">Duración 30 días · Renovación manual</p></div>
   <div className="text-right text-sm font-semibold">{current?.fecha_fin ? `Vigente hasta ${current.fecha_fin.slice(0,10)}`:'Acceso Gratuito'}<p className="mt-1 text-xs font-normal text-slate-200">Solo pagos confirmados</p></div>
  </div>
  <div className="p-5 sm:p-7"><LoadingState loading={loading} error={error} retry={reload}/>{data&&<>
   <div className="flex flex-wrap justify-between gap-2 text-sm"><span className="font-semibold text-brand-navy">Capacidad de ofertas activas</span><strong className="text-brand-navy">{published} de {plan.limite_ofertas_activas ?? '∞'}</strong></div>
   {plan.limite_ofertas_activas!=null&&<div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#c7a253]" style={{width:`${Math.min(100,100*published/Math.max(1,plan.limite_ofertas_activas))}%`}}/></div>}
   <p className="mt-4 text-xs text-slate-600">Promociones incluidas: {plan.promociones_usadas||0} usadas de {plan.promociones_incluidas||0}. Los beneficios se activan al elegir una oferta válida.</p>
  </>}</div>
 </section>;
}
export function StripePlanSection(){
 const {data,loading,error,reload}=useCatalogo();const payment=useCheckout();
 const tienePlanVigente=!!data?.planPagado;
 const puedeMejorar=tienePlanVigente && data.planes.some(p=>p.puedeContratar);
 function comprar(plan){
  if(!plan.puedeContratar)return;
  payment.checkout({tipo:'plan',planId:plan.id});
 }
 return <section aria-label="Planes disponibles" className="space-y-4">
  <div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf1fb] text-brand-navy"><CreditCard size={19}/></span><div><h2 className="text-lg font-bold text-brand-navy">Contratar o renovar un plan</h2><p className="mt-1 text-sm text-slate-500">Pagos de prueba con Stripe. Periodos de 30 días, sin renovación automática.</p></div></div>
  <LoadingState loading={loading} error={error} retry={reload}/>
  {data&&<div className="grid gap-4 lg:grid-cols-3">
   {data.planes.map(plan=><article key={plan.id} className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm ${data.actual?.plan===plan.nombre||(!data.actual&&plan.precio_centavos===0)?'border-[#cfac58]':'border-slate-200'}`}>
    <div className="flex items-center justify-between gap-2"><h3 className="text-lg font-bold text-brand-navy">{plan.nombre}</h3>{(data.actual?.plan===plan.nombre||(!data.actual&&plan.precio_centavos===0))&&<span className="rounded-full bg-brand-gold-soft px-3 py-1 text-xs font-bold text-[#725415]">Plan actual</span>}</div>
    <p className="mt-4 text-3xl font-extrabold text-brand-navy">{money(plan.precio_centavos)} <span className="text-xs font-medium text-slate-500">/ 30 días</span></p>
    <div className="mt-5 flex-1 space-y-3 text-sm text-slate-600"><p><BriefcaseBusiness size={16} className="mr-2 inline text-[#a98131]"/>{plan.limite_ofertas_activas == null ? 'Ofertas activas sin límite numérico' : `${plan.limite_ofertas_activas} ofertas activas`}</p><p><Gift size={16} className="mr-2 inline text-[#a98131]"/>{plan.promociones_incluidas} promociones incluidas de {plan.dias_promocion_incluida} días</p><p><ShieldCheck size={16} className="mr-2 inline text-[#a98131]"/>Gestión de postulaciones y estadísticas</p></div>
    {plan.precio_centavos>0?<button type="button" onClick={()=>comprar(plan)} disabled={payment.busy || !plan.puedeContratar} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white disabled:opacity-50">{!plan.puedeContratar?(data.planPagado?.nombre===plan.nombre?'Plan actual':'No disponible'):(tienePlanVigente?'Cambiar a Premium':'Contratar plan')}<ArrowRight size={16}/></button>:<p className="mt-6 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500">Acceso gratuito cuando no hay plan de pago vigente.</p>}
   </article>)}
  </div>}
  {tienePlanVigente && <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Tienes el plan <strong>{data.planPagado.nombre}</strong> vigente hasta el {String(data.planPagado.fecha_fin).slice(0,10)}. {puedeMejorar?'Puedes cambiar a Premium ahora. Se cobrará su precio completo y comenzará un nuevo periodo de 30 días al confirmar el pago; los cupos sin usar del Básico no se acumulan. Las promociones ya activadas conservan su vigencia.':'Cuando finalice podrás contratar otro plan.'}</p>}
  {payment.error&&<p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{payment.error}</p>}
  <p className="text-xs text-slate-500">Los planes duran 30 días y no se renuevan automáticamente. Durante la vigencia de Básico solo puedes cambiar a Premium. Con Premium vigente no puedes contratar ni renovar otro plan.</p>
 </section>;
}
export function StripeAdditionalPromotion(){
 const {data,loading,error,reload}=useCatalogo();const payment=useCheckout();
 const [tarifaId,setTarifaId]=useState(''),[ofertaId,setOfertaId]=useState('');
 const tarifa=data?.tarifas?.find(t=>String(t.id)===tarifaId);
 const limite=tarifa?.duracion_maxima_dias||0;
 const eligible=useMemo(()=>{
  if(!data||!limite)return [];
  const d=new Date();d.setUTCDate(d.getUTCDate()+limite+1);
  const minDate=d.toISOString().slice(0,10);
  return data.ofertas.filter(o=>o.estado==='publicada'&&!o.ocupada&&o.fecha_vencimiento>=minDate);
 },[data,limite]);
 function comprar(){
  const offer=eligible.find(o=>String(o.id)===ofertaId);
  if(!tarifa||!offer)return;
  payment.checkout({tipo:'promocion',tarifaId:tarifa.id,ofertaId:offer.id});
 }
 return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
  <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf1fb] text-brand-navy"><Megaphone size={19}/></span><div><h2 className="text-base font-bold text-brand-navy sm:text-lg">Comprar promoción adicional</h2><p className="mt-1 text-sm leading-6 text-slate-500">Elige duración y oferta antes de continuar a Stripe.</p></div></div>
  <LoadingState loading={loading} error={error} retry={reload}/>
  {data&&<>
   <div className="mt-5 grid grid-cols-3 gap-2">{data.tarifas.map(rate=><button type="button" key={rate.id} onClick={()=>{setTarifaId(String(rate.id));setOfertaId('');}} className={`rounded-xl border p-3 text-center ${tarifaId===String(rate.id)?'border-brand-navy bg-[#edf1fb] ring-1 ring-brand-navy/10':'border-slate-200 bg-[#f7f9fc]'}`}><strong className="block text-sm text-brand-navy">{rate.duracion_maxima_dias} días</strong><span className="mt-1 block text-xs text-slate-600">{money(rate.costo_centavos)}</span></button>)}</div>
   <label htmlFor="stripe-promo-offer" className="mt-5 block text-sm font-semibold text-brand-navy">Oferta que deseas promocionar</label>
   <select id="stripe-promo-offer" value={ofertaId} onChange={e=>setOfertaId(e.target.value)} disabled={!tarifa||payment.busy} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-brand-navy"><option value="">Selecciona una oferta válida</option>{eligible.map(offer=><option key={offer.id} value={offer.id}>{offer.titulo}</option>)}</select>
   {tarifa&&!eligible.length&&<p className="mt-2 text-xs text-amber-800">No hay ofertas elegibles: deben estar publicadas, sin promoción activa o pendiente, y tener más de {limite} días de vigencia.</p>}
   <button type="button" disabled={!tarifa||!ofertaId||payment.busy} onClick={comprar} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white disabled:opacity-50">{payment.busy?'Conectando con Stripe...':'Continuar a Stripe Checkout'}<ArrowRight size={16}/></button>
   {payment.error&&<p role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{payment.error}</p>}
  </>}
  <p className="mt-4 text-xs leading-5 text-slate-500">Las promociones adicionales no consumen activaciones del plan y solo se activan tras confirmación del pago.</p>
 </article>;
}

// Compatibilidad temporal con una vista instalada anteriormente.
// El retorno de Stripe ya no muestra avisos persistentes.
export function StripeCheckoutReturnNotice(){return null;}
