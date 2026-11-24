import { catalogosAcademicosRegistro } from "@/server/repositories/estudiantes.repository";
import StudentRegisterForm from "@/components/student-register-form";
export const runtime = "nodejs";
export default function StudentRegisterPage() {
  const { facultades, carreras } = catalogosAcademicosRegistro();
  return <StudentRegisterForm faculties={facultades} careers={carreras} />;
}
