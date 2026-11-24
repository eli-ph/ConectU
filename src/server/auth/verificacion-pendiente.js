// Autoriza exclusivamente el paso de verificacion; NO crea una sesion de acceso.
// El identificador opaco permanece en una cookie HttpOnly y su hash en SQLite.
import { cookies } from "next/headers";
import { consultarSesion, eliminarSesion, nuevaSesion } from "@/server/auth/session";

export const COOKIE_VERIFICACION = "conectu_verificacion_pendiente";

function desdeToken(token) {
  const usuario = consultarSesion(token);
  if (!usuario || usuario.rol !== "estudiante" || usuario.email_verificado !== 0) return null;
  return usuario;
}

export function verificacionDesdeRequest(request) {
  return desdeToken(request.cookies.get(COOKIE_VERIFICACION)?.value);
}

export async function verificacionActual() {
  const store = await cookies();
  return desdeToken(store.get(COOKIE_VERIFICACION)?.value);
}

export function abrirVerificacion(response, usuarioId, request) {
  // Si el navegador tenia una autorizacion anterior, se revoca antes de crear la nueva.
  const tokenAnterior = request?.cookies.get(COOKIE_VERIFICACION)?.value;
  if (tokenAnterior) eliminarSesion(tokenAnterior);
  const { token, maxAge } = nuevaSesion(usuarioId);
  response.cookies.set(COOKIE_VERIFICACION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return response;
}

export function cerrarVerificacion(response, request) {
  const token = request.cookies.get(COOKIE_VERIFICACION)?.value;
  if (token) eliminarSesion(token);
  response.cookies.set(COOKIE_VERIFICACION, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
