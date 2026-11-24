import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDatabase } from "@/server/db/sqlite";

export const COOKIE_NAME = "conectu_session";
const NORMAL_HOURS = 12;
const REMEMBER_DAYS = 7;
const hashToken = (token) => createHash("sha256").update(token).digest("hex");

export function nuevaSesion(usuarioId, recordar = false) {
  const token = randomBytes(32).toString("hex");
  const maxAge = recordar ? REMEMBER_DAYS * 86400 : NORMAL_HOURS * 3600;
  const expira = new Date(Date.now() + maxAge * 1000).toISOString();
  const db = getDatabase();
  db.prepare("DELETE FROM USUARIO_SESIONES WHERE expira_en <= ?").run(new Date().toISOString());
  db.prepare("INSERT INTO USUARIO_SESIONES(token_hash, usuario_id, expira_en) VALUES (?, ?, ?)")
    .run(hashToken(token), usuarioId, expira);
  return { token, maxAge };
}

export function eliminarSesion(token) {
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return;
  getDatabase().prepare("DELETE FROM USUARIO_SESIONES WHERE token_hash = ?").run(hashToken(token));
}

export function consultarSesion(token) {
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return null;
  const db = getDatabase();
  return db.prepare(`
    SELECT u.id, u.nombre, u.apellidos, u.email, u.rol, u.email_verificado, u.activo, u.created_at,
           e.id AS empresa_id, e.nombre_comercial, e.razon_social, e.rfc,
           e.tipo_contribuyente, e.sector, e.tamano, e.sitio_web, e.telefono,
           e.contacto_nombre, e.contacto_cargo, e.descripcion, e.ciudad, e.entidad,
           e.motivo_rechazo, e.estado_verificacion, cp.nombre AS plan_nombre,
           subs.fecha_fin AS plan_fecha_fin
      FROM USUARIO_SESIONES s
      JOIN USUARIOS u ON u.id = s.usuario_id
      LEFT JOIN EMPRESAS e ON e.usuario_id = u.id
      LEFT JOIN SUSCRIPCIONES subs ON subs.empresa_id = e.id AND subs.estado = 'activa'
      LEFT JOIN CATALOGO_PLANES cp ON cp.id = subs.plan_id
     WHERE s.token_hash = ? AND s.expira_en > ? AND u.activo = 1
  `).get(hashToken(token), new Date().toISOString()) ?? null;
}

export function obtenerUsuarioDeRequest(request) {
  return consultarSesion(request.cookies.get(COOKIE_NAME)?.value);
}

export async function obtenerUsuarioActual() {
  const cookieStore = await cookies();
  return consultarSesion(cookieStore.get(COOKIE_NAME)?.value);
}

export async function exigirRol(rol) {
  const user = await obtenerUsuarioActual();
  if (!user) redirect("/ingresar");
  if (user.rol !== rol) redirect(`/${user.rol}`);
  return user;
}

export function asignarCookie(response, { token, maxAge }) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return response;
}

export function borrarCookie(response) {
  response.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", sameSite: "lax", maxAge: 0 });
  return response;
}
