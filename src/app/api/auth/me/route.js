import { NextResponse } from "next/server";
import { obtenerUsuarioDeRequest } from "@/server/auth/session";
export const runtime = "nodejs";
export async function GET(request) {
  const user = obtenerUsuarioDeRequest(request);
  return NextResponse.json({ ok: Boolean(user), user: user ?? null }, {
    status: user ? 200 : 401,
    headers: { "Cache-Control": "no-store" },
  });
}
