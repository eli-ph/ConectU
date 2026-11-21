import Link from "next/link";
import { Brand } from "@/components/brand";
import { PublicFooter } from "@/components/public-footer";

export function AuthShell({ children, wide = false }) {
  return <div className="flex min-h-screen flex-col bg-page">
    <header className="border-b border-slate-200 bg-white"><div className="container-page flex min-h-[72px] items-center justify-between gap-4 py-3"><Brand /><Link href="/" className="text-sm font-semibold text-brand-navy">Volver al inicio</Link></div></header>
    <main className="flex flex-1 items-start justify-center px-3 py-8 sm:px-6 sm:py-12"><div className={`w-full ${wide ? "max-w-5xl" : "max-w-md"}`}>{children}</div></main>
    <PublicFooter compact />
  </div>;
}

export function AuthCard({ eyebrow, title, description, children }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"><div className="h-1 bg-brand-gold" /><div className="p-6 sm:p-8">{eyebrow && <p className="text-center text-xs font-bold uppercase tracking-[0.12em] text-brand-gold">{eyebrow}</p>}<h1 className="mt-2 text-center text-2xl font-bold tracking-[-0.03em] text-brand-navy sm:text-3xl">{title}</h1>{description && <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-6 text-slate-500">{description}</p>}<div className="mt-7">{children}</div></div></section>;
}
