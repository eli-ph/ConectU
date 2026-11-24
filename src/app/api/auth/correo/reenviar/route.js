import { NextResponse } from "next/server";
import { verificarOrigen, errorJson } from "@/server/auth/http";
import { verificacionDesdeRequest } from "@/server/auth/verificacion-pendiente";
import { reenviarCodigo } from "@/server/services/estudiantes.service";
import { ErrorDeNegocio } from "@/server/services/auth.service";

export const runtime = "nodejs";

export async function POST(request) {
  if (!verificarOrigen(request)) return errorJson("Origen no permitido.", 403);
  const usuario = verificacionDesdeRequest(request);
  if (!usuario) return errorJson("Tu sesión de verificación terminó. Inicia sesión para continuar.", 401);
  try {
    await reenviarCodigo(usuario.email);
    return NextResponse.json({ ok: true, message: "Te enviamos un nuevo código. Revisa tu correo." }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof ErrorDeNegocio) {
      if (error.status >= 500) {
        console.error("[ConectU] Error al reenviar código:", error?.name, error?.message);
        return errorJson("No pudimos enviar el código en este momento. Inténtalo de nuevo más tarde.", error.status);
      }
      return errorJson(error.message, error.status);
    }
    console.error("[ConectU] Error inesperado en el reenvío:", error?.name, error?.code, error?.message);
    return errorJson("No pudimos enviar el código en este momento. Inténtalo de nuevo más tarde.", 500);
  }
}
