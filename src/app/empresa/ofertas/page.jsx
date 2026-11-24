import CompanyOffersList from "@/components/company-offers-list";
import { exigirRol } from "@/server/auth/session";
import { resumenOfertasEmpresa,hoyMexico } from "@/server/services/ofertas.service";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const metadata={title:"Mis ofertas | ConectU"};
export default async function CompanyOffersPage({searchParams}){
  const user=await exigirRol("empresa");
  const {ofertas,capacidad}=resumenOfertasEmpresa(user);
  const query=await searchParams;
  const borrador=query?.guardada==='1';
  const text=borrador?'Borrador guardado correctamente.':query?.guardada==='publicada'?'Oferta publicada correctamente.':query?.eliminada==='1'?'Oferta eliminada correctamente.':'';
  return <CompanyOffersList records={ofertas} capacity={capacidad} hoy={hoyMexico()}
      initialTab={borrador?'Borradores':'Activas'} initialMessage={text}
      initialExtendId={query?.extender ?? null}/>;
}
