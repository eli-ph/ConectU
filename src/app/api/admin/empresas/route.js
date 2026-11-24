import { NextResponse } from "next/server";
import { obtenerUsuarioDeRequest } from "@/server/auth/session";
import { verificarOrigen, leerJson, errorJson } from "@/server/auth/http";
import { empresasParaAdmin, decidirEmpresa } from "@/server/services/empresas.service";
import { ErrorDeNegocio } from "@/server/services/auth.service";
export const runtime = "nodejs";

export async function GET(request) {
  const user = obtenerUsuarioDeRequest(request);
  if (user?.rol !== "admin") return errorJson("Acceso denegado.", 403);
  return NextResponse.json({ ok: true, empresas: empresasParaAdmin(user) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  if (!verificarOrigen(request)) return errorJson("Origen de solicitud no permitido.", 403);
  const user = obtenerUsuarioDeRequest(request);
  if (user?.rol !== "admin") return errorJson("Acceso denegado.", 403);
  try {
    const result = decidirEmpresa(user, await leerJson(request));
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ErrorDeNegocio) return errorJson(error.message, error.status);
    if (error instanceof SyntaxError) return errorJson("Solicitud inválida.");
    console.error("Error al revisar empresa:", error.name);
    return errorJson("No fue posible completar la revisión.", 500);
  }
}
