import Link from "next/link";
import { ArrowLeft, ArrowRight, LogIn, Mail } from "lucide-react";
import { Brand } from "@/components/brand";
import { PublicFooter } from "@/components/public-footer";
import { AuthForm, PasswordControl } from "@/components/auth-interactions";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f8fc]">
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-[490px]">
          <section className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(20,43,73,0.075)]">
            <div className="h-1.5 bg-gradient-to-r from-brand-gold via-brand-navy to-brand-gold" />
            <div className="px-5 py-8 sm:px-9 sm:py-10">
              <div className="flex justify-center"><Brand /></div>
              <div className="mt-7 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-navy text-brand-gold shadow-sm"><LogIn size={23} aria-hidden="true" /></span>
                <h1 className="mt-5 text-2xl font-bold tracking-[-0.035em] text-brand-navy sm:text-[1.75rem]">Inicia sesión en tu cuenta</h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">Accede a tu cuenta de estudiante, empresa o administración.</p>
              </div>
              <AuthForm className="mt-8 space-y-5" actionLabel="iniciar sesión">
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
              <div className="mt-8 rounded-xl bg-[#f0f2fc] px-4 py-4 text-center text-sm text-slate-600">
                ¿Aún no tienes cuenta? <Link href="/registro" className="font-bold text-brand-navy underline decoration-brand-gold underline-offset-4">Regístrate aquí</Link>
              </div>
            </div>
          </section>
          <Link href="/" className="mt-6 flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-brand-navy hover:underline"><ArrowLeft size={16} aria-hidden="true" /> Volver al inicio</Link>
        </div>
      </main>
      <PublicFooter compact />
    </div>
  );
}
