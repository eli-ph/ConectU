import { NextResponse } from "next/server";
import { verificarOrigen, leerJson, errorJson } from "@/server/auth/http";
import { registrarEmpresa, ErrorDeNegocio } from "@/server/services/auth.service";
export const runtime = "nodejs";

export async function POST(request) {
  if (!verificarOrigen(request)) return errorJson("Origen de solicitud no permitido.", 403);
  try {
    const result = await registrarEmpresa(await leerJson(request));
    return NextResponse.json({ ok: true, empresaId: result.empresaId, redirect: "/ingresar?registro=empresa" }, { status: 201 });
  } catch (error) {
    if (error instanceof ErrorDeNegocio) return errorJson(error.message, error.status);
    if (error instanceof SyntaxError) return errorJson("Formato de solicitud inválido.");
    console.error("Error al registrar empresa:", error.name);
    return errorJson("No se pudo registrar la empresa. Intenta nuevamente.", 500);
  }
}
