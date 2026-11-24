import { NextResponse } from "next/server";

export function errorJson(mensaje, status = 400) {
  return NextResponse.json({ ok: false, message: mensaje }, { status, headers: { "Cache-Control": "no-store" } });
}

export function verificarOrigen(request) {
  const origin = request.headers.get("origin");
  const forwarded = request.headers.get("x-forwarded-host") || request.headers.get("host");
  try {
    return Boolean(origin && forwarded && new URL(origin).host.toLowerCase() === forwarded.toLowerCase());
  } catch { return false; }
}

export async function leerJson(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 16000) throw new Error("Solicitud demasiado grande.");
  const text = await request.text();
  if (text.length > 16000) throw new Error("Solicitud demasiado grande.");
  return JSON.parse(text);
}
