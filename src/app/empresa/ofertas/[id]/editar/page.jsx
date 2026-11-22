import { DashboardShell } from "@/components/dashboard-shell";
import { CompanyOfferForm } from "@/components/company-offer-form";
export const metadata = { title: "Editar oferta" };
export function generateStaticParams() { return ["trainee-software", "analisis-datos", "automatizacion", "frontend", "vnc-2024-089", "vnc-2024-094", "vnc-2024-077", "vnc-2024-102", "vnc-2024-d02", "vnc-2024-032"].map((id) => ({ id })); }
export default async function EditOfferPage({ params }) { await params; return <DashboardShell role="empresa" title="Editar oferta" eyebrow="Actualización de oportunidad"><CompanyOfferForm editing /></DashboardShell>; }
