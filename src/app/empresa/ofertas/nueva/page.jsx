import { DashboardShell } from "@/components/dashboard-shell";
import { CompanyOfferForm } from "@/components/company-offer-form";

export const metadata = {
  title: "Publicar o editar oferta",
};

export default function NewOfferPage() {
  return (
    <DashboardShell
      role="empresa"
      title="Empresa"
      badge="CORPORATIVO"
      hidePageHeader
    >
      <CompanyOfferForm />
    </DashboardShell>
  );
}