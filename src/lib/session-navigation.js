// Convierte un usuario autenticado en su página principal sin confiar en
// parámetros del navegador. Una cuenta estudiantil sin verificar no obtiene panel.
export function rutaResumenUsuario(user) {
  if (!user || !["estudiante", "empresa", "admin"].includes(user.rol)) return null;
  if (user.rol === "estudiante" && Number(user.email_verificado) !== 1) return null;
  return `/${user.rol}`;
}
