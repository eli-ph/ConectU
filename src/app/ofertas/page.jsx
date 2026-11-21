import { Search } from "lucide-react";
import { OffersCatalog } from "@/components/offers-catalog";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";

export const metadata = { title: "Ofertas" };

export default function OffersPage() {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="bg-brand-navy-dark py-12 text-white sm:py-16">
          <div className="container-catalog"><p className="text-xs font-medium text-slate-300">Inicio&nbsp;&nbsp;›&nbsp;&nbsp;<span className="font-semibold text-brand-gold">Catálogo de oportunidades</span></p><h1 className="mt-6 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Catálogo de oportunidades profesionales</h1><p className="mt-3 max-w-3xl text-slate-300">Conecta con ofertas de empleo inicial, prácticas, becariado y servicio social.</p><form action="#catalogo" className="mt-7 flex max-w-3xl flex-col gap-2 rounded-xl bg-white p-2 shadow-xl sm:flex-row"><label className="relative min-w-0 flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} /><span className="sr-only">Buscar oportunidades</span><input name="q" className="h-12 w-full rounded-lg bg-white pl-12 pr-4 text-sm text-slate-900" placeholder="Buscar por puesto, tecnología, empresa o ubicación" /></label><button className="h-12 shrink-0 rounded-lg bg-brand-navy px-6 text-sm font-semibold text-white">Explorar</button></form></div>
        </section>
        <section id="catalogo" className="container-catalog py-9 sm:py-12"><OffersCatalog /></section>
      </main>
      <PublicFooter />
    </>
  );
}
