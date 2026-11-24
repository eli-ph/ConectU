import { exigirRol } from '@/server/auth/session';
import { verCandidatura } from '@/server/services/postulaciones.service';
import { CompanyCandidateDetail } from '@/components/company-candidate-detail';
import { notFound } from 'next/navigation';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const metadata={title:'Detalle de candidatura | ConectU'};
export default async function CandidatePage({params}){
  const user=await exigirRol('empresa');
  let candidate;
  try {candidate=verCandidatura(user,(await params).id);}
  catch(e){if(e.status===404||e.status===400)notFound();throw e;}
  return <CompanyCandidateDetail candidate={candidate}/>;
}
