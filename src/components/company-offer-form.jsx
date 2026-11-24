"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OFFER_TYPE_LABELS } from "@/lib/offer-types";
import Link from "next/link";
import { SkillPicker } from "@/components/skill-picker";
import { ArrowRight, Award, Briefcase, Building2, Calendar, CheckCircle2, ChevronRight, Cpu, FileText, FolderOpen, GraduationCap, MapPin, Minus, Plus, Save, ShieldCheck, Sparkles, Trash2, UploadCloud } from "lucide-react";

const offerTypes = [
  {
    id: "empleo",
    title: OFFER_TYPE_LABELS.empleo,
    subtitle: "Nivel inicial",
    icon: GraduationCap,
  },
  {
    id: "internship",
    title: OFFER_TYPE_LABELS.internship,
    subtitle: "Programa formativo",
    icon: Sparkles,
  },
  {
    id: "servicio_social",
    title: OFFER_TYPE_LABELS.servicio_social,
    subtitle: "Horas oficiales",
    icon: Award,
  },
  {
    id: "practicas",
    title: OFFER_TYPE_LABELS.practicas,
    subtitle: "6 a 12 meses",
    icon: Briefcase,
  },
];

const modalities = ["Presencial", "Híbrido", "100% Remoto"];

const defaultDeadline = () => {
  const date=new Date();date.setDate(date.getDate()+30);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
};

export function CompanyOfferForm({ editing = false, availableSkills = [], availableAxes = [], initialOffer = null, capacity = null }) {
  const router=useRouter();
  const [title, setTitle] = useState(initialOffer?.titulo || "");
  const [selectedType, setSelectedType] = useState(initialOffer?.tipo || "empleo");
  const MODALITY_DB={Presencial:'presencial','Híbrido':'hibrida','100% Remoto':'remota'};
  const [modality, setModality] = useState(Object.keys(MODALITY_DB).find(k=>MODALITY_DB[k]===initialOffer?.modalidad)||'Presencial');
  const [location, setLocation] = useState(initialOffer?.ciudad || "");
  const [description, setDescription] = useState(initialOffer?.descripcion || "");
  const [axis, setAxis] = useState(initialOffer?.eje_nombre || availableAxes[0] || "");
  const [skills, setSkills] = useState(initialOffer?.habilidades || []);
  const [minCredits, setMinCredits] = useState(initialOffer?.creditos_minimos ?? 0);
  const [stipend, setStipend] = useState(initialOffer?.compensacion || "0");
  const [vacancies, setVacancies] = useState(initialOffer?.plazas ?? 1);
  const [deadline, setDeadline] = useState(initialOffer?.fecha_vencimiento || defaultDeadline());
  const [socialHours, setSocialHours] = useState(initialOffer?.horas_requeridas || "");
  const [officialKey, setOfficialKey] = useState(initialOffer?.clave_programa || "");
  const [attachments, setAttachments] = useState((initialOffer?.adjuntos || []).map(a=>({id:a.id,name:a.nombre_original,
    meta:`${(a.tamano_bytes/1048576).toFixed(1)} MB · PDF`,uploaded:true})));
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);
  const isClosed=initialOffer?.estado==='cerrada';
  const handleRemoveAttachment = async (id) => {
    const target=attachments.find(a=>a.id===id);
    if(target?.uploaded && initialOffer?.id){
      if(!window.confirm('¿Eliminar este documento de la oferta?'))return;
      const response=await fetch(`/api/empresa/ofertas/${initialOffer.id}/archivos/${id}`,{method:'DELETE'});
      if(!response.ok){setIsError(true);setStatusMessage('No fue posible eliminar el documento.');return;}
    }
    setAttachments(prev=>prev.filter(a=>a.id!==id));
  };
  const handleAddAttachment = e => {
    const file=e.target.files?.[0];e.target.value='';
    if(!file)return;
    if(attachments.length>=3||file.size>15*1024*1024||!file.name.toLowerCase().endsWith('.pdf')){
      setIsError(true);setStatusMessage('Puedes adjuntar hasta 3 PDF de máximo 15 MB cada uno.');return;
    }
    setAttachments(prev=>[...prev,{id:crypto.randomUUID(),name:file.name,meta:`${(file.size/1048576).toFixed(1)} MB · Sin subir`,file}]);
  };
  const save = async (action) => {
    if(saving)return;
    setSaving(true);setStatusMessage('');setIsError(false);
    try{
      const payload={action,title,type:selectedType,modality:MODALITY_DB[modality],location,description,
        axis,skills,minCredits,stipend,vacancies,deadline,socialHours,officialKey};
      const endpoint=initialOffer?.id?`/api/empresa/ofertas/${initialOffer.id}`:'/api/empresa/ofertas';
      const result=await fetch(endpoint,{method:initialOffer?.id?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await result.json();if(!result.ok||!data.ok)throw new Error(data.message||'No pudimos guardar la oferta.');
      const pending=attachments.filter(a=>a.file);
      for(const doc of pending){
        const form=new FormData();form.set('archivo',doc.file);
        const upload=await fetch(`/api/empresa/ofertas/${data.id}/archivos`,{method:'POST',body:form});
        const out=await upload.json();
        if(!upload.ok||!out.ok){
          setIsError(true);setStatusMessage(`La oferta se guardó, pero no se pudo subir «${doc.name}». Puedes volver a editarla para completar los documentos.`);
          router.replace(`/empresa/ofertas/${data.id}/editar`);router.refresh();return;
        }
      }
      router.push(`/empresa/ofertas?guardada=${action==='publish'?'publicada':'1'}`);
      router.refresh();
    }catch(e){setIsError(true);setStatusMessage(e.message||'No pudimos guardar la oferta.');}
    finally{setSaving(false);}
  };
  const handleDeleteOffer = async () => {
    if (!initialOffer?.id || saving) return;
    if (!window.confirm(`¿Eliminar la oferta «${initialOffer.titulo || title}»? Dejará de mostrarse y se conservará su historial de postulaciones.`)) return;
    setSaving(true);
    setIsError(false);
    setStatusMessage("");
    try {
      const response = await fetch(`/api/empresa/ofertas/${initialOffer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "eliminar" }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || "No pudimos eliminar la oferta.");
      router.replace("/empresa/ofertas?eliminada=1");
      router.refresh();
    } catch (error) {
      setIsError(true);
      setStatusMessage(error.message || "No pudimos eliminar la oferta.");
    } finally {
      setSaving(false);
    }
  };
  const handleSaveDraft=()=>save(initialOffer?.estado==='publicada'?'save':'draft');
  const handlePublish=(e)=>{e.preventDefault();save('publish');};

  return (
    <form onSubmit={handlePublish} className="space-y-5 pb-8">
      {/* Breadcrumb + Título + Badge de Borrador */}
      <div>
        <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Link href="/empresa/ofertas" className="hover:text-brand-navy">
            MIS OFERTAS
          </Link>
          <ChevronRight size={12} />
          <span className="text-brand-navy">{editing ? "EDITAR CONVOCATORIA" : "NUEVA CONVOCATORIA"}</span>
        </nav>

        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
            Publicar o editar oferta
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold-soft px-3 py-1 text-[11px] font-bold text-[#8b6600]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c99700]" />
            {initialOffer?.estado === "publicada" ? "Publicada" : "Borrador"}
          </span>
        </div>
      </div>

      {/* Tarjeta Capacidad de Cuenta */}
      <section className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:px-5">
        <div className="flex items-center gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gold-soft text-[#9e7400]">
            <Building2 size={18} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-brand-navy">
                Capacidad de Cuenta
              </h2>
              <span className="rounded-md bg-[#eeefff] px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                {capacity?.plan || "Plan empresarial"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Una oferta publicada consume{" "}
              <strong className="font-bold text-brand-navy">
                1 cupo de oferta activa
              </strong>{" "}
              • Cada oferta puede tener varias plazas
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#f5c22b]/50 bg-[#fffdf4] px-3.5 py-1.5 text-xs font-bold text-[#8b6600]">
          <span className="h-2 w-2 rounded-full bg-[#e6b31e]" />{capacity?.limite==null ? "Sin límite de ofertas" : `${Math.max(0,capacity.limite-capacity.activas)} cupos disponibles`}
        </span>
      </section>

      {/* 1. Información General y Modalidad */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#eeefff] text-brand-navy">
              <FileText size={16} />
            </span>
            <div>
              <h2 className="text-base font-bold text-brand-navy">
                1. Información General y Modalidad
              </h2>
              <p className="text-xs text-slate-500">
                Detalles esenciales de la posición de vinculación industrial.
              </p>
            </div>
          </div>

          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Obligatorio
          </span>
        </div>

        <div className="space-y-5">
          {/* Título del puesto */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              TÍTULO DEL PUESTO O PROYECTO TÉCNICO *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-brand-navy"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Utiliza un título claro y descriptivo para que los estudiantes encuentren tu oferta.
            </p>
          </div>

          {/* Tipo de convocatoria */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              TIPO DE CONVOCATORIA *
            </label>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {offerTypes.map((item) => {
                const Icon = item.icon;
                const active = selectedType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedType(item.id)}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                      active
                        ? "border-brand-navy bg-brand-navy text-white shadow-xs"
                        : "border-slate-200 bg-white text-brand-navy hover:border-slate-300"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                        active
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-brand-navy"
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    <div>
                      <p className="text-xs font-bold sm:text-sm">{item.title}</p>
                      <p
                        className={`mt-0.5 text-[11px] ${
                          active ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modalidad operativa y Sede */}
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                MODALIDAD OPERATIVA *
              </label>
              <div className="grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-1">
                {modalities.map((mod) => {
                  const active = modality === mod;
                  return (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => setModality(mod)}
                      className={`rounded-lg py-2 text-xs font-semibold transition ${
                        active
                          ? "bg-brand-navy text-white shadow-2xs"
                          : "text-slate-600 hover:text-brand-navy"
                      }`}
                    >
                      {mod}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                SEDE DE PLANTA O LABORATORIO *
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus-within:border-brand-navy">
                <MapPin size={16} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Descripción del rol */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                DESCRIPCIÓN DEL ROL Y ACTIVIDADES TÉCNICAS *
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                Soporta Markdown
              </span>
            </div>
            <textarea
              rows={6}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs leading-6 text-slate-700 outline-none transition focus:border-brand-navy sm:text-sm"
            />
          </div>
        </div>
      </section>

      {/* 2. Perfil Académico y Habilidades */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#eeefff] text-brand-navy">
              <GraduationCap size={16} />
            </span>
            <div>
              <h2 className="text-base font-bold text-brand-navy">
                2. Perfil Académico y Habilidades
              </h2>
              <p className="text-xs text-slate-500">
                Filtro técnico para vinculación con facultades e institutos
                tecnológicos.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
            <Cpu size={12} />
            Criterios de perfil
          </span>
        </div>

        <div className="space-y-5">
          {/* Eje de acción */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              EJE DE ACCIÓN *
            </label>
            <select
              value={axis}
              onChange={(e) => setAxis(e.target.value)}
              className="select-chevron w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-brand-navy sm:text-sm"
            >
              {availableAxes.map((name)=><option key={name} value={name}>{name}</option>)}
              {/* El catálogo de ejes se consulta desde SQLite; no se usan opciones fijas. */}
              {/*
              <option value="Tecnologías de la Información y Software">
                Tecnologías de la Información y Software
              </option>
              <option value="Sistemas Embebidos, IoT y Automatización">
                Sistemas Embebidos, IoT y Automatización
              </option>
              <option value="Ciencia de Datos e Inteligencia Artificial">
                Ciencia de Datos e Inteligencia Artificial
              </option>
              <option value="Manufactura Avanzada y Procesos">
                Manufactura Avanzada y Procesos
              </option> */}
            </select>
          </div>

          {/* Selector compartido con el catálogo: búsqueda arriba y etiquetas debajo. */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">HERRAMIENTAS Y TECNOLOGÍAS REQUERIDAS</h3>
            <SkillPicker skills={skills} onChange={setSkills} suggestions={availableSkills} allowCustom={false} label="Busca las tecnologías que requiere esta oferta" />
          </div>

          {/* Créditos mínimos requeridos */}
          <div className="max-w-sm">
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              CRÉDITOS MÍNIMOS REQUERIDOS (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={minCredits}
              onChange={(e) => setMinCredits(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-brand-navy"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Porcentaje curricular mínimo acreditado ante la facultad (0 a 100%).
            </p>
          </div>
        </div>
      </section>

      {/* 3. Esquema de Compensación y Servicio Social */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#eeefff] text-brand-navy">
            <Award size={16} />
          </span>
          <div>
            <h2 className="text-base font-bold text-brand-navy">
              3. Esquema de Compensación y Servicio Social
            </h2>
            <p className="text-xs text-slate-500">
              Indica el apoyo económico y, cuando corresponda, los requisitos del programa.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Apoyo económico */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              APOYO ECONÓMICO / BECA (MXN / MES) *
            </label>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus-within:border-brand-navy">
              <div className="flex flex-1 items-center gap-2">
                <span className="text-sm font-bold text-slate-400">$</span>
                <input
                  type="text"
                  required
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-brand-navy outline-none"
                />
              </div>
              <span className="text-xs font-bold text-slate-400">MXN</span>
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
              Importe informativo indicado por la empresa
            </p>
          </div>

          {/* Número de plazas vacantes */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              NÚMERO DE PLAZAS VACANTES *
            </label>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2">
              <button
                type="button"
                onClick={() => setVacancies((v) => Math.max(1, v - 1))}
                aria-label="Disminuir plazas"
                className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-brand-navy"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold text-brand-navy">
                {vacancies}
              </span>
              <button
                type="button"
                onClick={() => setVacancies((v) => v + 1)}
                aria-label="Aumentar plazas"
                className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-brand-navy"
              >
                <Plus size={14} />
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Plazas disponibles en esta oferta.
            </p>
          </div>
        </div>

        {/* Fecha de vencimiento */}
        <div className="mt-5 max-w-md">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            FECHA DE VENCIMIENTO DE LA CONVOCATORIA *
          </label>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus-within:border-brand-navy">
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none"
            />
            <Calendar size={16} className="shrink-0 text-slate-400" />
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
            <CheckCircle2 size={13} className="shrink-0 text-slate-400" />
            Máximo 2 meses a partir de la publicación.
          </p>
        </div>

        {/* Datos aplicables solo a prácticas y servicio social. */}
        {(selectedType === "practicas" || selectedType === "servicio_social") && <div className="mt-6 rounded-2xl border border-indigo-100 bg-[#f7f8ff] p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-700" />
              <h3 className="text-xs font-bold text-brand-navy sm:text-sm">
                Datos de prácticas profesionales / servicio social
              </h3>
            </div>
            <span className="rounded-md bg-[#e6e8ff] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800">
              Según la convocatoria
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                TOTAL DE HORAS REQUERIDAS
              </label>
              <input
                type="text"
                value={socialHours}
                onChange={(e) => setSocialHours(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-brand-navy"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                CLAVE DEL PROGRAMA (SI APLICA)
              </label>
              <input
                type="text"
                value={officialKey}
                onChange={(e) => setOfficialKey(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-brand-navy"
              />
            </div>
          </div>
        </div>}
      </section>

      {/* 4. Documentación Oficial y Anexos Técnicos */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#eeefff] text-brand-navy">
              <FolderOpen size={16} />
            </span>
            <div>
              <h2 className="text-base font-bold text-brand-navy">
                4. Documentación Oficial y Anexos Técnicos
              </h2>
              <p className="text-xs text-slate-500">
                Archivos PDF con especificaciones del proyecto y rúbricas (máximo 3
                archivos).
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-brand-navy">
            {attachments.length} de 3 Slots Utilizados
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {attachments.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/40 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">
                    <FileText size={17} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-brand-navy">
                      {doc.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {doc.meta}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(doc.id)}
                  aria-label={`Eliminar ${doc.name}`}
                  className="text-slate-400 transition hover:text-rose-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px]">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  {doc.uploaded ? "Guardado" : "Por subir"}
                </span>
                {doc.uploaded && initialOffer?.id && <a
                  href={`/api/empresa/ofertas/${initialOffer.id}/archivos/${doc.id}`}
                  target="_blank" rel="noreferrer"
                  className="font-bold text-indigo-700 hover:underline"
                >Ver PDF</a>}
              </div>
            </div>
          ))}

          {attachments.length < 3 && (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 text-center transition hover:border-brand-navy hover:bg-slate-50">
              <UploadCloud size={20} className="text-slate-400" />
              <p className="mt-2 text-xs font-bold text-brand-navy">
                Adjuntar PDF ({attachments.length + 1} de 3)
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Selecciona un documento PDF
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">Hasta 15 MB</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleAddAttachment}
                className="sr-only"
              />
            </label>
          )}
        </div>
      </section>

      {statusMessage && (
        <div role="status" className={`rounded-xl border px-4 py-3 text-xs font-semibold ${isError ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          {statusMessage}
        </div>
      )}

      {/* Barra inferior de acciones */}
      <section className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-5 py-3.5 shadow-xs sm:flex-row">
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-[#e6b31e]" />
          Los cambios se guardan en ConectU al seleccionar una acción.
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/empresa/ofertas"
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancelar
          </Link>

          {editing && initialOffer?.id && (
            <button
              type="button"
              onClick={handleDeleteOffer}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={14} />
              Eliminar oferta
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || isClosed}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-brand-navy transition hover:bg-slate-50"
          >
            <Save size={14} />
            {saving ? "Guardando..." : editing ? "Guardar cambios" : "Guardar borrador"}
          </button>

          {initialOffer?.estado !== "publicada" && <button
            type="submit"
            disabled={saving || isClosed}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-navy/90"
          >
            {saving ? "Guardando..." : initialOffer?.estado === "publicada" ? "Guardar cambios" : "Publicar oferta"}
            <ArrowRight size={14} />
          </button>}
        </div>
      </section>
    </form>
  );
}