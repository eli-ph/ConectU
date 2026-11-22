"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  UserRoundPlus,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

const specialCharacterPattern = /[@$!%*#?&._\-+]/;

export default function NewAdministratorPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const [notice, setNotice] = useState("");

  const passwordRequirements = [
    { label: "Mínimo 10 caracteres", met: password.length >= 10 },
    { label: "Al menos una letra mayúscula y una minúscula", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: "Al menos un número (0–9)", met: /\d/.test(password) },
    { label: "Al menos un carácter especial (@, $, !, %, *, #, ?, &)", met: specialCharacterPattern.test(password) },
  ];
  const score = passwordRequirements.filter((requirement) => requirement.met).length;
  const strengthLabels = ["Sin ingresar", "Muy débil", "Básica", "Media", "Fuerte"];
  const strengthColors = ["bg-slate-200", "bg-rose-400", "bg-amber-400", "bg-sky-500", "bg-emerald-500"];
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  function handleSubmit(event) {
    event.preventDefault();
    setNotice("");

    if (score !== passwordRequirements.length) {
      setNotice("La contraseña todavía no cumple todos los requisitos de seguridad.");
      return;
    }
    if (password !== confirmPassword) {
      setNotice("La contraseña y su confirmación deben coincidir.");
      return;
    }

    // La creación de administradores se hará en el servidor, una vez implementados
    // autenticación, permisos y persistencia. Aquí solo se valida el formulario.
    setNotice("Los datos del formulario son válidos. La creación de la cuenta se habilitará al integrar la autenticación administrativa.");
  }

  return (
    <DashboardShell role="admin" title="Registrar administrador" eyebrow="Gestión de accesos">
      <div className="mx-auto w-full max-w-[1120px]">
        <nav aria-label="Ruta de navegación" className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
          <Link href="/admin" className="transition hover:text-brand-navy">Panel administrador</Link>
          <span aria-hidden="true">›</span>
          <span>Gestión de accesos</span>
          <span aria-hidden="true">›</span>
          <span className="text-brand-navy">Registrar administrador</span>
        </nav>

        <p className="mb-6 max-w-[780px] text-sm leading-6 text-slate-600 sm:text-base">
          Alta de cuentas para personal autorizado de ConectU. Los permisos y las credenciales se validarán de forma privada en el servidor.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft" aria-labelledby="admin-identidad">
            <SectionHeader number="1" title="Datos de identidad y cargo" detail="Paso obligatorio" />
            <div className="grid gap-x-5 gap-y-5 px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6">
              <Field
                id="admin-full-name"
                label="Nombre completo"
                hint="Nombre y apellidos"
                className="sm:col-span-2"
              >
                <input
                  id="admin-full-name"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ej. María Fernanda López Hernández"
                  className={inputClass}
                />
              </Field>
              <Field id="admin-email" label="Correo electrónico" hint="Correo del administrador">
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nombre@dominio.com"
                  className={inputClass}
                />
              </Field>
              <Field id="admin-internal-code" label="Identificador interno" hint="Opcional">
                <input
                  id="admin-internal-code"
                  name="internalCode"
                  type="text"
                  maxLength={40}
                  placeholder="Ej. ADM-001"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft" aria-labelledby="admin-credenciales">
            <SectionHeader number="2" title="Credenciales de acceso y seguridad" detail="Seguridad de acceso" />
            <div className="grid gap-x-5 gap-y-5 px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6">
              <Field id="admin-password" label="Contraseña provisional">
                <div className="relative">
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={10}
                    autoComplete="new-password"
                    placeholder="Ingresa una contraseña"
                    value={password}
                    onChange={(event) => { setPassword(event.target.value); setNotice(""); }}
                    className={`${inputClass} pr-12`}
                  />
                  <VisibilityButton
                    visible={showPassword}
                    onClick={() => setShowPassword((value) => !value)}
                    label="contraseña provisional"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>Nivel de fortaleza:</span>
                  <span className="font-semibold">{strengthLabels[password.length ? score || 1 : 0]}</span>
                </div>
                <div className="mt-1.5 grid grid-cols-4 gap-1.5" role="meter" aria-label="Fortaleza de la contraseña" aria-valuemin={0} aria-valuemax={4} aria-valuenow={password.length ? score : 0}>
                  {[1, 2, 3, 4].map((level) => (
                    <div key={level} className={`h-1.5 rounded-full ${password.length && score >= level ? strengthColors[Math.max(score, 1)] : "bg-slate-200"}`} />
                  ))}
                </div>
              </Field>
              <Field id="admin-confirm-password" label="Confirmar contraseña">
                <div className="relative">
                  <input
                    id="admin-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={10}
                    autoComplete="new-password"
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(event) => { setConfirmPassword(event.target.value); setNotice(""); }}
                    aria-describedby={confirmPassword ? "admin-password-match" : undefined}
                    className={`${inputClass} pr-12`}
                  />
                  <VisibilityButton
                    visible={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    label="confirmación de contraseña"
                  />
                </div>
                {confirmPassword && (
                  <p id="admin-password-match" className={`mt-3 flex items-center gap-1.5 text-xs font-semibold ${passwordsMatch ? "text-emerald-700" : "text-rose-700"}`}>
                    {passwordsMatch ? <CheckCircle2 size={14} aria-hidden="true" /> : <Circle size={14} aria-hidden="true" />}
                    {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                  </p>
                )}
              </Field>
              <div className="rounded-lg bg-[#f0f4fc] px-4 py-4 sm:col-span-2 sm:px-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.07em] text-brand-navy">Requisitos de seguridad de acceso</p>
                <ul className="grid gap-x-6 gap-y-2.5 text-xs text-slate-600 sm:grid-cols-2">
                  {passwordRequirements.map((requirement) => (
                    <li key={requirement.label} className={`flex items-start gap-2 ${requirement.met ? "text-emerald-700" : "text-slate-500"}`}>
                      {requirement.met ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> : <Circle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />}
                      <span>{requirement.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft" aria-labelledby="admin-politicas">
            <SectionHeader number="3" title="Permisos y políticas de verificación" detail="Opciones de acceso" />
            <div className="space-y-1 px-5 py-4 sm:px-6 sm:py-5">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-3 transition hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="requirePasswordChange"
                  checked={requirePasswordChange}
                  onChange={(event) => setRequirePasswordChange(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand-navy"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-brand-navy">Requerir cambio de contraseña en el primer inicio de sesión</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">El administrador deberá sustituir la contraseña provisional cuando acceda a su cuenta.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-3 transition hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="enableTwoFactor"
                  checked={enableTwoFactor}
                  onChange={(event) => setEnableTwoFactor(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand-navy"
                />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-brand-navy">Solicitar autenticación de dos factores (2FA)</span>
                    <span className="rounded-md bg-[#e7eefc] px-2 py-0.5 text-[10px] font-bold text-brand-navy">Opcional</span>
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">Segunda verificación de acceso, sujeta al proveedor de autenticación que se integre.</span>
                </span>
              </label>
            </div>
          </section>

          {notice && (
            <p role="status" className="rounded-lg border border-slate-200 bg-[#edf2fc] px-4 py-3 text-sm leading-6 text-brand-navy">
              {notice}
            </p>
          )}

          <div className="flex flex-col-reverse justify-between gap-3 pt-1 sm:flex-row sm:items-center">
            <Link href="/admin" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#dfe9fc] px-6 py-3 text-sm font-semibold text-brand-navy transition hover:bg-[#d1dff8]">
              <ArrowLeft size={17} aria-hidden="true" /> Cancelar y volver
            </Link>
            <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-navy px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-navy-light">
              <UserRoundPlus size={17} aria-hidden="true" /> Crear administrador
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

const inputClass = "h-11 w-full min-w-0 rounded-md border border-transparent bg-[#eef2fb] px-3 text-sm text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-navy/30 focus:bg-white focus:ring-2 focus:ring-brand-navy/10";

function SectionHeader({ number, title, detail }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-[#fafbfe] px-5 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-navy text-xs font-bold text-white">{number}</span>
        <h2 id={`admin-${number === "1" ? "identidad" : number === "2" ? "credenciales" : "politicas"}`} className="text-base font-bold tracking-tight text-brand-navy sm:text-lg">{title}</h2>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-brand-gold-dark">{detail}</span>
    </div>
  );
}

function Field({ id, label, hint, children, className = "" }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="mb-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <label htmlFor={id} className="text-sm font-semibold text-brand-navy">
          {label}{id !== "admin-internal-code" && <span className="ml-0.5 text-rose-600">*</span>}
        </label>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function VisibilityButton({ visible, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${visible ? "Ocultar" : "Mostrar"} ${label}`}
      className="absolute inset-y-0 right-1 flex w-11 items-center justify-center rounded-md text-slate-500 transition hover:text-brand-navy"
    >
      {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
    </button>
  );
}
