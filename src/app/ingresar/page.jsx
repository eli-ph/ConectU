import Link from "next/link";
import { LockKeyhole, Mail } from "lucide-react";
import { Brand } from "@/components/brand";
import { PublicFooter } from "@/components/public-footer";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <main className="grid flex-1 place-items-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
          <div className="flex justify-center"><Brand /></div>
          <div className="mt-7 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-brand-navy text-brand-gold"><LockKeyhole size={20} /></span><h1 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-brand-navy">Inicia sesión en tu cuenta</h1><p className="mt-2 text-sm text-slate-500">Accede con el correo que utilizaste para registrarte.</p></div>
          <form className="mt-8 space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Correo electrónico</span><span className="relative block"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="email" className="h-12 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm" placeholder="nombre@correo.com" /></span></label>
            <label className="block"><span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700"><span>Contraseña</span><span className="font-medium text-brand-navy">¿Olvidaste tu contraseña?</span></span><input type="password" className="h-12 w-full rounded-lg border border-slate-300 px-3 text-sm" placeholder="Ingresa tu contraseña" /></label>
            <button type="button" className="h-12 w-full rounded-lg bg-brand-navy text-sm font-semibold text-white hover:bg-brand-navy-light">Iniciar sesión</button>
          </form>
          <div className="my-6 flex items-center gap-3"><span className="h-px flex-1 bg-slate-200" /><span className="text-xs text-slate-400">VISTA DE DEMOSTRACIÓN</span><span className="h-px flex-1 bg-slate-200" /></div>
          <div className="grid grid-cols-3 gap-2 text-center"><DemoLink href="/estudiante" label="Estudiante" /><DemoLink href="/empresa" label="Empresa" /><DemoLink href="/admin" label="Admin" /></div>
          <p className="mt-7 text-center text-sm text-slate-500">¿Aún no tienes cuenta? <Link href="/registro" className="font-semibold text-brand-navy">Regístrate</Link></p>
        </div>
      </main>
      <div className="pb-5 text-center"><Link href="/" className="text-sm font-semibold text-brand-navy">Volver al inicio</Link></div>
      <PublicFooter compact />
    </div>
  );
}

function DemoLink({ href, label }) { return <Link href={href} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-600 hover:border-brand-navy hover:text-brand-navy">{label}</Link>; }
