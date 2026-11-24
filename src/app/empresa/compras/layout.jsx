import { exigirRol } from "@/server/auth/session";
import { redirect } from "next/navigation";
export default async function EmpresaAprobadaLayout({ children }) {
  const empresa = await exigirRol("empresa");
  if (empresa.estado_verificacion !== "aprobada") redirect("/empresa?acceso=pendiente");
  return children;
}
