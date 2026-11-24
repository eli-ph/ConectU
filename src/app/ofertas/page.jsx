import { Suspense } from "react";
import { OffersCatalog } from "@/components/offers-catalog";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";
import { obtenerUsuarioActual } from "@/server/auth/session";
import { rutaResumenUsuario } from "@/lib/session-navigation";
import { obtenerCatalogoHabilidades, obtenerCatalogoEjesAccion } from "@/server/services/catalogos.service";
import { obtenerOfertasPublicas } from "@/server/services/ofertas.service";
import { aplicarPromocionesAlCatalogo } from "@/server/repositories/promociones-publicas.repository";
import { misOfertasPostuladas } from "@/server/services/postulaciones.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explorar ofertas",
  description: "Explora oportunidades de empleo inicial, internships, prácticas profesionales y servicio social en ConectU.",
};

export default async function OffersPage() {
  const user = await obtenerUsuarioActual();
  const dashboardHref = rutaResumenUsuario(user);
  const availableSkills = obtenerCatalogoHabilidades();
  return (
    <>
      <PublicHeader />
      <main id="contenido-principal">
        <Suspense fallback={<div className="container-page py-20 text-center text-sm text-slate-600">Preparando el catálogo…</div>}>
          <OffersCatalog dashboardHref={dashboardHref} canApply={user?.rol === "estudiante" && user.email_verificado === 1} appliedOfferIds={misOfertasPostuladas(user)} availableSkills={availableSkills} availableAxes={obtenerCatalogoEjesAccion()} offers={aplicarPromocionesAlCatalogo(obtenerOfertasPublicas())} />
        </Suspense>
      </main>
      <PublicFooter />
    </>
  );
}
