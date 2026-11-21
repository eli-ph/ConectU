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
          <div className="container-page"><p className="text-sm font-semibold text-brand-gold">Catálogo de oportunidades</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Encuentra tu siguiente experiencia</h1><p className="mt-3 max-w-2xl text-slate-300">Explora ofertas de nivel inicial y filtra las opciones según tu perfil.</p></div>
        </section>
        <section className="container-page py-9 sm:py-12"><OffersCatalog /></section>
      </main>
      <PublicFooter />
    </>
  );
}
