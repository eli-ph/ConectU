"use client";

import { useEffect, useState } from "react";
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
import { PasswordStrength } from "@/components/password-strength";
import { checkPassword } from "@/lib/password-policy";

const MAX_SUMMARY_LENGTH = 500;

export default function CompanyAccountPage() {
  const [summary, setSummary] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [user, setUser] = useState(null);
  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((result) => { if (active) setUser(result.user); })
      .catch(() => { if (active) window.location.assign("/ingresar"); });
    return () => { active = false; };
  }, []);

  const passwordReady = !newPassword || (checkPassword(newPassword).valid && newPassword === confirmPassword);

  // La edición y el cambio de contraseña se conectarán en otra entrega.
  // Nunca afirmar que una edición local fue guardada en SQLite.
  if (!user) return <DashboardShell role="empresa" title="Mi cuenta"><p role="status" className="rounded-xl bg-white p-5 text-sm text-slate-600">Cargando tu cuenta...</p></DashboardShell>;

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

      <p className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-brand-navy">
        Estos son los datos guardados en SQLite. En esta etapa puedes consultarlos; la edición y el cambio de contraseña aún no están habilitados.
      </p>
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
                Datos corporativos registrados por tu organización.
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
                readOnly
                defaultValue={user.razon_social || ""}
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
                readOnly
                defaultValue={user.nombre_comercial || ""}
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
                  readOnly
                  defaultValue={user.rfc || ""}
                  type="text"
                  placeholder=""
                  className="w-full bg-transparent text-sm font-medium uppercase text-slate-800 outline-none"
                />
                <Lock size={14} className="ml-2 shrink-0 text-slate-400" />
              </div>
              <p className="mt-1.5 text-[11px] leading-4 text-slate-400">
                Información fiscal privada visible únicamente en tu cuenta y para administración.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Tipo de Contribuyente
              </label>
              <select
                disabled
                defaultValue={user.tipo_contribuyente || ""}
                className="select-chevron w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-navy focus:bg-white"
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option value="moral">Persona Moral (Régimen General de Ley)</option>
                <option value="fisica">Persona Física con Actividad Empresarial</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Sector Industrial / Rama Técnica
            </label>
            <select
              disabled
              defaultValue={user.sector || ""}
              className="select-chevron w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-navy focus:bg-white"
            >
              <option value="" disabled>
                Selecciona un sector
              </option>
              <option value={user.sector || ""}>{user.sector || "Sin especificar"}</option>
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
                    readOnly
                    defaultValue={user.contacto_nombre || ""}
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
                    readOnly
                    defaultValue={user.contacto_cargo || ""}
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
                    {user.email_verificado ? "Correo verificado" : "Verificación pendiente"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 focus-within:border-brand-navy focus-within:bg-white">
                  <Mail size={15} className="shrink-0 text-slate-400" />
                  <input
                    readOnly
                    defaultValue={user.email || ""}
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
                    readOnly
                    defaultValue={user.telefono || ""}
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
                    readOnly
                    defaultValue={user.sitio_web || ""}
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
                    readOnly
                    defaultValue={[user.ciudad, user.entidad].filter(Boolean).join(", ")}
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
                Descripción corporativa registrada en ConectU.
              </p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eeefff] text-brand-navy">
              <FileText size={18} />
            </span>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Descripción de la organización
              </label>
              <span className="text-xs font-medium text-slate-400">
                {(user.descripcion || "").length} caracteres
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={MAX_SUMMARY_LENGTH}
              value={user.descripcion || ""}
              readOnly
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
                  disabled
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
                  disabled
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
                  disabled
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

          <p className="mt-5 text-xs text-slate-500">El cambio de contraseña estará disponible cuando implementemos el módulo de seguridad del perfil.</p>
          {newPassword && !passwordReady && <p role="status" className="mt-2 text-xs text-rose-700">Comprueba los cinco requisitos y que ambas contraseñas coincidan.</p>}
        </section>

        {/* Único botón Guardar cambios hasta abajo */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-navy/90"
          >
            <Save size={15} />
            Edición próximamente
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}