"use client";

import { useState } from "react";
import {
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Gift,
  Info,
  Megaphone,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

const activeVacancies = [
  {
    id: "embebido-mty",
    title: "Ingeniero Trainee de Software Embebido",
    meta: "Campus Monterrey & Virtual • 18 postulantes",
    badge: "Activa",
  },
  {
    id: "mantenimiento-plc",
    title: "Practicante de Mantenimiento y PLC",
    meta: "Planta Toluca • 9 postulantes",
    badge: "Activa",
  },
  {
    id: "atraccion-ti",
    title: "Especialista de Atracción de Talento TI",
    meta: "Ciudad de México • 14 postulantes",
    badge: "Activa",
  },
];

export default function CompanyPlanPage() {
  const [open, setOpen] = useState(false);
  const [durationDays] = useState(7);
  const [selectedVacancyId, setSelectedVacancyId] = useState(
    activeVacancies[0].id
  );
  const [availablePromos, setAvailablePromos] = useState(2);
  const [activePromos, setActivePromos] = useState(1);
  const [usedPromos, setUsedPromos] = useState(4);
  const [assignedLog, setAssignedLog] = useState([]);

  const openPromotionModal = () => {
    setSelectedVacancyId(activeVacancies[0].id);
    setOpen(true);
  };

  const handleConfirmPromotion = () => {
    const chosen = activeVacancies.find((item) => item.id === selectedVacancyId);
    if (!chosen) return;

    setAvailablePromos((prev) => Math.max(0, prev - 1));
    setActivePromos((prev) => prev + 1);
    setUsedPromos((prev) => prev + 1);
    setAssignedLog((prev) => [
      {
        id: `${chosen.id}-${Date.now()}`,
        title: chosen.title,
        days: durationDays,
      },
      ...prev,
    ]);
    setOpen(false);
  };

  return (
    <DashboardShell
      role="empresa"
      title="Empresa"
      badge="CORPORATIVO"
      hidePageHeader
    >
      <div className="space-y-5 pb-8">
        {/* Encabezado superior */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            CAPACIDAD EMPRESARIAL
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-[28px]">
            Plan y promociones
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Administra tus cupos de convocatorias activas, renovación mensual y
            promociones destacadas.
          </p>
        </div>

        {/* Aviso demostrativo */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#f5c22b]/45 bg-[#fffdf5] px-4 py-3 text-xs text-[#765600]">
          <Info size={15} className="shrink-0 text-[#9e7400]" />
          <p>
            <strong className="font-semibold text-brand-navy">
              Vista de demostración.
            </strong>{" "}
            Los precios y movimientos son ilustrativos; no representan cargos
            reales.
          </p>
        </div>

        {/* Tarjeta principal del Plan Actual */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="bg-[#0c1840] px-6 py-6 text-white sm:px-7">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#f5c22b] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                  PLAN ACTUAL
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-slate-200">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  Ciclo activo
                </span>
              </div>

              <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-white">
                Plan básico
              </h2>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                Hasta 20 ofertas activas y 1 promoción incluida por ciclo.
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.35fr_0.85fr] sm:p-7">
            {/* Capacidad y beneficios */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">
                      Capacidad de ofertas activas
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      14 de 20 espacios utilizados
                    </p>
                  </div>
                  <span className="text-lg font-bold text-brand-navy">70%</span>
                </div>

                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[70%] rounded-full bg-[#f5c22b]" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <BenefitCard
                  value="20"
                  label="Ofertas activas"
                  sublabel="Cupo máximo simultáneo"
                />
                <BenefitCard
                  value="1"
                  label="Promoción incluida"
                  sublabel="Incluida en el plan"
                />
              </div>
            </div>

            {/* Tarjeta lateral de renovación */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    RENOVACIÓN DEL PLAN
                  </p>
                  <CalendarClock size={16} className="text-slate-400" />
                </div>

                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-brand-navy">
                    $99
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    MXN / mes
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Precio demostrativo más impuestos aplicables. Facturación
                  mensual automática.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fila inferior: Mis promociones + Reglas de continuidad */}
        <div className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-brand-navy">
                  Mis promociones
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Asigna promociones disponibles a ofertas activas para
                  destacarlas.
                </p>
              </div>

              <button
                type="button"
                onClick={openPromotionModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-navy/90"
              >
                <Megaphone size={14} />
                Aplicar promoción
              </button>
            </div>

            <div className="mt-5 grid gap-3.5 sm:grid-cols-3">
              <PromoCard
                icon={Sparkles}
                value={availablePromos}
                label="Disponibles"
                badgeText="Listas para usar"
                iconWrapClass="bg-brand-gold-soft text-[#9e7400]"
              />
              <PromoCard
                icon={BadgeCheck}
                value={activePromos}
                label="En uso"
                badgeText="Destacando vacante"
                iconWrapClass="bg-emerald-50 text-emerald-700"
              />
              <PromoCard
                icon={Gift}
                value={usedPromos}
                label="Utilizadas"
                badgeText="Histórico del ciclo"
                iconWrapClass="bg-[#eeefff] text-indigo-700"
              />
            </div>

            {assignedLog.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                {assignedLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-xl border border-indigo-100 bg-[#f7f8ff] px-3.5 py-2 text-xs"
                  >
                    <span className="font-semibold text-brand-navy">
                      {entry.title}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                      +{entry.days} días aplicada
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#eeefff] text-brand-navy">
                <ShieldCheck size={16} />
              </span>
              <div>
                <h2 className="text-base font-bold text-brand-navy">
                  Reglas de continuidad
                </h2>
                <p className="text-xs text-slate-500">
                  Condiciones operativas de vigencia.
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-3 text-xs leading-5 text-slate-600">
              <li className="flex items-start gap-2.5 rounded-xl bg-slate-50/80 p-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy" />
                <span>Una promoción se asigna a una oferta activa.</span>
              </li>
              <li className="flex items-start gap-2.5 rounded-xl bg-slate-50/80 p-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c99700]" />
                <span>La promoción permanece ligada al ciclo vigente.</span>
              </li>
              <li className="flex items-start gap-2.5 rounded-xl bg-slate-50/80 p-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>
                  Las extensiones de vigencia conservan las validaciones del
                  ciclo.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* Modal: Aplicar Promoción de 7 días */}
      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
              <div className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gold-soft text-[#9e7400]">
                  <Megaphone size={19} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-brand-navy sm:text-lg">
                    Aplicar Promoción de {durationDays} días
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Selecciona la vacante que deseas posicionar
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 px-6 pb-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                OFERTAS ACTIVAS DISPONIBLES (14 EN CURSO)
              </p>

              <div className="space-y-2.5">
                {activeVacancies.map((vacancy) => {
                  const isSelected = selectedVacancyId === vacancy.id;
                  return (
                    <label
                      key={vacancy.id}
                      onClick={() => setSelectedVacancyId(vacancy.id)}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition ${
                        isSelected
                          ? "border-brand-navy bg-[#fafbff] ring-1 ring-brand-navy/15"
                          : "border-slate-200/90 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                            isSelected
                              ? "border-[#a855f7] bg-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-[#a855f7]" />
                          )}
                        </span>

                        <div>
                          <p className="text-xs font-bold text-brand-navy sm:text-sm">
                            {vacancy.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {vacancy.meta}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-[11px] font-bold text-[#9e7400]">
                        {vacancy.badge}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2.5 text-[11px] text-slate-600">
                <Info size={14} className="shrink-0 text-slate-400" />
                <p>
                  La promoción consumirá la cuota incluida de {durationDays} días
                  del Plan Básico activo.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPromotion}
                  className="rounded-xl bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-navy/90"
                >
                  Confirmar y Destacar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function BenefitCard({ value, label, sublabel }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4">
      <p className="text-xl font-bold text-brand-navy">{value}</p>
      <p className="mt-0.5 text-xs font-semibold text-slate-700">{label}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{sublabel}</p>
    </div>
  );
}

function PromoCard({ icon: Icon, value, label, badgeText, iconWrapClass }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`grid h-9 w-9 place-items-center rounded-lg ${iconWrapClass}`}
        >
          <Icon size={18} />
        </span>
        <span className="text-[11px] font-medium text-slate-400">
          {badgeText}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-brand-navy">
        {value}
      </p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}