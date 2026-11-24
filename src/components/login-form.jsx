"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { AuthForm, PasswordControl } from "@/components/auth-interactions";

async function enviarIngreso(form) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(form.entries())),
  });
  return response.json();
}

export function LoginForm() {
  const [registered, setRegistered] = useState(false);
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRegistered(params.get("registro") === "empresa");
    setVerified(params.get("verificado") === "1");
  }, []);
  return (
    <>
    {verified && <p role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Correo verificado. Ya puedes iniciar sesión.</p>}
    {registered && <p role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      Empresa registrada correctamente. Ya puedes iniciar sesión y consultar el estado de tu revisión administrativa.
    </p>}
    <AuthForm className="mt-8 space-y-5" actionLabel="iniciar sesión" submitAction={enviarIngreso}>
      <div>
        <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-800">Correo electrónico</label>
        <div className="relative">
          <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input id="login-email" name="correo" required type="email" autoComplete="username" className="ui-control h-12" style={{ paddingLeft: "2.75rem" }} placeholder="tu-correo@dominio.com" />
        </div>
      </div>
      <PasswordControl name="password" label="Contraseña" autoComplete="current-password" placeholder="Ingresa tu contraseña" />
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-slate-600"><input type="checkbox" name="recordar" className="h-4 w-4 accent-brand-navy" /> Recordar mi sesión</label>
        <Link href="/recuperar-contrasena" className="font-semibold text-brand-navy hover:underline">¿Olvidaste tu contraseña?</Link>
      </div>
      <button type="submit" className="ui-button-primary w-full justify-center gap-2.5 py-3.5 text-base shadow-[0_5px_13px_rgba(20,43,73,0.15)]">Iniciar sesión <ArrowRight size={18} aria-hidden="true" /></button>
    </AuthForm>
    <p className="mt-3 text-center text-sm text-slate-600">Si todavía no verificaste tu correo, inicia sesión para continuar con la verificación.</p>
    </>
  );
}
