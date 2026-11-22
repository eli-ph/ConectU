"use client";

import { useState } from "react";
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
    id: "internships",
    title: OFFER_TYPE_LABELS.internships,
    subtitle: "Programa formativo",
    icon: Sparkles,
  },
  {
    id: "servicio",
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

const initialAttachments = [
  {
    id: "doc-1",
    name: "Bases_Tecnicas_Convocatoria.pdf",
    meta: "1.4 MB • PDF Oficial",
    verified: true,
  },
  {
    id: "doc-2",
    name: "Rubrica_Evaluacion_Proyectos.pdf",
    meta: "850 KB • Criterios Técnicos",
    verified: true,
  },
];

export function CompanyOfferForm() {
  const [title, setTitle] = useState(
    "Ingeniero de Sistemas Embebidos e IoT"
  );
  const [selectedType, setSelectedType] = useState("empleo");
  const [modality, setModality] = useState("Presencial");
  const [location, setLocation] = useState(
    "Parque Tecnológico Querétaro, Edificio Alfa - Lab de Hardware 03"
  );
  const [description, setDescription] = useState(
    `El candidato se integrará a la célula de telemetría automotriz asistiendo en el desarrollo de firmware bare-metal y RTOS para módulos de monitoreo en tiempo real.\n\nPrincipales entregables durante el periodo:\n- Prototipado e integración de controladores SPI/I2C en microcontroladores ARM Cortex-M4.\n- Implementación del stack de comunicaciones MQTT sobre Ethernet industrial y Wi-Fi embebido.\n- Validación en banco de pruebas con osciloscopio digital y analizadores lógicos de protocolos.`
  );

  const [axis, setAxis] = useState(
    "Tecnologías de la Información y Software"
  );
  const [skills, setSkills] = useState([
    "C/C++ Moderno (C11/C+17)",
    "FreeRTOS",
    "Linux Embedded / Yocto",
    "KiCad EDA",
    "Protocolo MQTT & TLS",
  ]);

  const [minCredits, setMinCredits] = useState(70);

  const [stipend, setStipend] = useState("12,500.00");
  const [vacancies, setVacancies] = useState(3);
  const [deadline, setDeadline] = useState("2025-05-30");
  const [socialHours, setSocialHours] = useState("480 horas");
  const [officialKey, setOfficialKey] = useState("");

  const [attachments, setAttachments] = useState(initialAttachments);
  const [statusMessage, setStatusMessage] = useState("");

  const handleRemoveSkill = (tag) => {
    setSkills((prev) => prev.filter((item) => item !== tag));
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleAddMockAttachment = (e) => {
    const file = e.target.files?.[0];
    if (!file || attachments.length >= 3) return;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setAttachments((prev) => [
      ...prev,
      {
        id: `doc-${Date.now()}`,
        name: file.name,
        meta: `${sizeMb} MB • Anexo Técnico`,
        verified: true,
      },
    ]);
    e.target.value = "";
  };

  const handleSaveDraft = () => {
    setStatusMessage("Borrador guardado y respaldado localmente hace unos segundos.");
  };

  const handlePublish = (e) => {
    e.preventDefault();
    setStatusMessage(
      `Convocatoria "${title}" publicada correctamente (1 cupo asignado).`
    );
  };

  return (
    <form onSubmit={handlePublish} className="space-y-5 pb-8">
      {/* Breadcrumb + Título + Badge de Borrador */}
      <div>
        <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Link href="/empresa/ofertas" className="hover:text-brand-navy">
            MIS OFERTAS
          </Link>
          <ChevronRight size={12} />
          <span className="text-brand-navy">NUEVA CONVOCATORIA</span>
        </nav>

        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
            Publicar o editar oferta
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold-soft px-3 py-1 text-[11px] font-bold text-[#8b6600]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c99700]" />
            Versión 2025.1 - Modo Borrador
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
                Plan Corporativo
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Consumirá{" "}
              <strong className="font-bold text-brand-navy">
                1 cupo de oferta activa
              </strong>{" "}
              • Sin límite en número de plazas
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#f5c22b]/50 bg-[#fffdf4] px-3.5 py-1.5 text-xs font-bold text-[#8b6600]">
          <span className="h-2 w-2 rounded-full bg-[#e6b31e]" />7 cupos
          disponibles actualmente
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
              Recomendamos nombres técnicos descriptivos validados por academias
              universitarias.
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
            Match IA Activo
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
              </option>
            </select>
          </div>

          {/* Selector compartido con el catálogo: búsqueda arriba y etiquetas debajo. */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">HERRAMIENTAS Y TECNOLOGÍAS REQUERIDAS</h3>
            <SkillPicker skills={skills} onChange={setSkills} label="Busca las tecnologías que requiere esta oferta" />
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
              Estructura de apoyo económico y acreditación institucional.
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
              Beca neta mensual exenta de retenciones académicas
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
              Vacantes concurrentes autorizadas para este ciclo.
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
        {(selectedType === "practicas" || selectedType === "servicio") && <div className="mt-6 rounded-2xl border border-indigo-100 bg-[#f7f8ff] p-4 sm:p-5">
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
                  Verificado
                </span>
                <button
                  type="button"
                  className="font-bold text-indigo-700 hover:underline"
                >
                  Previsualizar
                </button>
              </div>
            </div>
          ))}

          {attachments.length < 3 && (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 text-center transition hover:border-brand-navy hover:bg-slate-50">
              <UploadCloud size={20} className="text-slate-400" />
              <p className="mt-2 text-xs font-bold text-brand-navy">
                Cargar {attachments.length + 1}er Anexo Técnico
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Arrastra tu PDF aquí o examina
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">Hasta 15 MB</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleAddMockAttachment}
                className="sr-only"
              />
            </label>
          )}
        </div>
      </section>

      {statusMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          {statusMessage}
        </div>
      )}

      {/* Barra inferior de acciones */}
      <section className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-5 py-3.5 shadow-xs sm:flex-row">
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-[#e6b31e]" />
          Borrador respaldado localmente hace 2 minutos
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/empresa/ofertas"
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancelar
          </Link>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-brand-navy transition hover:bg-slate-50"
          >
            <Save size={14} />
            Guardar Borrador
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-navy/90"
          >
            Publicar oferta
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </form>
  );
}