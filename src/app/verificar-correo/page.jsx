import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { VerificationCodeForm } from "@/components/account-recovery-forms";
import { correoEnModoPrueba } from "@/server/integrations/correo";
import { verificacionActual } from "@/server/auth/verificacion-pendiente";

export const runtime = "nodejs";
export const metadata = { title: "Verificar correo | ConectU" };

export default async function VerifyEmailPage({ searchParams }) {
  const usuario = await verificacionActual();
  // Una visita directa sin un registro/autenticacion pendiente no habilita esta vista.
  if (!usuario) redirect("/ingresar");
  const params = await searchParams;
  const envioPendiente = params?.envio === "pendiente";

  return (
    <AuthShell wide>
      <div className="mx-auto w-full max-w-[650px] py-2 sm:py-6">
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
                Introduce el código de seis dígitos que enviamos a tu correo para activar tu cuenta.
              </p>
            </div>
            {envioPendiente && (
              <p role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                No pudimos enviar el primer código. Puedes solicitar otro con «Reenviar código».
              </p>
            )}
            <VerificationCodeForm correo={usuario.email} devMode={correoEnModoPrueba()} />
            <Link href="/ingresar" className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e9eefb] px-4 py-3 text-sm font-semibold text-brand-navy transition hover:bg-[#dfe6f8]">
              <ArrowLeft size={17} aria-hidden="true" /> Volver a iniciar sesión
            </Link>
          </div>
        </section>
      </div>
    </AuthShell>
  );
}
