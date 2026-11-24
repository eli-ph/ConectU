import { NextResponse } from "next/server";
import { verificarOrigen, leerJson, errorJson } from "@/server/auth/http";
import { autenticar, ErrorDeNegocio } from "@/server/services/auth.service";
import { asignarCookie, nuevaSesion } from "@/server/auth/session";
import { abrirVerificacion, cerrarVerificacion } from "@/server/auth/verificacion-pendiente";

export const runtime = "nodejs";

export async function POST(request) {
  if (!verificarOrigen(request)) return errorJson("Origen de solicitud no permitido.", 403);
  try {
    const body = await leerJson(request);
    const user = await autenticar(body.correo, body.password);
    const response = NextResponse.json({
      ok: true,
      redirect: user.rol === "estudiante" && user.email_verificado !== 1
        ? "/verificar-correo"
        : `/${user.rol}`,
    }, { headers: { "Cache-Control": "no-store" } });

    if (user.rol === "estudiante" && user.email_verificado !== 1) {
      // La contraseña era correcta, pero aún falta verificar correo.
      // Cookie separada: no concede acceso a los módulos de estudiante.
      return abrirVerificacion(response, user.id, request);
    }
    // Si había una verificación pendiente anterior, se revoca al entrar normalmente.
    cerrarVerificacion(response, request);
    return asignarCookie(response, nuevaSesion(user.id, body.recordar === "on"));
  } catch (error) {
    if (error instanceof ErrorDeNegocio) return errorJson(error.message, error.status);
    if (error instanceof SyntaxError) return errorJson("Solicitud inválida.");
    console.error("[ConectU] Error de acceso:", error?.name);
    return errorJson("No se pudo iniciar sesión.", 500);
  }
}
