import { exigirRol } from "@/server/auth/session";
export default async function EmpresaLayout({ children }) {
  await exigirRol("empresa");
  return children;
}
