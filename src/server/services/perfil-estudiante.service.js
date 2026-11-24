import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { checkPassword } from "@/lib/password-policy";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import {
  actualizarCredencialEstudiante,
  actualizarPerfilEstudiante,
  obtenerCatalogosPerfil,
  obtenerCredencialEstudiante,
  obtenerCvEstudiante,
  obtenerPerfilEstudiante,
  reemplazarCvEstudiante,
} from "@/server/repositories/perfil-estudiante.repository";
import { ErrorDeNegocio } from "@/server/services/auth.service";

const MAX_CV_BYTES = 5 * 1024 * 1024;

function texto(value, campo, max = 160) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max)
    throw new ErrorDeNegocio(`Revisa ${campo}.`);
  return value.trim().replace(/\s+/g, " ");
}

function entero(value, campo, min, max) {
  if (!/^\d+$/.test(String(value ?? ""))) throw new ErrorDeNegocio(`Revisa ${campo}.`);
  const numero = Number(value);
  if (!Number.isSafeInteger(numero) || numero < min || numero > max)
    throw new ErrorDeNegocio(`Revisa ${campo}.`);
  return numero;
}

export function consultarCuentaEstudiante(usuarioId) {
  const perfil = obtenerPerfilEstudiante(usuarioId);
  if (!perfil) throw new ErrorDeNegocio("No encontramos tu cuenta estudiantil.", 404);
  return { perfil, catalogos: obtenerCatalogosPerfil() };
}

export function guardarCuentaEstudiante(usuarioId, input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new ErrorDeNegocio("Datos de perfil inválidos.");
  const completo = texto(input.nombreCompleto, "tu nombre", 160).split(" ");
  if (completo.length < 2) throw new ErrorDeNegocio("Escribe tu nombre y apellidos.");
  const numeroCuenta = String(input.numeroCuenta ?? "").trim();
  if (!/^\d{9}$/.test(numeroCuenta))
    throw new ErrorDeNegocio("El número de cuenta debe tener 9 dígitos.");
  const promedio = Number(input.promedio);
  if (input.promedio === "" || input.promedio == null || !Number.isFinite(promedio) || promedio < 0 || promedio > 10)
    throw new ErrorDeNegocio("El promedio debe estar entre 0 y 10.");
  const resumen = String(input.resumen ?? "").trim();
  if (resumen.length > 1500) throw new ErrorDeNegocio("El extracto debe tener como máximo 1500 caracteres.");
  if (!Array.isArray(input.habilidades) || input.habilidades.length > 20 ||
      input.habilidades.some((h) => typeof h !== "string" || h.length > 100) ||
      new Set(input.habilidades.map((h) => h.toLocaleLowerCase("es"))).size !== input.habilidades.length)
    throw new ErrorDeNegocio("Revisa tus habilidades seleccionadas.");

  try {
    const resultado = actualizarPerfilEstudiante(usuarioId, {
      nombre: completo[0], apellidos: completo.slice(1).join(" "), numeroCuenta,
      facultadId: entero(input.facultadId, "la facultad", 1, 2147483647),
      carreraId: entero(input.carreraId, "la carrera", 1, 2147483647),
      semestre: entero(input.semestre, "el semestre", 1, 10), promedio,
      ubicacion: texto(input.ubicacion, "tu ubicación", 160), resumen,
      habilidades: input.habilidades,
    });
    if (resultado.status === "carrera_invalida") throw new ErrorDeNegocio("La carrera no corresponde a la facultad elegida.");
    if (resultado.status === "habilidad_invalida") throw new ErrorDeNegocio("Selecciona habilidades del catálogo disponible.");
    if (resultado.status !== "ok") throw new ErrorDeNegocio("No encontramos tu cuenta estudiantil.", 404);
  } catch (error) {
    if (error.code?.startsWith("SQLITE_CONSTRAINT")) throw new ErrorDeNegocio("Ese número de cuenta ya está registrado.", 409);
    throw error;
  }
  return obtenerPerfilEstudiante(usuarioId);
}

export async function cambiarContrasenaEstudiante(usuarioId, input) {
  const { actual, nueva, confirmar } = input || {};
  if (typeof actual !== "string" || !actual || actual.length > 128 ||
      typeof nueva !== "string" || nueva.length > 128 || !checkPassword(nueva).valid || nueva !== confirmar)
    throw new ErrorDeNegocio("Revisa la contraseña actual, la nueva y su confirmación.");
  const credencial = obtenerCredencialEstudiante(usuarioId);
  if (!credencial) throw new ErrorDeNegocio("No encontramos tu cuenta.", 404);
  if (!await verifyPassword(actual, credencial.password_hash))
    throw new ErrorDeNegocio("La contraseña actual no es correcta.");
  if (actual === nueva) throw new ErrorDeNegocio("La nueva contraseña debe ser diferente de la actual.");
  if (!actualizarCredencialEstudiante(usuarioId, await hashPassword(nueva)))
    throw new ErrorDeNegocio("No pudimos actualizar la contraseña.", 500);
  // El repositorio revoca las sesiones activas al cambiar la contraseña.
  return { ok: true };
}

function carpetaCv() {
  const base = process.env.STORAGE_PATH || "storage";
  return path.resolve(process.cwd(), base, "cv");
}

function rutaSeguraCv(nombreArchivo) {
  // La BD guarda únicamente un identificador aleatorio; nunca una ruta del cliente.
  if (typeof nombreArchivo !== "string" || !/^[0-9a-f-]{36}\.pdf$/.test(nombreArchivo)) return null;
  return path.join(carpetaCv(), nombreArchivo);
}

export async function guardarCvEstudiante(usuarioId, archivo) {
  if (!archivo || typeof archivo.arrayBuffer !== "function" || typeof archivo.name !== "string")
    throw new ErrorDeNegocio("Selecciona un archivo PDF.");
  if (archivo.size === 0 || archivo.size > MAX_CV_BYTES)
    throw new ErrorDeNegocio("El CV debe ser un PDF de hasta 5 MB.");
  if (!/\.pdf$/i.test(archivo.name)) throw new ErrorDeNegocio("El archivo debe tener extensión PDF.");
  const data = Buffer.from(await archivo.arrayBuffer());
  if (data.length !== archivo.size || data.subarray(0, 5).toString("ascii") !== "%PDF-")
    throw new ErrorDeNegocio("El archivo seleccionado no es un PDF válido.");
  const nombre = path.basename(archivo.name).replace(/[\r\n\x00-\x1f]/g, "").slice(0, 160) || "curriculum.pdf";
  const nuevo = `${randomUUID()}.pdf`;
  const ruta = rutaSeguraCv(nuevo);
  await fs.mkdir(carpetaCv(), { recursive: true, mode: 0o700 });
  await fs.writeFile(ruta, data, { flag: "wx", mode: 0o600 });
  let anterior;
  try {
    anterior = reemplazarCvEstudiante(usuarioId, nuevo, nombre);
    if (anterior === null) throw new ErrorDeNegocio("No encontramos tu cuenta estudiantil.", 404);
  } catch (error) {
    await fs.unlink(ruta).catch(() => {});
    throw error;
  }
  const antiguaRuta = rutaSeguraCv(anterior.anterior);
  if (antiguaRuta && antiguaRuta !== ruta) {
    try { await fs.unlink(antiguaRuta); }
    catch (error) { if (error.code !== "ENOENT") console.error("[ConectU] No se pudo limpiar el CV anterior:", error.code); }
  }
  return obtenerPerfilEstudiante(usuarioId)?.cv;
}

export async function leerCvEstudiante(usuarioId) {
  const cv = obtenerCvEstudiante(usuarioId);
  if (!cv?.archivo) throw new ErrorDeNegocio("Todavía no has cargado un CV.", 404);
  const ruta = rutaSeguraCv(cv.archivo);
  if (!ruta) throw new ErrorDeNegocio("No fue posible localizar tu CV.", 404);
  let contenido;
  try { contenido = await fs.readFile(ruta); }
  catch (error) { if (error.code === "ENOENT") throw new ErrorDeNegocio("El CV no está disponible. Vuelve a cargarlo.", 404); throw error; }
  return { contenido, nombre: cv.nombre || "curriculum.pdf" };
}
