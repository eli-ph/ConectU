import { checkPassword } from "@/lib/password-policy";
import { hashPassword } from "@/server/auth/password";
import { correoDisponible, enviarCodigoVerificacion } from "@/server/integrations/correo";
import { crearEstudianteConUsuario } from "@/server/repositories/estudiantes.repository";
import { prepararCodigo, verificarCodigo, liberarEsperaPorEnvioFallido } from "@/server/repositories/verificacion.repository";
import { ErrorDeNegocio } from "@/server/services/auth.service";

const emailRegExp = /^[^\s@]+@([^\s@]+)$/;
function normalizarEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (email.length > 254 || !emailRegExp.test(email)) throw new ErrorDeNegocio("Correo institucional no válido.");
  const allowed = (process.env.UNAM_EMAIL_DOMAINS || "comunidad.unam.mx")
    .split(",").map(d=>d.trim().toLowerCase().replace(/^@/, "")).filter(Boolean);
  const domain = email.split("@")[1];
  if (!allowed.includes(domain)) throw new ErrorDeNegocio("Utiliza un correo institucional incluido en la lista permitida.");
  return email;
}

function entero(v, min, max, label) {
  if (!/^[0-9]+$/.test(String(v ?? ""))) throw new ErrorDeNegocio(`Revisa ${label}.`);
  const number = Number(v);
  if (!Number.isSafeInteger(number) || number<min || number>max) throw new ErrorDeNegocio(`Revisa ${label}.`);
  return number;
}

function texto(v, max, label) {
  if (typeof v !== "string" || !v.trim() || v.trim().length > max) throw new ErrorDeNegocio(`Revisa ${label}.`);
  return v.trim();
}

export async function registrarEstudiante(data) {
  if (!correoDisponible()) throw new ErrorDeNegocio("La verificación de correo no está configurada. Contacta a la administración.",503);
  if (!data || typeof data!=="object" || Array.isArray(data)) throw new ErrorDeNegocio("Datos inválidos.");
  const completo = texto(data.nombre,160,"nombre completo").replace(/\s+/g," ");
  const partes = completo.split(" ");
  if (partes.length<2) throw new ErrorDeNegocio("Escribe nombre y apellidos.");
  const numeroCuenta = String(data.numero_cuenta ?? "").trim();
  if (!/^\d{9}$/.test(numeroCuenta)) throw new ErrorDeNegocio("El número de cuenta debe tener 9 dígitos.");
  const correo = normalizarEmail(data.correo);
  const password = data.password;
  if (typeof password!=="string" || password.length>128 || !checkPassword(password).valid || password!==data.confirm_password)
    throw new ErrorDeNegocio("Revisa la contraseña y su confirmación.");
  if (data.acepta_terminos !== "on") throw new ErrorDeNegocio("Debes aceptar los términos y el aviso de privacidad.");
  const semestre = entero(data.semestre,1,10,"semestre");
  const facultadId = entero(data.facultad_id,1,2147483647,"facultad");
  const carreraId = entero(data.carrera_id,1,2147483647,"carrera");
  const promedio = Number(data.promedio);
  if (typeof data.promedio !== "string" || data.promedio.trim()==="" || !Number.isFinite(promedio) || promedio<0 || promedio>10)
    throw new ErrorDeNegocio("El promedio debe estar entre 0 y 10.");
  const ubicacion = texto(data.ubicacion,160,"ubicación");
  const passwordHash = await hashPassword(password);
  try {
    const record = crearEstudianteConUsuario({
      nombre: partes[0], apellidos: partes.slice(1).join(" "), correo, passwordHash,
      numeroCuenta, facultadId, carreraId, semestre, promedio, ubicacion,
    });
    // El usuario ya quedó confirmado en SQLite. Un error del proveedor de correo
    // NO debe reportarse como si el registro hubiera fallado: de lo contrario,
    // el usuario intenta repetirlo y obtiene un correo duplicado.
    const token = prepararCodigo(correo);
    let correoEnviado = false;
    if (token) {
      try {
        await enviarCodigoVerificacion({ email: correo, code: token.code });
        correoEnviado = true;
      } catch (error) {
        liberarEsperaPorEnvioFallido(token.usuarioId, token.code);
        console.error("[ConectU] Cuenta estudiantil creada, pero falló el envío:", error?.message || error?.name);
      }
    }
    return { usuarioId: record.usuarioId, correoEnviado };
  } catch(err) {
    if (err.code === "CARRERA_INVALIDA") throw new ErrorDeNegocio(err.message);
    if (err.code?.startsWith("SQLITE_CONSTRAINT")) throw new ErrorDeNegocio("El correo o número de cuenta ya está registrado.",409);
    throw err;
  }
}

export async function reenviarCodigo(correoRaw) {
  if (!correoDisponible()) {
    throw new ErrorDeNegocio("El envío de códigos no está disponible en este momento.", 503);
  }
  const correo = normalizarEmail(correoRaw);
  let token;
  try {
    token = prepararCodigo(correo);
  } catch (error) {
    if (error?.code === "LIMIT_TIME") {
      throw new ErrorDeNegocio("Espera al menos 60 segundos desde el último envío antes de solicitar otro código.", 429);
    }
    if (error?.code === "LIMIT_HOUR") {
      throw new ErrorDeNegocio("Llegaste al máximo de cinco envíos por hora. Inténtalo más tarde.", 429);
    }
    throw error;
  }

  // No revelar si un correo desconocido existe en la base de datos.
  if (!token) return { ok: true };

  try {
    await enviarCodigoVerificacion({ email: correo, code: token.code });
    return { ok: true };
  } catch (error) {
    // Falló la entrega: no obligar a esperar 60 segundos para reintentar.
    // El límite total de intentos por hora continúa vigente.
    try {
      liberarEsperaPorEnvioFallido(token.usuarioId, token.code);
    } catch (dbError) {
      console.error("[ConectU] No fue posible liberar la espera del envío fallido:", dbError?.code || dbError?.message);
    }
    console.error("[ConectU] Gmail no pudo enviar el código de verificación:", error?.message || error?.name);
    throw new ErrorDeNegocio("No pudimos enviar el código en este momento. Inténtalo de nuevo más tarde.", 503);
  }
}

export function confirmarCorreo(correoRaw,codigo) {
  const correo = normalizarEmail(correoRaw);
  if (typeof codigo!=="string" || !/^\d{6}$/.test(codigo)) throw new ErrorDeNegocio("Introduce los seis dígitos del código.");
  if (!verificarCodigo(correo,codigo)) throw new ErrorDeNegocio("Código incorrecto, vencido o sin intentos disponibles.",400);
  return {ok:true};
}
