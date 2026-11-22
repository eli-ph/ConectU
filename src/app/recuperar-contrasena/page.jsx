import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { RecoveryRequestForm } from "@/components/account-recovery-forms";

export const metadata = { title: "Recuperar contraseña" };

export default function RecoverPage() {
  return (
    <AuthShell wide>
      <div className="mx-auto flex w-full max-w-[560px] flex-col justify-center py-4 sm:min-h-[min(720px,calc(100dvh-230px))] sm:py-8">
        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(20,43,73,0.095)]">
          <div className="h-1.5 bg-gradient-to-r from-[#f4ce71] via-brand-gold to-[#f4ce71]" />
          <div className="px-5 py-8 sm:px-9 sm:py-10">
            <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-navy text-white shadow-sm">
              <KeyRound size={28} aria-hidden="true" />
              <span className="absolute -bottom-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-lg bg-[#f3cb68] text-brand-navy shadow-sm"><ShieldCheck size={16} aria-hidden="true" /></span>
            </div>
            <h1 className="mt-7 text-center text-[1.65rem] font-bold leading-tight tracking-[-0.035em] text-brand-navy sm:text-[2rem]">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="mx-auto mt-3 max-w-[450px] text-center text-sm leading-6 text-slate-600 sm:text-base">
              Ingresa el correo electrónico asociado a tu cuenta estudiantil o empresarial. Recibirás un enlace para restablecer tu acceso.
            </p>
            <RecoveryRequestForm />
            <Link href="/ingresar" className="mt-7 flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-brand-navy hover:underline">
              <ArrowLeft size={17} aria-hidden="true" /> Volver a iniciar sesión
            </Link>
          </div>
        </section>
      </div>
    </AuthShell>
  );
}
