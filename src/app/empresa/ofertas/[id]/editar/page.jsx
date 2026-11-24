import { DashboardShell } from "@/components/dashboard-shell";
import { CompanyOfferForm } from "@/components/company-offer-form";
import { obtenerCatalogoHabilidades, obtenerCatalogoEjesAccion } from "@/server/services/catalogos.service";
import { exigirRol } from "@/server/auth/session";
import { resumenOfertasEmpresa,detalleOfertaEmpresa } from "@/server/services/ofertas.service";
import { notFound } from "next/navigation";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const metadata={title:"Editar oferta | ConectU"};
export default async function EditOfferPage({params}){
  const usuario=await exigirRol('empresa');
  const {id}=await params;
  let offer;try{offer=detalleOfertaEmpresa(usuario,id);}catch(e){if(e.status===404||e.status===400)notFound();throw e;}
  const {capacidad}=resumenOfertasEmpresa(usuario);
  return <DashboardShell role="empresa" title="Editar oferta" eyebrow="Actualización de oportunidad" hidePageHeader>
    <CompanyOfferForm editing availableSkills={obtenerCatalogoHabilidades()} availableAxes={obtenerCatalogoEjesAccion()} initialOffer={offer} capacity={capacidad}/>
  </DashboardShell>;
}
