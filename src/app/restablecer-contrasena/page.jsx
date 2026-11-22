import Link from "next/link";
import { ArrowLeft, RotateCcw, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "@/components/account-recovery-forms";

export const metadata = { title: "Restablecer contraseña" };

export default function ResetPage() {
  return (
    <AuthShell wide>
      <div className="mx-auto flex w-full max-w-[660px] flex-col justify-center py-4 sm:min-h-[min(760px,calc(100dvh-230px))] sm:py-8">
        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(20,43,73,0.09)]">
          <div className="h-1.5 bg-gradient-to-r from-brand-gold via-[#e3bf6b] to-brand-gold" />
          <div className="px-5 py-8 sm:px-9 sm:py-10">
            <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-navy text-[#f3cb68] shadow-sm">
              <RotateCcw size={28} aria-hidden="true" />
              <span className="absolute -bottom-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-lg bg-[#f3cb68] text-brand-navy shadow-sm"><ShieldCheck size={16} aria-hidden="true" /></span>
            </div>
            <div className="mt-7 text-center">
              <h1 className="text-[1.7rem] font-bold tracking-[-0.035em] text-brand-navy sm:text-[2rem]">Restablecer tu contraseña</h1>
              <p className="mx-auto mt-3 max-w-[490px] text-sm leading-6 text-slate-600 sm:text-base">
                Establece una nueva contraseña para tu cuenta. El cambio se completará al utilizar un enlace de recuperación válido.
              </p>
            </div>
            <ResetPasswordForm />
            <Link href="/ingresar" className="mt-7 flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-brand-navy hover:underline">
              <ArrowLeft size={17} aria-hidden="true" /> Volver a iniciar sesión
            </Link>
          </div>
        </section>
      </div>
    </AuthShell>
  );
}
