import { CompanyCandidateDetail } from "@/components/company-candidate-detail";
export const metadata = { title: "Detalle de candidatura" };
export function generateStaticParams() { return ["candidato-1", "candidato-2", "candidato-3"].map((id) => ({ id })); }
export default async function CandidatePage({ params }) { const { id } = await params; return <CompanyCandidateDetail id={id} />; }
