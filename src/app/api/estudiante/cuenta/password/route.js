import { NextResponse } from "next/server";
import { obtenerUsuarioDeRequest, borrarCookie } from "@/server/auth/session";
import { verificarOrigen, leerJson, errorJson } from "@/server/auth/http";
import { ErrorDeNegocio } from "@/server/services/auth.service";
import { cambiarContrasenaEstudiante } from "@/server/services/perfil-estudiante.service";

export const runtime = "nodejs";

export async function PUT(request) {
  if (!verificarOrigen(request)) return errorJson("Solicitud no permitida.", 403);
  const usuario = obtenerUsuarioDeRequest(request);
  if (usuario?.rol !== "estudiante" || usuario.email_verificado !== 1)
    return errorJson("Inicia sesión como estudiante.", 401);
  try {
    await cambiarContrasenaEstudiante(usuario.id, await leerJson(request));
    const response = NextResponse.json({ ok: true, redirect: "/ingresar" }, {
      headers: { "Cache-Control": "no-store" },
    });
    return borrarCookie(response);
  } catch (error) {
    if (error instanceof ErrorDeNegocio) return errorJson(error.message, error.status);
    if (error instanceof SyntaxError) return errorJson("Revisa los datos enviados.");
    console.error("[ConectU] Error cambiando contraseña estudiantil:", error?.code || error?.message);
    return errorJson("No pudimos actualizar tu contraseña. Inténtalo nuevamente.", 500);
  }
}
