// El encabezado público comprueba la sesión en el servidor para no aparentar
// que el usuario cerró sesión al navegar desde el panel a /ofertas.
import { obtenerUsuarioActual } from "@/server/auth/session";
import { rutaResumenUsuario } from "@/lib/session-navigation";
import { PublicHeaderClient } from "@/components/public-header-client";

export async function PublicHeader({ compact = false }) {
  const user = await obtenerUsuarioActual();
  return <PublicHeaderClient compact={compact} dashboardHref={rutaResumenUsuario(user)} />;
}
