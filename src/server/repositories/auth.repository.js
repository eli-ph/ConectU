import { getDatabase } from "@/server/db/sqlite";

export function usuarioPorEmail(email) {
  return getDatabase().prepare("SELECT id, email, password_hash, rol, activo, email_verificado FROM USUARIOS WHERE email = ?").get(email) ?? null;
}

export function crearEmpresaConUsuario({ nombre, apellidos, email, hash, empresa }) {
  const db = getDatabase();
  return db.transaction(() => {
    const usuario = db.prepare(`INSERT INTO USUARIOS(nombre, apellidos, email, password_hash, rol)
      VALUES (?, ?, ?, ?, 'empresa')`).run(nombre, apellidos, email, hash);
    const result = db.prepare(`INSERT INTO EMPRESAS (
      usuario_id, nombre_comercial, razon_social, rfc, tipo_contribuyente,
      sector, tamano, descripcion, sitio_web, contacto_nombre, contacto_cargo,
      telefono, ciudad, entidad, estado_verificacion
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,'pendiente')`).run(
      usuario.lastInsertRowid, empresa.nombre_comercial, empresa.razon_social,
      empresa.rfc, empresa.tipo_contribuyente, empresa.sector,
      empresa.tamano, empresa.descripcion, empresa.sitio_web,
      empresa.contacto, empresa.cargo, empresa.telefono,
      empresa.ciudad, empresa.estado
    );
    return { usuarioId: Number(usuario.lastInsertRowid), empresaId: Number(result.lastInsertRowid) };
  })();
}

export function loginBloqueado(email, epoch) {
  const row = getDatabase().prepare("SELECT bloqueado_hasta FROM LOGIN_INTENTOS WHERE email = ?").get(email);
  return Boolean(row && row.bloqueado_hasta > epoch);
}

export function registrarErrorLogin(email, epoch) {
  const db = getDatabase();
  db.transaction(() => {
    const row = db.prepare("SELECT intentos, ventana_inicio FROM LOGIN_INTENTOS WHERE email = ?").get(email);
    const attempts = row && epoch - row.ventana_inicio < 900 ? row.intentos + 1 : 1;
    const begin = row && epoch - row.ventana_inicio < 900 ? row.ventana_inicio : epoch;
    db.prepare(`INSERT INTO LOGIN_INTENTOS(email,intentos,ventana_inicio,bloqueado_hasta) VALUES (?,?,?,?)
      ON CONFLICT(email) DO UPDATE SET intentos=excluded.intentos,
      ventana_inicio=excluded.ventana_inicio,bloqueado_hasta=excluded.bloqueado_hasta`).run(
      email, attempts, begin, attempts >= 8 ? epoch + 900 : 0
    );
  })();
}

export function limpiarErroresLogin(email) {
  getDatabase().prepare("DELETE FROM LOGIN_INTENTOS WHERE email = ?").run(email);
}
