import { NextResponse } from "next/server";
import { verificarOrigen, errorJson } from "@/server/auth/http";
import { borrarCookie, eliminarSesion, COOKIE_NAME } from "@/server/auth/session";
import { cerrarVerificacion } from "@/server/auth/verificacion-pendiente";
export const runtime = "nodejs";
export async function POST(request) {
  if (!verificarOrigen(request)) return errorJson("Origen de solicitud no permitido.", 403);
  eliminarSesion(request.cookies.get(COOKIE_NAME)?.value);
  return cerrarVerificacion(borrarCookie(NextResponse.json({ ok: true })), request);
}
