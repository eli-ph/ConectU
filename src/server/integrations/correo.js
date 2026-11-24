// Proveedor de correo transaccional ConectU: Gmail API + OAuth 2.0 por HTTPS.
// Módulo exclusivamente de servidor. No expone secretos al cliente ni usa SMTP.
import { randomBytes } from "node:crypto";

const GMAIL_SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
let tokenCache = null;

function configuracion() {
  const clientId = process.env.GMAIL_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.GMAIL_CLIENT_SECRET?.trim() || "";
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN?.trim() || "";
  const from = process.env.GMAIL_FROM_EMAIL?.trim() || "";
  const values = [clientId, clientSecret, refreshToken, from];
  const tieneAlguna = values.some(Boolean);
  const completa = values.every(Boolean) && esEmail(from);
  return { clientId, clientSecret, refreshToken, from, tieneAlguna, completa };
}

function esEmail(value) {
  return typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@<>\x00-\x1f\x7f]+@[^\s@<>\x00-\x1f\x7f]+\.[^\s@<>\x00-\x1f\x7f]+$/.test(value);
}

export function correoEnModoPrueba() {
  const c = configuracion();
  return !c.tieneAlguna && process.env.NODE_ENV !== "production" && process.env.DEV_VERIFICATION_CODES === "1";
}

export function correoDisponible() {
  const c = configuracion();
  return c.completa || correoEnModoPrueba();
}

function encodeHeader(value) {
  // RFC 2047 para encabezados que contienen acentos; nunca introducir CR/LF.
  if (/[\r\n]/.test(value)) throw new Error("Encabezado de correo inválido.");
  return /^[\x20-\x7e]*$/.test(value)
    ? value
    : `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function wrapBase64(value) {
  return Buffer.from(value, "utf8").toString("base64").replace(/.{1,76}/g, "$&\r\n").trimEnd();
}

function construirMensaje({ to, from, subject, text, html }) {
  if (!esEmail(to) || !esEmail(from) || typeof subject !== "string" || !subject.trim() ||
      typeof text !== "string" || typeof html !== "string") {
    throw new Error("Datos de correo inválidos.");
  }
  const boundary = `conectu_${randomBytes(16).toString("hex")}`;
  const mime = [
    `From: "ConectU" <${from}>`,
    `To: <${to}>`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(text),
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(html),
    `--${boundary}--`,
    "",
  ].join("\r\n");
  return Buffer.from(mime, "utf8").toString("base64url");
}

async function obtenerAccessToken(c, forzar = false) {
  // Caché por proceso para evitar una solicitud OAuth por cada correo.
  const key = `${c.clientId}|${c.refreshToken}`;
  if (!forzar && tokenCache?.key === key && tokenCache.expira > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }
  let response;
  try {
    response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: c.clientId,
        client_secret: c.clientSecret,
        refresh_token: c.refreshToken,
        grant_type: "refresh_token",
      }).toString(),
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
  } catch (error) {
    console.error("[ConectU] Error de conexión con Google OAuth:", error?.name || "Error");
    throw new Error("No fue posible autorizar el servicio de correo.");
  }
  if (!response.ok) {
    console.error("[ConectU] Google OAuth rechazó la renovación (HTTP):", response.status);
    throw new Error("No fue posible renovar la autorización de Gmail.");
  }
  const json = await response.json().catch(() => ({}));
  if (typeof json.access_token !== "string" || !json.access_token || !(Number(json.expires_in) > 0)) {
    throw new Error("La respuesta de autorización de Gmail no es válida.");
  }
  tokenCache = { key, accessToken: json.access_token, expira: Date.now() + Number(json.expires_in) * 1000 };
  return json.access_token;
}

async function publicarMensaje(raw, c) {
  for (let intento = 0; intento < 2; intento++) {
    const accessToken = await obtenerAccessToken(c, intento === 1);
    let response;
    try {
      response = await fetch(GMAIL_SEND_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
        signal: AbortSignal.timeout(12000),
        cache: "no-store",
      });
    } catch (error) {
      console.error("[ConectU] Error de conexión con Gmail API:", error?.name || "Error");
      throw new Error("No se pudo conectar con Gmail API.");
    }
    // Token revocado/expirado antes de tiempo: renovar una sola vez.
    if (response.status === 401 && intento === 0) {
      tokenCache = null;
      continue;
    }
    if (!response.ok) {
      console.error("[ConectU] Gmail API rechazó el envío (HTTP):", response.status);
      throw new Error("Gmail rechazó el envío del correo.");
    }
    const data = await response.json().catch(() => ({}));
    if (typeof data.id !== "string" || !data.id) throw new Error("Gmail no confirmó el identificador del mensaje.");
    return { modo: "gmail", id: data.id };
  }
  throw new Error("No se pudo autorizar el envío con Gmail.");
}

/** Correo genérico, reutilizable para recuperación de contraseña y avisos. */
export async function enviarCorreo({ email, subject, text, html }) {
  const c = configuracion();
  if (!c.completa) throw new Error("Gmail no está configurado. Revisa GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN y GMAIL_FROM_EMAIL.");
  const raw = construirMensaje({ to: email, from: c.from, subject, text, html });
  return publicarMensaje(raw, c);
}

function contenidoHtml(code) {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"></head>
<body style="background:#f8fafc;color:#142b49;font-family:Arial,Helvetica,sans-serif;margin:0;padding:24px">
  <main style="max-width:520px;margin:auto;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:32px">
    <p style="font-size:24px;font-weight:700;margin:0 0 18px">Conect<span style="color:#c49a3a">U</span></p>
    <h1 style="font-size:21px;margin:0 0 12px">Verifica tu correo electrónico</h1>
    <p style="line-height:1.6;color:#475569">Introduce este código en la página de verificación de ConectU:</p>
    <p style="letter-spacing:8px;font-size:34px;font-weight:700;text-align:center;background:#f1f5f9;border-radius:10px;padding:20px 12px">${code}</p>
    <p style="font-size:14px;color:#475569;line-height:1.6">El código vence en <strong>10 minutos</strong>. Si no solicitaste crear una cuenta, puedes ignorar este mensaje.</p>
    <p style="font-size:12px;color:#64748b;margin-top:24px">ConectU es una plataforma independiente. No es un servicio oficial de la UNAM.</p>
  </main>
</body></html>`;
}

/** API existente usada por estudiantes.service.js: sin cambios en UI ni en SQLite. */
export async function enviarCodigoVerificacion({ email, code }) {
  if (!/^[0-9]{6}$/.test(String(code)) || !esEmail(email)) {
    throw new Error("Datos de verificación inválidos.");
  }
  if (!correoDisponible()) {
    throw new Error("No hay proveedor de correo configurado para ConectU.");
  }
  if (correoEnModoPrueba()) {
    console.info(`[ConectU][DEV] Código de verificación para ${email}: ${code} (10 minutos)`);
    return { modo: "local" };
  }
  return enviarCorreo({
    email,
    subject: "ConectU | Código de verificación",
    text: `Tu código de verificación de ConectU es ${code}. Vence en 10 minutos. Si no solicitaste el registro, ignora este correo. ConectU no es un servicio oficial de la UNAM.`,
    html: contenidoHtml(code),
  });
}
