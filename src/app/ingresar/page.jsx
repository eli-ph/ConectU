import Link from "next/link";
import { ArrowLeft, LogIn } from "lucide-react";
import { Brand } from "@/components/brand";
import { PublicFooter } from "@/components/public-footer";
import { LoginForm } from "@/components/login-form";

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
              <LoginForm />
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
