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
          <div className="container-page"><p className="text-xs font-medium text-slate-300">Inicio&nbsp;&nbsp;›&nbsp;&nbsp;<span className="font-semibold text-brand-gold">Catálogo de oportunidades</span></p><h1 className="mt-6 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Catálogo de oportunidades profesionales</h1><p className="mt-3 max-w-3xl text-slate-300">Conecta con ofertas de empleo inicial, prácticas, becariado y servicio social.</p><form action="#catalogo" className="relative mt-7 max-w-3xl"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} /><input name="q" className="h-14 w-full rounded-xl bg-white pl-12 pr-32 text-sm text-slate-900 shadow-xl" placeholder="Buscar por puesto, tecnología, empresa o ubicación" /><button className="absolute right-1.5 top-1.5 h-11 rounded-lg bg-brand-navy px-6 text-sm font-semibold text-white">Explorar</button></form></div>
        </section>
        <section id="catalogo" className="container-page py-9 sm:py-12"><OffersCatalog /></section>
      </main>
      <PublicFooter />
    </>
  );
}
