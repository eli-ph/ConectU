import { DashboardShell } from "@/components/dashboard-shell";
import { CompanyOfferForm } from "@/components/company-offer-form";
export const metadata = { title: "Editar oferta" };
export function generateStaticParams() { return [{ id: "trainee-software" }, { id: "analisis-datos" }, { id: "automatizacion" }, { id: "frontend" }]; }
export default async function EditOfferPage({ params }) { await params; return <DashboardShell role="empresa" title="Editar oferta" eyebrow="Actualización de oportunidad"><CompanyOfferForm editing /></DashboardShell>; }
