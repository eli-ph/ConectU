import { exigirRol } from "@/server/auth/session";
export default async function AdminLayout({ children }) {
  await exigirRol("admin");
  return children;
}
