import { NextResponse } from "next/server";
import { verificarOrigen, errorJson, leerJson } from "@/server/auth/http";
import { confirmarCorreo } from "@/server/services/estudiantes.service";
import { ErrorDeNegocio } from "@/server/services/auth.service";
import { cerrarVerificacion, verificacionDesdeRequest } from "@/server/auth/verificacion-pendiente";

export const runtime = "nodejs";

export async function POST(request) {
  if (!verificarOrigen(request)) return errorJson("Origen no permitido.", 403);
  const usuario = verificacionDesdeRequest(request);
  if (!usuario) return errorJson("Tu sesión de verificación terminó. Inicia sesión para continuar.", 401);
  try {
    const data = await leerJson(request);
    confirmarCorreo(usuario.email, data.codigo);
    const response = NextResponse.json({
      ok: true,
      message: "¡Tu correo está verificado! Ya puedes iniciar sesión.",
      redirect: "/ingresar?verificado=1",
    }, { headers: { "Cache-Control": "no-store" } });
    return cerrarVerificacion(response, request);
  } catch (error) {
    if (error instanceof ErrorDeNegocio) return errorJson(error.message, error.status);
    if (error instanceof SyntaxError) return errorJson("Solicitud inválida.");
    console.error("[ConectU] Error verificando correo:", error?.name, error?.code);
    return errorJson("No pudimos verificar el código. Inténtalo nuevamente.", 500);
  }
}
