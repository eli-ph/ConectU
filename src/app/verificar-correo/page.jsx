import Link from "next/link";
import { ArrowLeft, BadgeCheck, MailCheck, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { VerificationCodeForm } from "@/components/account-recovery-forms";

export const metadata = { title: "Verificar correo electrónico" };

export default function VerifyEmailPage() {
  return (
    <AuthShell wide>
      <div className="mx-auto w-full max-w-[650px] py-2 sm:py-6">
        <div className="mb-5 grid grid-cols-3 gap-1 rounded-2xl border border-slate-200 bg-[#e9eefb] p-1 text-center text-[0.65rem] font-semibold text-slate-600 sm:text-xs">
          <span className="rounded-xl bg-white px-2 py-2.5 text-brand-navy shadow-sm">
            <span className="mr-1 text-brand-gold">●</span> Correo pendiente
          </span>
          <span className="px-1 py-2.5"><span className="mr-1 text-emerald-500">●</span> Verificado</span>
          <span className="px-1 py-2.5"><span className="mr-1 text-rose-400">●</span> Código vencido</span>
        </div>

        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(20,43,73,0.085)]">
          <div className="h-1.5 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-navy" />
          <div className="px-5 py-8 sm:px-10 sm:py-10">
            <div className="relative mx-auto grid h-[82px] w-[82px] place-items-center rounded-2xl bg-[#e9eefb]">
              <span className="grid h-[58px] w-[58px] place-items-center rounded-xl bg-brand-navy text-white shadow-sm">
                <MailCheck size={30} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-xl bg-[#f3cb68] text-brand-navy shadow-sm">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
            </div>
            <div className="mt-7 text-center">
              <h1 className="text-2xl font-bold tracking-[-0.035em] text-brand-navy sm:text-[2rem]">Verifica tu correo electrónico</h1>
              <p className="mx-auto mt-3 max-w-[460px] text-sm leading-6 text-slate-600 sm:text-base">
                Introduce el código de 6 dígitos que recibas en el correo asociado a tu cuenta de ConectU.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-[#eff2fc] px-4 py-3 text-center text-sm text-slate-600">
              <BadgeCheck size={18} className="text-brand-navy" aria-hidden="true" />
              <span>Verificación del correo registrado</span>
            </div>
            <VerificationCodeForm />
            <Link href="/ingresar" className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e9eefb] px-4 py-3 text-sm font-semibold text-brand-navy transition hover:bg-[#dfe6f8]">
              <ArrowLeft size={17} aria-hidden="true" /> Volver a iniciar sesión
            </Link>
          </div>
        </section>
      </div>
    </AuthShell>
  );
}
