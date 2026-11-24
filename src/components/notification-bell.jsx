"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bell, CheckCheck, Loader2, X } from 'lucide-react';

/** Componente compartido: sin datos de demostración y sin SQL en React. */
export function NotificationBell({open,onToggle,onClose}) {
  const [notificaciones,setNotificaciones]=useState([]);
  const [noLeidas,setNoLeidas]=useState(0);
  const [filtro,setFiltro]=useState('todas');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const abierta=useRef(false);
  const solicitando=useRef(false);
  const cargar=useCallback(async({silent=false}={})=>{
    // Ignorar peticiones solapadas durante navegación y Fast Refresh.
    if(solicitando.current)return;
    solicitando.current=true;
    if(!silent)setLoading(true);
    try {
      const response=await fetch('/api/notificaciones',{cache:'no-store'});
      const data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.message||'No pudimos cargar las notificaciones.');
      setNotificaciones(data.items||[]);
      setNoLeidas(data.noLeidas||0);
      setError('');
      // Leer solo al abrir el panel; GET sigue siendo de solo lectura.
      if(abierta.current && data.noLeidas>0){
        const marked=await fetch('/api/notificaciones',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({todas:true})});
        const result=await marked.json();
        if(!marked.ok||!result.ok)throw new Error(result.message||'No pudimos marcar los avisos como vistos.');
        // Reconsultar el contador real, incluso si llegó otro aviso durante PATCH.
        const fresh=await fetch('/api/notificaciones',{cache:'no-store'});
        const snapshot=await fresh.json();
        if(!fresh.ok||!snapshot.ok)throw new Error(snapshot.message||'No pudimos actualizar los avisos.');
        setNotificaciones(snapshot.items||[]);
        setNoLeidas(snapshot.noLeidas||0);
      }
    }catch(e){if(!silent||abierta.current)setError(e.message||'No pudimos consultar los avisos.');}
    finally{solicitando.current=false;if(!silent)setLoading(false);}
  },[]);
  // Una sola consulta inicial y, posteriormente, actualización de baja
  // frecuencia. Solo se marcan como vistas mientras el panel está abierto.
  useEffect(()=>{cargar({silent:true});},[cargar]);
  useEffect(()=>{
    const interval=setInterval(()=>{
      if(document.visibilityState==='visible')cargar({silent:true});
    },60000);
    return ()=>clearInterval(interval);
  },[cargar]);
  useEffect(()=>{
    abierta.current=open;
    if(open){setFiltro('todas');cargar();}
  },[open,cargar]);
  const visibles=useMemo(()=>notificaciones.filter(n=>filtro==='todas'||!n.leida),[notificaciones,filtro]);

  const fecha=(value)=>{
    if(!value)return '';
    const date=new Date(String(value).replace(' ','T')+'Z');
    if(Number.isNaN(date.valueOf()))return '';
    return new Intl.DateTimeFormat('es-MX',{month:'short',day:'numeric',timeZone:'America/Mexico_City'}).format(date);
  };

  return <div className="relative">
    <button type="button" aria-label={noLeidas?`Ver notificaciones (${noLeidas} sin leer)`:'Ver notificaciones'}
      aria-expanded={open} aria-controls="popover-notificaciones" onClick={onToggle}
      className="relative grid h-11 w-11 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-brand-navy">
      <Bell size={20}/>
      {noLeidas>0&&<span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#aa7f15] px-0.5 text-[10px] font-bold leading-none text-white" aria-hidden="true">{noLeidas>9?'9+':noLeidas}</span>}
    </button>
    {open&&<section id="popover-notificaciones" role="dialog" aria-label="Notificaciones"
      className="absolute right-0 top-[58px] z-50 w-[min(390px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-raised">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4">
        <div><p className="text-sm font-bold text-brand-navy">Notificaciones</p><p className="mt-0.5 text-xs text-slate-500">Avisos de tu cuenta en ConectU</p></div>
        <button type="button" onClick={onClose} aria-label="Cerrar notificaciones" className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"><X size={18}/></button>
      </header>
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-2.5">
        <div role="group" aria-label="Filtrar notificaciones" className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {[['todas','Todas'],['no-leidas','No leídas']].map(([key,label])=><button type="button" key={key}
            aria-pressed={filtro===key} onClick={()=>setFiltro(key)} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${filtro===key?'bg-white text-brand-navy shadow-sm':'text-slate-500 hover:text-brand-navy'}`}>{label}</button>)}
        </div>
        <button type="button" disabled={loading||!noLeidas} onClick={()=>cargar()}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy disabled:text-slate-400"><CheckCheck size={14}/>Marcar leídas</button>
      </div>
      <div className="max-h-[370px] overflow-y-auto">
        {error&&<p role="alert" className="m-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error} <button type="button" onClick={()=>cargar()} className="font-semibold underline">Reintentar</button></p>}
        {loading&&!notificaciones.length?<div role="status" className="flex items-center justify-center gap-2 p-8 text-sm text-slate-500"><Loader2 className="animate-spin" size={17}/>Cargando notificaciones...</div>:
          visibles.length? <ul className="divide-y divide-slate-100">{visibles.map(n=><li key={n.id}><div
            className={`flex w-full items-start gap-3 px-4 py-3.5 text-left ${!n.leida?'bg-[#fffaf0]':'bg-white'}`}>
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.leida?'bg-transparent':'bg-[#a87b12]'}`} aria-hidden="true"/>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold leading-5 text-brand-navy">{n.titulo}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{n.mensaje}</span></span>
              <time className="shrink-0 text-[10px] text-slate-400">{fecha(n.created_at)}</time>
            </div></li>)}</ul>:
          <div className="px-5 py-9 text-center"><Bell className="mx-auto text-slate-300" size={26}/><p className="mt-3 text-sm font-semibold text-slate-700">{filtro==='todas'?'Sin notificaciones':'No tienes avisos sin leer'}</p><p className="mt-1 text-xs leading-5 text-slate-500">Aquí aparecerán los movimientos importantes de tu cuenta.</p></div>
        }
      </div>
    </section>}
  </div>;
}
