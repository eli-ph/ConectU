import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { getDatabase } from "@/server/db/sqlite";

const CODE_TTL = 600;
const RESEND_WAIT = 60;
const MAX_SENDS_HOUR = 5;

const hash = (salt, code) => createHash("sha256").update(`${salt}:${code}`).digest("hex");

export function prepararCodigo(correo) {
  const db = getDatabase();
  const user = db.prepare("SELECT id, email_verificado, rol FROM USUARIOS WHERE email = ? AND activo=1").get(correo);
  if (!user || user.rol !== "estudiante" || user.email_verificado === 1) return null;
  const now = Math.floor(Date.now() / 1000);
  const code = randomInt(0, 1000000).toString().padStart(6, "0");
  const salt = randomBytes(16).toString("hex");
  const current = db.prepare("SELECT ultimo_envio_epoch, ventana_inicio_epoch, envios_ventana FROM VERIFICACIONES_CORREO WHERE usuario_id=?").get(user.id);
  if (current?.ultimo_envio_epoch && now - current.ultimo_envio_epoch < RESEND_WAIT) {
    const err = new Error("Espera un minuto antes de solicitar otro código."); err.code = "LIMIT_TIME"; throw err;
  }
  const inHour = current && (now-current.ventana_inicio_epoch < 3600);
  const count = inHour ? current.envios_ventana + 1 : 1;
  if (count > MAX_SENDS_HOUR) {
    const err = new Error("Alcanzaste el límite de envíos. Intenta en una hora."); err.code = "LIMIT_HOUR"; throw err;
  }
  db.prepare(`INSERT INTO VERIFICACIONES_CORREO
    (usuario_id,codigo_hash,sal,expira_epoch,intentos,ultimo_envio_epoch,ventana_inicio_epoch,envios_ventana)
    VALUES (?,?,?,?,0,?,?,?)
    ON CONFLICT(usuario_id) DO UPDATE SET
    codigo_hash=excluded.codigo_hash, sal=excluded.sal, expira_epoch=excluded.expira_epoch,
    intentos=0, ultimo_envio_epoch=excluded.ultimo_envio_epoch,
    ventana_inicio_epoch=excluded.ventana_inicio_epoch, envios_ventana=excluded.envios_ventana`)
    .run(user.id, hash(salt, code), salt, now+CODE_TTL, now, inHour ? current.ventana_inicio_epoch : now, count);
  return { code, usuarioId: user.id };
}

export function verificarCodigo(correo, code) {
  const db = getDatabase();
  return db.transaction(() => {
    const user = db.prepare("SELECT id, rol, email_verificado FROM USUARIOS WHERE email=? AND activo=1").get(correo);
    if (!user || user.rol!=="estudiante") return false;
    if (user.email_verificado === 1) return false;
    const row = db.prepare("SELECT * FROM VERIFICACIONES_CORREO WHERE usuario_id=?").get(user.id);
    if (!row || row.intentos >= 5 || row.expira_epoch <= Math.floor(Date.now()/1000)) return false;
    db.prepare("UPDATE VERIFICACIONES_CORREO SET intentos=intentos+1 WHERE usuario_id=?").run(user.id);
    const supplied = Buffer.from(hash(row.sal, code), "hex");
    const expected = Buffer.from(row.codigo_hash, "hex");
    if (expected.length !== supplied.length || !timingSafeEqual(expected,supplied)) return false;
    db.prepare("UPDATE USUARIOS SET email_verificado=1 WHERE id=?").run(user.id);
    db.prepare("DELETE FROM VERIFICACIONES_CORREO WHERE usuario_id=?").run(user.id);
    return true;
  })();
}

/**
 * Si el proveedor rechaza el envío, permite un nuevo intento sin esperar
 * 60 segundos. Conserva el contador horario para evitar reintentos ilimitados.
 * Solo modifica el código concreto que falló; no afecta un código más reciente.
 */
export function liberarEsperaPorEnvioFallido(usuarioId, codigo) {
  const db = getDatabase();
  const row = db.prepare("SELECT codigo_hash, sal FROM VERIFICACIONES_CORREO WHERE usuario_id=?").get(usuarioId);
  if (!row || hash(row.sal, codigo) !== row.codigo_hash) return false;
  return db.prepare(`UPDATE VERIFICACIONES_CORREO SET ultimo_envio_epoch = 0
    WHERE usuario_id=? AND codigo_hash=?`).run(usuarioId, row.codigo_hash).changes === 1;
}
