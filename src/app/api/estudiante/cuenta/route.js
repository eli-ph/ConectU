import { NextResponse } from "next/server";
import { obtenerUsuarioDeRequest } from "@/server/auth/session";
import { verificarOrigen, leerJson, errorJson } from "@/server/auth/http";
import { ErrorDeNegocio } from "@/server/services/auth.service";
import { consultarCuentaEstudiante, guardarCuentaEstudiante } from "@/server/services/perfil-estudiante.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function autorizado(request) {
  const usuario = obtenerUsuarioDeRequest(request);
  return usuario?.rol === "estudiante" && usuario.email_verificado === 1 ? usuario : null;
}

export async function GET(request) {
  const usuario = autorizado(request);
  if (!usuario) return errorJson("Inicia sesión como estudiante.", 401);
  try {
    const datos = consultarCuentaEstudiante(usuario.id);
    return NextResponse.json({ ok: true, ...datos }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ErrorDeNegocio) return errorJson(error.message, error.status);
    console.error("[ConectU] Error consultando perfil estudiantil:", error?.code || error?.message);
    return errorJson("No pudimos cargar tu información. Inténtalo de nuevo.", 500);
  }
}

export async function PUT(request) {
  if (!verificarOrigen(request)) return errorJson("Solicitud no permitida.", 403);
  const usuario = autorizado(request);
  if (!usuario) return errorJson("Inicia sesión como estudiante.", 401);
  try {
    const perfil = guardarCuentaEstudiante(usuario.id, await leerJson(request));
    return NextResponse.json({ ok: true, perfil }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ErrorDeNegocio) return errorJson(error.message, error.status);
    if (error instanceof SyntaxError) return errorJson("Revisa los datos enviados.");
    console.error("[ConectU] Error guardando perfil:", error?.code || error?.message);
    return errorJson("No pudimos guardar los cambios. Inténtalo nuevamente.", 500);
  }
}
