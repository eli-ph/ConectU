import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";
import { PublicFooter } from "@/components/public-footer";

/** Encabezado ligero compartido por registro y recuperación de acceso. */
export function AuthShell({ children, wide = false, selection = false }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f8fc]">
      <header className="border-b border-slate-200/70 bg-white/90">
        <div className="container-page flex min-h-[76px] items-center justify-between gap-4 py-2">
          <Brand />
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-brand-navy">
            <ArrowLeft size={17} aria-hidden="true" /> <span className="hidden min-[360px]:inline">Volver al inicio</span><span className="min-[360px]:hidden">Volver</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:py-12 lg:py-16">
        <div className={`w-full ${selection ? "max-w-[1320px]" : wide ? "max-w-[820px]" : "max-w-[500px]"}`}>{children}</div>
      </main>
      <PublicFooter compact />
    </div>
  );
}

export function AuthCard({ eyebrow, title, description, children }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(20,43,73,0.075)]">
      <div className="h-1.5 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-navy" />
      <div className="px-5 py-7 sm:px-9 sm:py-9 lg:px-11 lg:py-10">
        {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.13em] text-brand-gold-dark">{eyebrow}</p>}
        <h1 className="text-2xl font-bold leading-tight tracking-[-0.035em] text-brand-navy sm:text-[2rem]">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
