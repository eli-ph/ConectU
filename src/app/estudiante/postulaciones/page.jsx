import { exigirRol } from '@/server/auth/session';
import { misPostulaciones } from '@/server/services/postulaciones.service';
import { StudentApplications } from '@/components/student-applications';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const metadata={title:'Mis postulaciones | ConectU'};
export default async function PostulacionesEstudiantePage(){
  const usuario=await exigirRol('estudiante');
  return <StudentApplications initialApplications={misPostulaciones(usuario)}/>;
}
