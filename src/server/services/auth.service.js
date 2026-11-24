import { checkPassword } from "@/lib/password-policy";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { crearEmpresaConUsuario, limpiarErroresLogin, loginBloqueado, registrarErrorLogin, usuarioPorEmail } from "@/server/repositories/auth.repository";

export class ErrorDeNegocio extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

function string(obj, key, max = 200, required = true) {
  const value = obj?.[key];
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) {
    throw new ErrorDeNegocio(`Revisa el campo ${key.replaceAll("_", " ")}.`);
  }
  return value.trim();
}

export async function registrarEmpresa(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new ErrorDeNegocio("Datos inválidos.");
  const razon_social = string(data, "razon_social");
  const nombre_comercial = string(data, "nombre_comercial");
  const tipo_contribuyente = string(data, "tipo_contribuyente", 8);
  if (!["fisica", "moral"].includes(tipo_contribuyente)) throw new ErrorDeNegocio("Tipo de contribuyente inválido.");
  const rfc = string(data, "rfc", 13).toUpperCase();
  const count = tipo_contribuyente === "fisica" ? 13 : 12;
  if (rfc.length !== count || !/^[A-ZÑ&0-9]+$/.test(rfc)) throw new ErrorDeNegocio("Revisa el RFC y el tipo de contribuyente.");
  const contacto = string(data, "contacto", 120).replace(/\s+/g, " ");
  const names = contacto.split(" ");
  if (names.length < 2) throw new ErrorDeNegocio("Ingresa nombre y apellidos del contacto.");
  const email = string(data, "correo", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ErrorDeNegocio("Correo no válido.");
  const password = data.password;
  if (typeof password !== "string" || password.length > 128 || !checkPassword(password).valid) throw new ErrorDeNegocio("La contraseña no cumple los requisitos.");
  if (password !== data.confirm_password) throw new ErrorDeNegocio("Las contraseñas no coinciden.");
  if (data.acepta_terminos !== "on") throw new ErrorDeNegocio("Debes aceptar los términos y el aviso de privacidad.");
  const tamano = string(data, "tamano", 8, false);
  if (tamano && !["micro", "pequena", "mediana", "grande"].includes(tamano)) throw new ErrorDeNegocio("Tamaño de empresa inválido.");
  const sitio_web = string(data, "sitio_web", 250, false);
  if (sitio_web) {
    try { if (!["https:", "http:"].includes(new URL(sitio_web).protocol)) throw new Error(); }
    catch { throw new ErrorDeNegocio("Sitio web inválido."); }
  }
  const empresa = {
    nombre_comercial, razon_social, rfc, tipo_contribuyente, tamano: tamano || null,
    sector: string(data, "sector", 100), descripcion: string(data, "descripcion", 2000, false) || null,
    sitio_web: sitio_web || null, contacto, cargo: string(data, "cargo", 100),
    telefono: string(data, "telefono", 30), ciudad: string(data, "ciudad", 100),
    estado: string(data, "estado", 100),
  };
  const hash = await hashPassword(password);
  try { return crearEmpresaConUsuario({ nombre: names[0], apellidos: names.slice(1).join(" "), email, hash, empresa }); }
  catch (error) {
    if (error.code?.startsWith("SQLITE_CONSTRAINT")) throw new ErrorDeNegocio("Ya existe un registro con ese correo o RFC.", 409);
    throw error;
  }
}

// El bloqueo aplica por correo y por ventana temporal; NO sustituye controles per IP en producción.
export async function autenticar(emailInput, password) {
  const email = String(emailInput || "").trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== "string" || password.length > 128 || !password) {
    throw new ErrorDeNegocio("Correo o contraseña incorrectos.", 401);
  }
  const now = Math.floor(Date.now() / 1000);
  if (loginBloqueado(email, now)) throw new ErrorDeNegocio("Demasiados intentos. Intenta más tarde.", 429);
  const user = usuarioPorEmail(email);
  const correct = user && user.activo && await verifyPassword(password, user.password_hash);
  if (!correct) {
    registrarErrorLogin(email, now);
    throw new ErrorDeNegocio("Correo o contraseña incorrectos.", 401);
  }
  limpiarErroresLogin(email);
  // Las cuentas estudiantiles pendientes pueden reanudar SU verificación
  // tras autenticarse, sin recibir una sesión completa de acceso.
  return { id: user.id, rol: user.rol, email_verificado: user.email_verificado };
}
