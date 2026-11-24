import { getDatabase } from "@/server/db/sqlite";

export function obtenerPerfilEstudiante(usuarioId) {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT s.id AS estudiante_id, u.nombre, u.apellidos, u.email,
           s.numero_cuenta, s.carrera_id, c.facultad_id, s.semestre,
           s.promedio, s.ubicacion, s.resumen_profesional,
           s.cv_nombre, s.cv_actualizado_at
      FROM USUARIOS u
      JOIN ESTUDIANTES s ON s.usuario_id = u.id
      LEFT JOIN CATALOGO_CARRERAS c ON c.id = s.carrera_id
     WHERE u.id = ? AND u.rol = 'estudiante' AND u.activo = 1
  `).get(usuarioId);
  if (!row) return null;
  const habilidades = db.prepare(`
    SELECT h.nombre
      FROM ESTUDIANTE_HABILIDADES eh
      JOIN CATALOGO_HABILIDADES h ON h.id = eh.habilidad_id
     WHERE eh.estudiante_id = ? ORDER BY h.nombre COLLATE NOCASE
  `).all(row.estudiante_id).map((skill) => skill.nombre);
  return {
    nombreCompleto: `${row.nombre} ${row.apellidos}`.trim(),
    correo: row.email,
    numeroCuenta: row.numero_cuenta || "",
    facultadId: row.facultad_id,
    carreraId: row.carrera_id,
    semestre: row.semestre,
    promedio: row.promedio,
    ubicacion: row.ubicacion || "",
    resumen: row.resumen_profesional || "",
    habilidades,
    cv: row.cv_nombre ? { nombre: row.cv_nombre, actualizadoEn: row.cv_actualizado_at } : null,
  };
}

export function obtenerCatalogosPerfil() {
  const db = getDatabase();
  return {
    facultades: db.prepare(`SELECT id, nombre FROM CATALOGO_FACULTADES
      WHERE activo=1 AND EXISTS (SELECT 1 FROM CATALOGO_CARRERAS WHERE facultad_id = CATALOGO_FACULTADES.id AND activo=1)
      ORDER BY nombre COLLATE NOCASE`).all(),
    carreras: db.prepare("SELECT id, nombre, facultad_id FROM CATALOGO_CARRERAS WHERE activo=1 ORDER BY nombre COLLATE NOCASE").all(),
    habilidades: db.prepare("SELECT nombre FROM CATALOGO_HABILIDADES WHERE activo=1 ORDER BY nombre COLLATE NOCASE").all().map((h) => h.nombre),
  };
}

export function actualizarPerfilEstudiante(usuarioId, datos) {
  const db = getDatabase();
  return db.transaction(() => {
    const usuario = db.prepare(`SELECT s.id AS estudiante_id FROM ESTUDIANTES s
      JOIN USUARIOS u ON u.id = s.usuario_id WHERE u.id = ? AND u.rol = 'estudiante' AND u.activo = 1`).get(usuarioId);
    if (!usuario) return { status: "no_encontrado" };
    const carrera = db.prepare("SELECT id FROM CATALOGO_CARRERAS WHERE id = ? AND facultad_id = ? AND activo=1 AND EXISTS(SELECT 1 FROM CATALOGO_FACULTADES f WHERE f.id=CATALOGO_CARRERAS.facultad_id AND f.activo=1)")
      .get(datos.carreraId, datos.facultadId);
    if (!carrera) return { status: "carrera_invalida" };

    // Las habilidades son administradas en un catálogo, no las crea un estudiante.
    const habilidades = db.prepare("SELECT id, nombre FROM CATALOGO_HABILIDADES WHERE activo=1").all();
    const porNombre = new Map(habilidades.map((h) => [h.nombre.toLocaleLowerCase("es"), h.id]));
    const ids = datos.habilidades.map((nombre) => porNombre.get(nombre.toLocaleLowerCase("es")));
    if (ids.some((id) => !id)) return { status: "habilidad_invalida" };

    db.prepare("UPDATE USUARIOS SET nombre = ?, apellidos = ? WHERE id = ?")
      .run(datos.nombre, datos.apellidos, usuarioId);
    db.prepare(`UPDATE ESTUDIANTES SET numero_cuenta = ?, carrera_id = ?, semestre = ?,
      promedio = ?, ubicacion = ?, resumen_profesional = ? WHERE id = ?`)
      .run(datos.numeroCuenta, datos.carreraId, datos.semestre, datos.promedio,
        datos.ubicacion, datos.resumen, usuario.estudiante_id);
    db.prepare("DELETE FROM ESTUDIANTE_HABILIDADES WHERE estudiante_id = ?").run(usuario.estudiante_id);
    const add = db.prepare("INSERT INTO ESTUDIANTE_HABILIDADES(estudiante_id, habilidad_id) VALUES (?, ?)");
    for (const id of ids) add.run(usuario.estudiante_id, id);
    return { status: "ok" };
  })();
}

export function obtenerCredencialEstudiante(usuarioId) {
  return getDatabase().prepare(`SELECT u.password_hash FROM USUARIOS u
    JOIN ESTUDIANTES s ON s.usuario_id = u.id
    WHERE u.id = ? AND u.activo = 1 AND u.rol = 'estudiante'`).get(usuarioId);
}

export function actualizarCredencialEstudiante(usuarioId, hash) {
  const db = getDatabase();
  return db.transaction(() => {
    const result = db.prepare(`UPDATE USUARIOS SET password_hash = ?
      WHERE id = ? AND rol = 'estudiante' AND activo = 1`).run(hash, usuarioId);
    if (result.changes !== 1) return false;
    db.prepare("DELETE FROM USUARIO_SESIONES WHERE usuario_id = ?").run(usuarioId);
    return true;
  })();
}

export function obtenerCvEstudiante(usuarioId) {
  return getDatabase().prepare(`SELECT s.cv_ruta AS archivo, s.cv_nombre AS nombre
    FROM ESTUDIANTES s JOIN USUARIOS u ON u.id = s.usuario_id
    WHERE u.id = ? AND u.activo = 1 AND u.rol = 'estudiante'`).get(usuarioId) ?? null;
}

export function reemplazarCvEstudiante(usuarioId, archivo, nombre) {
  const db = getDatabase();
  return db.transaction(() => {
    const previo = obtenerCvEstudiante(usuarioId);
    if (!previo) return null;
    const result = db.prepare(`UPDATE ESTUDIANTES SET cv_ruta = ?, cv_nombre = ?, cv_actualizado_at = ?
      WHERE usuario_id = ?`).run(archivo, nombre, new Date().toISOString(), usuarioId);
    return result.changes === 1 ? { anterior: previo.archivo } : null;
  })();
}
