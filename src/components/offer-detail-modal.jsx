"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, FileText, GraduationCap, Laptop, MapPin, Sparkles, X } from "lucide-react";
import { OFFER_TYPE_OPTIONS as typeOptions, OFFER_TYPE_LABELS } from "@/lib/offer-types";

export function toOfferDetail(o) { return {
    id:o.id,title:o.titulo,company:o.empresa_nombre,
    companyDescription:o.empresa_descripcion||'',type:OFFER_TYPE_LABELS[o.tipo]||o.tipo,
    mode:({presencial:'Presencial',hibrida:'Híbrida',remota:'Remota'})[o.modalidad]||o.modalidad,
    location:o.ciudad||'Por definir',axis:o.eje_nombre||'Sin eje de acción',
    description:o.descripcion||'',skills:o.habilidades||[],promoted:!!o.promocionada,
    plazas:o.plazas,creditos:o.creditos_minimos,apoyo:o.compensacion,
    vencimiento:o.fecha_vencimiento,docs:o.adjuntos||[],
  }; }

export function OfferModal({ offer, onClose, dashboardHref = null, canApply = false, alreadyApplied = false, onApply, applicationDetails = null, applicationFooter = null }) {
  const [note,setNote]=useState('');
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  async function submitApplication(){
    setSaving(true);setError('');
    try{await onApply(offer.id,note);}
    catch(err){setError(err.message||'No pudimos enviar tu postulación.');}
    finally{setSaving(false);}
  }
  const closeRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')];
        if (!focusable.length) return;
        if (event.shiftKey && document.activeElement === focusable[0]) {
          event.preventDefault();
          focusable[focusable.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
          event.preventDefault();
          focusable[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-[3px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="offer-modal-title" aria-describedby="offer-modal-description" className="flex max-h-[96dvh] w-full max-w-[860px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[91dvh] sm:rounded-3xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-navy text-white sm:grid"><BriefcaseBusiness size={23} aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500">{offer.company}</p>
              <h2 id="offer-modal-title" className="mt-1 text-lg font-extrabold leading-tight tracking-[-.025em] text-brand-navy sm:text-2xl">{offer.title}</h2>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-600"><span className="inline-flex items-center gap-1"><MapPin size={14} aria-hidden="true" /> {offer.location}</span><span className="inline-flex items-center gap-1"><Laptop size={14} aria-hidden="true" /> {offer.mode}</span></p>
            </div>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Cerrar detalle" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-600 hover:bg-slate-100"><X size={21} aria-hidden="true" /></button>
        </div>

        <div className="ui-modal-scroll min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-contain px-5 py-5 sm:px-7 sm:py-6" style={{ WebkitOverflowScrolling: "touch" }}>
          <p id="offer-modal-description" className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">{applicationDetails ? "Consulta los datos actuales de la oferta a la que te postulaste. La aprobación no constituye un aval de la UNAM." : "Oferta publicada en ConectU por una empresa aprobada. La aprobación no constituye un aval de la UNAM."}</p>
          {applicationDetails}
          <section className="mt-6"><h3 className="text-base font-extrabold text-brand-navy">Acerca de la oportunidad</h3><p className="mt-3 text-sm leading-7 text-slate-600">{offer.description}</p></section>
          <section className="mt-7"><h3 className="flex items-center gap-2 text-base font-extrabold text-brand-navy"><GraduationCap size={19} className="text-brand-gold-dark" aria-hidden="true" /> Información general</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <InfoTile icon={BriefcaseBusiness} label="Tipo de oportunidad" value={typeOptions.find((option) => option.value === offer.type)?.label || offer.type} />
              <InfoTile icon={Laptop} label="Modalidad" value={offer.mode} />
              <InfoTile icon={MapPin} label="Ubicación" value={offer.location} />
              <InfoTile icon={Sparkles} label="Eje de acción" value={offer.axis} />
            </div>
          </section>
          <section className="mt-7" aria-labelledby="informacion-empresa-titulo">
            <h3 id="informacion-empresa-titulo" className="flex items-center gap-2 text-base font-extrabold text-brand-navy"><Building2 size={19} className="text-brand-gold-dark" aria-hidden="true" /> Información de la empresa</h3>
            <div className="mt-3 flex items-start gap-4 rounded-xl border border-slate-200 bg-[#f8fafd] p-4 sm:p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-navy text-white"><Building2 size={23} aria-hidden="true" /></span>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-brand-navy">{offer.company}</p>
                <p className="mt-1 text-xs leading-6 text-slate-600">{offer.companyDescription || (applicationDetails ? 'Sin descripción registrada.' : 'Empresa registrada y aprobada por ConectU.')}</p>
              </div>
            </div>
          </section>
          <section className="mt-7"><h3 className="text-base font-extrabold text-brand-navy">Habilidades y herramientas</h3><div className="mt-3 flex flex-wrap gap-2">{!offer.skills.length && <p className="text-sm text-slate-500">No hay habilidades especificadas.</p>}{offer.skills.map((skill) => <span key={skill} className="rounded-xl bg-[#eef2fb] px-3 py-2 text-xs font-bold text-brand-navy">{skill}</span>)}</div></section>
          <section className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="flex items-center gap-2 text-sm font-extrabold text-brand-navy"><GraduationCap size={17} aria-hidden="true" /> Requisitos y plazas</h3><p className="mt-2 text-xs leading-6 text-slate-500">{offer.plazas} plazas {applicationDetails ? "registradas" : "disponibles"}. {offer.creditos ? `Créditos mínimos: ${offer.creditos}%.` : ''} {offer.apoyo ? `Apoyo económico: ${offer.apoyo} MXN.` : ''} Vencimiento: {offer.vencimiento}.</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="flex items-center gap-2 text-sm font-extrabold text-brand-navy"><FileText size={17} aria-hidden="true" /> Documentos adjuntos</h3><p className="mt-2 text-xs leading-6 text-slate-500">{offer.docs.length ? offer.docs.map(doc=><a key={doc.id} target="_blank" rel="noreferrer" href={`/api/ofertas/${offer.id}/archivos/${doc.id}`} className="mt-2 block text-brand-navy underline">{doc.name}</a>) : (applicationDetails ? 'No hay documentos adjuntos disponibles para consulta.' : 'No hay documentos adjuntos.')}</p></div>
          </section>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-[#f5f7fc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <span className="hidden items-center gap-2 text-xs text-slate-500 sm:inline-flex"><Clock3 size={16} aria-hidden="true" /> ConectU · {applicationDetails ? "Detalle de postulación" : "Oferta publicada"}</span>
          {applicationDetails ? applicationFooter : canApply ? (
            <div className="w-full space-y-2 sm:ml-auto sm:max-w-md">
              {alreadyApplied ? <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold text-emerald-800">Ya te postulaste a esta oferta.</span><Link href="/estudiante/postulaciones" className="font-semibold text-brand-navy underline">Mis postulaciones</Link></div> : <>
                <label htmlFor="mensaje-postulacion" className="block text-xs font-semibold text-slate-600">Mensaje para la empresa (opcional)</label>
                <textarea id="mensaje-postulacion" rows={2} maxLength={1200} value={note} onChange={e=>setNote(e.target.value)} className="ui-control w-full resize-y" placeholder="Escribe una presentación breve…"/>
                <button type="button" onClick={submitApplication} disabled={saving} className="ui-button-primary w-full justify-center disabled:opacity-50">{saving?'Enviando…':'Enviar postulación'} <ArrowRight size={17}/></button>
              </>}
              {error&&<p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}
            </div>
          ) : <Link href={dashboardHref || "/ingresar"} className="ui-button-primary text-center sm:ml-auto">{dashboardHref ? "Volver a mi resumen" : "Iniciar sesión para postularme"} <ArrowRight size={17} aria-hidden="true" /></Link>}
        </div>
      </section>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return <div className="flex items-start gap-3 rounded-xl bg-[#f2f4fb] p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-brand-gold-dark"><Icon size={17} aria-hidden="true" /></span><div className="min-w-0"><p className="text-[.7rem] font-bold uppercase tracking-[.08em] text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-extrabold text-brand-navy">{value}</p></div></div>;
}
