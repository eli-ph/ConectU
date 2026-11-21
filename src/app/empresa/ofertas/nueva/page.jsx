import { DashboardShell } from "@/components/dashboard-shell";
import { CompanyOfferForm } from "@/components/company-offer-form";
export const metadata = { title: "Crear oferta" };
export default function NewOfferPage() { return <DashboardShell role="empresa" title="Crear nueva oferta" eyebrow="Publicación de oportunidad"><CompanyOfferForm /></DashboardShell>; }
