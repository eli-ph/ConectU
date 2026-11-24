"use client";

import Link from "next/link";
import { operacionAdministracion } from "@/components/admin/admin-api";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  UserRoundPlus,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { checkPassword } from "@/lib/password-policy";
import { PasswordStrength } from "@/components/password-strength";



export default function NewAdministratorPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy,setBusy]=useState(false);

  const passwordRequirements = checkPassword(password).checks.map(({ label, valid }) => ({ label, met: valid }));
  const score = passwordRequirements.filter((requirement) => requirement.met).length;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  async function handleSubmit(event) {
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

    if(busy)return;
    const form=event.currentTarget;
    const fields=Object.fromEntries(new FormData(form));
    setBusy(true);
    try{await operacionAdministracion({...fields,operacion:"crear_admin"});form.reset();setPassword("");setConfirmPassword("");setNotice("Administrador registrado correctamente.");}
    catch(e){setNotice(e.message);}finally{setBusy(false);}
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
          Alta de cuentas para personal autorizado de ConectU. Los campos corresponden a la tabla USUARIOS: nombre, apellidos, correo y contraseña protegida. El rol Administrador se asignará en el servidor.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft" aria-labelledby="admin-identidad">
            <SectionHeader number="1" title="Datos personales" detail="Paso obligatorio" />
            <div className="grid gap-x-5 gap-y-5 px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6">
              <Field id="admin-first-name" label="Nombre">
                <input
                  id="admin-first-name"
                  name="nombre"
                  type="text"
                  required
                  maxLength={120}
                  autoComplete="given-name"
                  placeholder="Ej. María Fernanda"
                  className={inputClass}
                />
              </Field>
              <Field id="admin-last-name" label="Apellidos">
                <input
                  id="admin-last-name"
                  name="apellidos"
                  type="text"
                  required
                  maxLength={160}
                  autoComplete="family-name"
                  placeholder="Ej. López Hernández"
                  className={inputClass}
                />
              </Field>
              <Field id="admin-email" label="Correo electrónico" className="sm:col-span-2">
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="nombre@dominio.com"
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
                    minLength={8}
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
                </Field>
              <Field id="admin-confirm-password" label="Confirmar contraseña">
                <div className="relative">
                  <input
                    id="admin-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
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
              <div className="sm:col-span-2">
                <PasswordStrength password={password} />
              </div>
            </div>
          </section>

          {notice && (
            <p role="status" className="rounded-lg border border-slate-200 bg-[#edf2fc] px-4 py-3 text-sm leading-6 text-brand-navy">
              {notice}
            </p>
          )}

          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-brand-navy">
            El alta es privada. La contraseña se almacena mediante hash seguro y el rol se asigna en el servidor.
          </div>

          <div className="flex flex-col-reverse justify-between gap-3 pt-1 sm:flex-row sm:items-center">
            <Link href="/admin" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#dfe9fc] px-6 py-3 text-sm font-semibold text-brand-navy transition hover:bg-[#d1dff8]">
              <ArrowLeft size={17} aria-hidden="true" /> Cancelar y volver
            </Link>
            <button type="submit" disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-navy px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-navy-light">
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
          {label}<span className="ml-0.5 text-rose-600">*</span>
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
