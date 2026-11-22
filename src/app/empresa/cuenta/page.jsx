"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  Link2,
  Lock,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  User,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

const MAX_SUMMARY_LENGTH = 500;

export default function CompanyAccountPage() {
  const [summary, setSummary] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savedNotice, setSavedNotice] = useState("");

  // Evaluación estricta de fortaleza: requiere los 3 criterios para ser "Segura"
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>_\-+=\\/\[\];'`~]/.test(newPassword);

  const criteriaCount = [hasMinLength, hasUppercase, hasNumberOrSymbol].filter(Boolean).length;

  const getStrengthMeta = () => {
    if (!newPassword || criteriaCount === 0) {
      return {
        label: "Sin definir",
        barWidth: "w-0",
        barColor: "bg-slate-200",
        badgeColor: "text-slate-400",
      };
    }
    if (criteriaCount === 1) {
      return {
        label: "Débil",
        barWidth: "w-1/3",
        barColor: "bg-rose-500",
        badgeColor: "text-rose-600",
      };
    }
    if (criteriaCount === 2) {
      return {
        label: "Media",
        barWidth: "w-2/3",
        barColor: "bg-amber-500",
        badgeColor: "text-[#8b6600]",
      };
    }
    return {
      label: "Segura",
      barWidth: "w-full",
      barColor: "bg-emerald-500",
      badgeColor: "text-emerald-700",
    };
  };

  const strength = getStrengthMeta();

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice("Cambios guardados en la vista.");
    setTimeout(() => setSavedNotice(""), 3000);
  };

  return (
    <DashboardShell
      role="empresa"
      title="Empresa"
      badge="CORPORATIVO"
      hidePageHeader
    >
      {/* Breadcrumb + Título principal */}
      <div className="mb-6">
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
          Mi cuenta
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Administra los datos fiscales, información de contacto institucional y seguridad de tu cuenta empresarial.
        </p>
      </div>

      {savedNotice && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {savedNotice}
        </div>
      )}

      {/* Columna única centrada con tarjetas apiladas */}
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Tarjeta 1: Identidad Empresarial */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                IDENTIDAD EMPRESARIAL
              </p>
              <h2 className="mt-1 text-lg font-bold text-brand-navy">
                Datos Fiscales y Corporativos
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Datos institucionales para convenios de colaboración y expedientes.
              </p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eeefff] text-brand-navy">
              <BriefcaseBusiness size={18} />
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Razón Social Completa
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Nombre Comercial / Marca
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                RFC con Homoclave (SAT)
              </label>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
                <input
                  type="text"
                  placeholder=""
                  className="w-full bg-transparent text-sm font-medium uppercase text-slate-800 outline-none"
                />
                <Lock size={14} className="ml-2 shrink-0 text-slate-400" />
              </div>
              <p className="mt-1.5 text-[11px] leading-4 text-slate-400">
                Uso exclusivo de validación jurídica. No expuesto públicamente.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Tipo de Contribuyente
              </label>
              <select
                defaultValue=""
                className="select-chevron w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-navy focus:bg-white"
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option value="moral">Persona Moral (Régimen General de Ley)</option>
                <option value="fisica">Persona Física con Actividad Empresarial</option>
                <option value="resico">Régimen Simplificado de Confianza (RESICO)</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Sector Industrial / Rama Técnica
            </label>
            <select
              defaultValue=""
              className="select-chevron w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-navy focus:bg-white"
            >
              <option value="" disabled>
                Selecciona un sector
              </option>
              <option value="tech">Tecnologías de la Información, IoT y Automatización Industrial</option>
              <option value="software">Desarrollo de Software y Servicios Digitales</option>
              <option value="manufactura">Manufactura Avanzada e Ingeniería</option>
              <option value="finanzas">Servicios Financieros y Consultoría</option>
            </select>
          </div>

          {/* Subsección: Enlace y Representación Corporativa */}
          <div className="mt-7 border-t border-slate-100 pt-6">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              <Building2 size={14} className="text-[#8b6600]" />
              ENLACE Y REPRESENTACIÓN CORPORATIVA
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Nombre y Apellidos
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 focus-within:border-brand-navy focus-within:bg-white">
                  <User size={15} className="shrink-0 text-slate-400" />
                  <input
                    type="text"
                    placeholder=""
                    className="w-full bg-transparent text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Puesto / Cargo
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 focus-within:border-brand-navy focus-within:bg-white">
                  <BriefcaseBusiness size={15} className="shrink-0 text-slate-400" />
                  <input
                    type="text"
                    placeholder=""
                    className="w-full bg-transparent text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Correo Corporativo
                  </label>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8b6600]">
                    <CheckCircle2 size={12} />
                    Verificado
                  </span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 focus-within:border-brand-navy focus-within:bg-white">
                  <Mail size={15} className="shrink-0 text-slate-400" />
                  <input
                    type="email"
                    placeholder=""
                    className="w-full bg-transparent text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Teléfono Directo
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 focus-within:border-brand-navy focus-within:bg-white">
                  <Phone size={15} className="shrink-0 text-slate-400" />
                  <input
                    type="tel"
                    placeholder=""
                    className="w-full bg-transparent text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Sitio Web
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 focus-within:border-brand-navy focus-within:bg-white">
                  <Link2 size={15} className="shrink-0 text-slate-400" />
                  <input
                    type="url"
                    placeholder=""
                    className="w-full bg-transparent text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Dirección Corporativa
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 focus-within:border-brand-navy focus-within:bg-white">
                  <MapPin size={15} className="shrink-0 text-slate-400" />
                  <input
                    type="text"
                    placeholder=""
                    className="w-full bg-transparent text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tarjeta 2: Perfil Institucional */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                PERFIL INSTITUCIONAL
              </p>
              <h2 className="mt-1 text-lg font-bold text-brand-navy">
                Descripción de la Empresa y Cultura
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Presentación corporativa compartida con instituciones educativas y candidatos.
              </p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eeefff] text-brand-navy">
              <FileText size={18} />
            </span>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Resumen Institucional
              </label>
              <span className="text-xs font-medium text-slate-400">
                {summary.length} / {MAX_SUMMARY_LENGTH}
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={MAX_SUMMARY_LENGTH}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder=""
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-sm leading-6 text-slate-800 outline-none transition focus:border-brand-navy focus:bg-white"
            />
          </div>
        </section>

        {/* Tarjeta 3: Seguridad de la cuenta con medidor de fortaleza */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-base font-bold text-brand-navy">
              <LockKeyhole size={18} className="text-[#8b6600]" />
              Seguridad de la cuenta
            </h2>
            <span className="text-xs text-slate-400">
              Credenciales de acceso institucional
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Contraseña actual
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 focus-within:border-brand-navy focus-within:bg-white">
                <Lock size={14} className="shrink-0 text-slate-400" />
                <input
                  type="password"
                  placeholder=""
                  className="w-full bg-transparent text-sm text-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Nueva contraseña
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 focus-within:border-brand-navy focus-within:bg-white">
                <Globe size={14} className="shrink-0 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder=""
                  className="w-full bg-transparent text-sm text-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Confirmar contraseña
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 focus-within:border-brand-navy focus-within:bg-white">
                <Shield size={14} className="shrink-0 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder=""
                  className="w-full bg-transparent text-sm text-slate-800 outline-none"
                />
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>
          </div>

          {/* Barra de fortaleza y requerimientos de seguridad */}
          <div className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-600">
                Nivel de seguridad de la contraseña
              </span>
              <span className={`text-xs font-bold ${strength.badgeColor}`}>
                {strength.label}
              </span>
            </div>

            {/* Barra de progreso */}
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.barWidth} ${strength.barColor}`}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <span
                className={`inline-flex items-center gap-1.5 ${
                  hasMinLength ? "font-semibold text-[#8b6600]" : "text-slate-500"
                }`}
              >
                <CheckCircle2
                  size={14}
                  className={hasMinLength ? "text-[#8b6600]" : "text-slate-300"}
                />
                Mínimo 8 caracteres
              </span>
              <span
                className={`inline-flex items-center gap-1.5 ${
                  hasUppercase ? "font-semibold text-[#8b6600]" : "text-slate-500"
                }`}
              >
                <CheckCircle2
                  size={14}
                  className={hasUppercase ? "text-[#8b6600]" : "text-slate-300"}
                />
                Una mayúscula
              </span>
              <span
                className={`inline-flex items-center gap-1.5 ${
                  hasNumberOrSymbol ? "font-semibold text-[#8b6600]" : "text-slate-500"
                }`}
              >
                <CheckCircle2
                  size={14}
                  className={hasNumberOrSymbol ? "text-[#8b6600]" : "text-slate-300"}
                />
                Un número o símbolo
              </span>
            </div>
          </div>
        </section>

        {/* Único botón Guardar cambios hasta abajo */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-navy/90"
          >
            <Save size={15} />
            Guardar cambios
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}