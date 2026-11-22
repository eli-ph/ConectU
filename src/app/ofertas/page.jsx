import { Suspense } from "react";
import { OffersCatalog } from "@/components/offers-catalog";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";

export const metadata = {
  title: "Explorar ofertas",
  description: "Explora oportunidades de empleo inicial, internships, prácticas profesionales y servicio social en ConectU.",
};

export default function OffersPage() {
  return (
    <>
      <PublicHeader />
      <main id="contenido-principal">
        <Suspense fallback={<div className="container-page py-20 text-center text-sm text-slate-600">Preparando el catálogo…</div>}>
          <OffersCatalog />
        </Suspense>
      </main>
      <PublicFooter />
    </>
  );
}
