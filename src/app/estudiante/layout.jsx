import { redirect } from "next/navigation";
import { exigirRol } from "@/server/auth/session";

export default async function EstudianteLayout({ children }) {
  const user = await exigirRol("estudiante");
  if (user.email_verificado !== 1) redirect("/ingresar");
  return children;
}
