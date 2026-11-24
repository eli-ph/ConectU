import { DashboardShell } from "@/components/dashboard-shell";
import { CompanyOfferForm } from "@/components/company-offer-form";
import { obtenerCatalogoHabilidades, obtenerCatalogoEjesAccion } from "@/server/services/catalogos.service";
import { exigirRol } from "@/server/auth/session";
import { resumenOfertasEmpresa } from "@/server/services/ofertas.service";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const metadata={title:"Crear oferta | ConectU"};
export default async function NewOfferPage(){
  const usuario=await exigirRol('empresa');
  const {capacidad}=resumenOfertasEmpresa(usuario);
  return <DashboardShell role="empresa" title="Empresa" badge="CORPORATIVO" hidePageHeader>
    <CompanyOfferForm availableSkills={obtenerCatalogoHabilidades()} availableAxes={obtenerCatalogoEjesAccion()} capacity={capacidad}/>
  </DashboardShell>;
}
