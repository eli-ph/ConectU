"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileCheck2,
  FileText,
  GraduationCap,
  Hourglass,
  MapPin,
  Rocket,
  ShieldCheck,
  SlidersHorizontal,
  Timer,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

export default function CompanyDashboard() {
  // El estado real llegará de la sesión empresarial al integrar el backend.
  const isApproved = true;

  return (
    <DashboardShell
      role="empresa"
      title="Empresa"
      badge="CORPORATIVO"
      hidePageHeader
    >
      {/* Tarjeta de identidad corporativa */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-navy text-brand-gold shadow-sm">
            <Building2 size={26} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-brand-navy sm:text-xl">
                TechNova Dynamics México
              </h2>
              {isApproved ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold-soft px-3 py-1 text-xs font-semibold text-[#765600]">
                  <CheckCircle2 size={13} className="text-[#9e7400]" />
                  Empresa Verificada y Aprobada
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  <Hourglass size={13} />
                  En Revisión Institucional
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eeefff] px-3 py-1 text-xs font-semibold text-indigo-700">
                <Award size={13} />
                Plan Crecimiento Tecnológico
              </span>
            </div>

            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                <Calendar size={12} className="text-slate-400" />
                Vigencia: Octubre 2026
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <FileText size={13} className="text-slate-400" />
                RFC: TND180420-KL9
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" />
                Sede: Naucalpan &amp; Hub Monterrey
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={13} className="text-brand-navy" />
                Convenio Politécnico e Ingenierías
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bloque de Protocolo de Homologación & Verificación */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div
          className={`border-l-[5px] p-5 sm:p-6 ${
            isApproved ? "border-brand-navy" : "border-amber-500"
          }`}
        >
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div className="flex items-start gap-4">
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                  isApproved
                    ? "bg-brand-gold-soft text-[#765600]"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                <ShieldCheck size={24} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#eeefff] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                    PROTOCOLO INSTITUCIONAL
                  </span>
                  <h2 className="text-base font-bold text-brand-navy sm:text-lg">
                    Protocolo de Homologación &amp; Verificación
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isApproved
                        ? "bg-brand-gold-soft text-[#765600]"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isApproved ? "Aprobada" : "Pendiente de resolución"}
                  </span>
                </div>
                <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-600 sm:text-sm">
                  {isApproved ? (
                    <>
                      Tu empresa está validada por el comité universitario y habilitada para operar con normalidad. Recuerda que{" "}
                      <strong className="font-semibold text-slate-800">
                        una empresa no aprobada NO puede crear, publicar, reactivar ni promocionar ofertas, ni contratar planes.
                      </strong>
                    </>
                  ) : (
                    <>
                      Tu expediente está en cotejo jurídico por el comité universitario. Mientras tanto,{" "}
                      <strong className="font-semibold text-slate-800">
                        NO podrás crear, publicar, reactivar ni promocionar ofertas, ni contratar planes
                      </strong>{" "}
                      hasta recibir resolución favorable.
                    </>
                  )}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                isApproved
                  ? "border-slate-200 bg-slate-50 text-brand-navy"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              <Award size={15} className={isApproved ? "text-brand-gold" : "text-amber-600"} />
              {isApproved ? "Acreditación Nivel 1 • Activa" : "Revisión en curso • Nivel 1"}
            </span>
          </div>

          {/* Etapas del protocolo */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                ETAPAS DEL PROTOCOLO DE HOMOLOGACIÓN UNIVERSITARIA
              </p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold ${
                  isApproved ? "text-[#8b6600]" : "text-amber-700"
                }`}
              >
                <CheckCircle2 size={14} />
                {isApproved ? "Proceso completado al 100%" : "Progreso al 66% (Etapa 2 de 3)"}
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <StageCard
                step="1. Documentos Enviados"
                detail="Cédula fiscal, RFC, constancia de situación..."
                status="done"
              />
              <StageCard
                step="2. En Revisión Jurídica y Fiscal"
                detail="Cotejo institucional de marco legal, valid..."
                status={isApproved ? "done" : "current"}
              />
              <StageCard
                step="3. Homologación Aprobada"
                detail="Resolución favorable emitida por la Dire..."
                status={isApproved ? "approved" : "locked"}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fila de 4 tarjetas de métricas */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Capacidad de ofertas */}
        <article className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                CAPACIDAD DE OFERTAS
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gold-soft text-[#9e7400]">
                <BriefcaseBusiness size={16} />
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-brand-navy">5</span>
                <span className="text-sm font-medium text-slate-400">/ 5 activas</span>
              </div>
              <span className="rounded-full bg-brand-gold-soft px-2.5 py-0.5 text-[11px] font-bold text-[#765600]">
                100% Lleno
              </span>
            </div>
            {/* Barra de progreso */}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-full rounded-full bg-[#9e7400]" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Cupo base asignado</span>
            <span className="font-semibold text-slate-700">0 disponibles</span>
          </div>
        </article>

        {/* Card 2: Plazas universitarias */}
        <article className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                PLAZAS UNIVERSITARIAS
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eeefff] text-indigo-600">
                <UserCheck size={16} />
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-brand-navy">14</span>
                <span className="text-xs font-medium text-slate-500">plazas</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8b6600]">
                <TrendingUp size={12} /> +4 este mes
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span>En 5 ofertas activas</span>
            <span className="font-bold text-brand-navy">Ciclo 2025-1</span>
          </div>
        </article>

        {/* Card 3: Postulaciones del ciclo */}
        <article className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                POSTULACIONES DEL CICLO
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eeefff] text-indigo-600">
                <Users size={16} />
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-brand-navy">86</span>
                <span className="text-xs font-medium text-slate-500">expedientes</span>
              </div>
              <span className="rounded-full bg-[#eeefff] px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                18 no leídas
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-navy" />
              62% compatibilidad
            </span>
            <span className="font-bold text-brand-navy">8 en entrevista</span>
          </div>
        </article>

        {/* Card 4: Créditos de promoción */}
        <article className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                CRÉDITOS DE PROMOCIÓN
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gold-soft text-[#9e7400]">
                <Rocket size={16} />
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-brand-navy">2</span>
                <span className="text-xs font-medium text-slate-500">disponibles</span>
              </div>
              <Link
                href="/empresa/plan"
                className="text-xs font-bold text-[#8b6600] hover:underline"
              >
                Comprar &gt;
              </Link>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span className="truncate">Destacados en ...</span>
            <span className="shrink-0 font-semibold text-slate-700">Incluidos en plan</span>
          </div>
        </article>
      </div>

      {/* Sección inferior: Ofertas próximas a vencer + Actividad reciente */}
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        {/* Columna izquierda: Ofertas próximas a vencer */}
        <section>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-brand-navy">
                <Timer size={20} className="text-[#9e7400]" />
                Ofertas próximas a vencer (&lt; 7 días)
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Vacantes críticas que requieren renovación o prórroga inmediata antes de cierre automático.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
              2 en riesgo
            </span>
          </div>

          <div className="space-y-4">
            <ExpiringOffer
              urgency="high"
              days="3 días"
              type="Prácticas Profesionales"
              modality="Híbrido"
              title="Ingeniero Trainee de Software Embebido"
              area="I+D Automotriz"
              published="12 de Enero"
              closing="23 de Febrero, 23:59 hrs"
              applicants={31}
              slots={3}
              views={348}
              disabled={!isApproved}
            />
            <ExpiringOffer
              urgency="medium"
              days="5 días"
              type="Servicio Social"
              modality="Presencial Planta"
              title="Practicante de Mantenimiento y PLC"
              area="Automatización"
              published="14 de Enero"
              closing="25 de Febrero, 18:00 hrs"
              applicants={19}
              slots={2}
              views={212}
              disabled={!isApproved}
            />
          </div>

          {/* Banner inferior de vacantes adicionales */}
          <div className="mt-4 flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-5 py-3.5 shadow-xs sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <CheckCircle2 size={16} className="shrink-0 text-[#9e7400]" />
              <span>3 vacantes activas adicionales tienen más de 20 días de vigencia restante.</span>
            </div>
            <Link
              href="/empresa/ofertas"
              className="shrink-0 text-xs font-bold text-brand-navy hover:underline"
            >
              Ver todas (5)
            </Link>
          </div>
        </section>

        {/* Columna derecha: Actividad reciente */}
        <aside className="flex h-fit flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-brand-navy">
                <Clock size={18} className="text-[#9e7400]" />
                Actividad reciente
              </h2>
              <span className="rounded-full bg-[#eeefff] px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                Últimas 24h
              </span>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              <ActivityItem
                icon={Users}
                tone="gold"
                title="Carlos Mendoza Alarcón"
                time="Hace 15 min"
                subtitle={
                  <>
                    Postulación para <strong className="font-semibold text-slate-700">Software Embebido • IPN UPIITA</strong>
                  </>
                }
              />
              <ActivityItem
                icon={Calendar}
                tone="blue"
                title="Entrevista Confirmada"
                time="Hace 2 horas"
                subtitle={
                  <>
                    <strong className="font-semibold text-slate-700">Mariana Gómez</strong> • Mañana 11:30 hrs (Meet)
                  </>
                }
              />
              <ActivityItem
                icon={FileCheck2}
                tone="navy"
                title="Validación de Créditos"
                time="Hace 4 horas"
                subtitle={
                  <>
                    Plan aprobado para <strong className="font-semibold text-slate-700">Luis Ángel Trejo</strong>
                  </>
                }
              />
              <ActivityItem
                icon={Users}
                tone="gold"
                title="Elena Velasco Navarro"
                time="Hace 6 horas"
                subtitle={
                  <>
                    Postulación para <strong className="font-semibold text-slate-700">Mantenimiento y PLC</strong>
                  </>
                }
              />
            </div>
          </div>

          <Link
            href="/empresa/estadisticas"
            className="mt-5 block w-full rounded-xl bg-slate-100 px-4 py-2.5 text-center text-xs font-bold text-brand-navy transition hover:bg-slate-200/70"
          >
            Ver historial completo
          </Link>
        </aside>
      </div>
    </DashboardShell>
  );
}

function StageCard({ step, detail, status }) {
  const isApproved = status === "approved";
  const isDone = status === "done";
  const isCurrent = status === "current";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3.5 ${
        isApproved
          ? "border-[#e5c158] bg-[#fffdf5]"
          : isCurrent
          ? "border-amber-300 bg-amber-50/40"
          : "border-slate-200/80 bg-slate-50/70"
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
          isApproved
            ? "bg-[#9e7400] text-white"
            : isDone
            ? "bg-brand-navy text-white"
            : isCurrent
            ? "bg-amber-500 text-white"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        {isApproved ? <Award size={16} /> : <Check size={16} />}
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-brand-navy">{step}</p>
        <p className="truncate text-[11px] text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

function ExpiringOffer({
  urgency,
  days,
  type,
  modality,
  title,
  area,
  published,
  closing,
  applicants,
  slots,
  views,
  disabled,
}) {
  const isHigh = urgency === "high";

  return (
    <article
      className={`rounded-2xl border border-slate-200/90 border-l-[5px] bg-white p-5 shadow-xs ${
        isHigh ? "border-l-rose-600" : "border-l-[#9e7400]"
      }`}
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isHigh
                  ? "bg-rose-50 text-rose-700"
                  : "bg-brand-gold-soft text-[#765600]"
              }`}
            >
              <Clock size={12} />
              Vence en {days}
            </span>
            <span className="rounded-full bg-[#eeefff] px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
              {type}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
              {modality}
            </span>
          </div>

          <h3 className="mt-2.5 text-base font-bold text-brand-navy">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Área: {area} • Publicada: {published} • Cierre: {closing}
          </p>
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <p className="text-2xl font-bold leading-none text-brand-navy">{applicants}</p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">Postulados</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-3.5 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CheckCircle2 size={14} className="text-[#9e7400]" />
            {slots} plazas disponibles
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <Eye size={14} className="text-slate-400" />
            {views} vistas
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Clock size={14} />
            Extender Vigencia
          </button>
          <Link
            href="/empresa/ofertas"
            aria-label={`Ver detalle de ${title}`}
            className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-brand-navy"
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function ActivityItem({ icon: Icon, tone, title, time, subtitle }) {
  const tones = {
    gold: "bg-brand-gold-soft text-[#9e7400]",
    blue: "bg-[#eeefff] text-indigo-600",
    navy: "bg-slate-100 text-brand-navy",
  };

  return (
    <div className="flex items-start gap-3 py-3.5 first:pt-1 last:pb-1">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-xs font-bold text-brand-navy">{title}</p>
          <span className="shrink-0 text-[10px] text-slate-400">{time}</span>
        </div>
        <p className="mt-0.5 text-xs leading-4 text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}