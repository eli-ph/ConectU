import { NextResponse } from "next/server";
import { verificarOrigen, leerJson, errorJson } from "@/server/auth/http";
import { registrarEstudiante } from "@/server/services/estudiantes.service";
import { abrirVerificacion } from "@/server/auth/verificacion-pendiente";
import { ErrorDeNegocio } from "@/server/services/auth.service";

export const runtime = "nodejs";

export async function POST(request) {
  if (!verificarOrigen(request)) return errorJson("Origen de solicitud no permitido.", 403);
  try {
    const resultado = await registrarEstudiante(await leerJson(request));
    const redirect = resultado.correoEnviado
      ? "/verificar-correo"
      : "/verificar-correo?envio=pendiente";
    // Permiso temporal para verificar ESTE registro; no inicia una sesion de estudiante.
    const respuesta = NextResponse.json({ ok: true, redirect }, {
      status: 201, headers: { "Cache-Control": "no-store" },
    });
    return abrirVerificacion(respuesta, resultado.usuarioId, request);
  } catch (error) {
    if (error instanceof ErrorDeNegocio) return errorJson(error.message, error.status);
    if (error instanceof SyntaxError) return errorJson("Solicitud inválida.");
    console.error("[ConectU] Error registrando estudiante:", error?.code || error?.name, error?.message);
    return errorJson("No pudimos completar el registro. Inténtalo nuevamente.", 500);
  }
}
