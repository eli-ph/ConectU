import { NextResponse } from "next/server";
import { obtenerUsuarioDeRequest } from "@/server/auth/session";
import { verificarOrigen, errorJson } from "@/server/auth/http";
import { ErrorDeNegocio } from "@/server/services/auth.service";
import { guardarCvEstudiante, leerCvEstudiante } from "@/server/services/perfil-estudiante.service";

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
    const { contenido, nombre } = await leerCvEstudiante(usuario.id);
    const seguro = nombre.replace(/["\\\r\n]/g, "_");
    return new NextResponse(new Uint8Array(contenido), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${seguro.replace(/[^\x20-\x7e]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(nombre)}`,
        "Cache-Control": "no-store, private",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "sandbox",
      },
    });
  } catch (error) {
    if (error instanceof ErrorDeNegocio) return errorJson(error.message, error.status);
    console.error("[ConectU] Error leyendo CV:", error?.code || error?.message);
    return errorJson("No pudimos abrir el CV.", 500);
  }
}

export async function POST(request) {
  if (!verificarOrigen(request)) return errorJson("Solicitud no permitida.", 403);
  const usuario = autorizado(request);
  if (!usuario) return errorJson("Inicia sesión como estudiante.", 401);
  if (Number(request.headers.get("content-length") || 0) > 6 * 1024 * 1024)
    return errorJson("El archivo excede el tamaño permitido de 5 MB.", 413);
  try {
    const form = await request.formData();
    const cv = await guardarCvEstudiante(usuario.id, form.get("cv"));
    return NextResponse.json({ ok: true, cv }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ErrorDeNegocio) return errorJson(error.message, error.status);
    console.error("[ConectU] Error guardando CV:", error?.code || error?.message);
    return errorJson("No pudimos guardar el CV. Inténtalo de nuevo.", 500);
  }
}
