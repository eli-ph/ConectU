import { getDatabase } from "@/server/db/sqlite";

export function catalogosAcademicosRegistro() {
  const db = getDatabase();
  return {
    facultades: db.prepare("SELECT id, nombre FROM CATALOGO_FACULTADES f WHERE f.activo=1 AND EXISTS (SELECT 1 FROM CATALOGO_CARRERAS c WHERE c.facultad_id=f.id AND c.activo=1) ORDER BY nombre").all(),
    carreras: db.prepare("SELECT id, nombre, facultad_id FROM CATALOGO_CARRERAS WHERE activo=1 ORDER BY nombre").all(),
  };
}

export function crearEstudianteConUsuario({ nombre, apellidos, correo, passwordHash, numeroCuenta, facultadId, carreraId, semestre, promedio, ubicacion }) {
  const db = getDatabase();
  return db.transaction(() => {
    const carrera = db.prepare(`SELECT c.id FROM CATALOGO_CARRERAS c
      WHERE c.id=? AND c.facultad_id=? AND c.activo=1 AND EXISTS(SELECT 1 FROM CATALOGO_FACULTADES f WHERE f.id=c.facultad_id AND f.activo=1)`).get(carreraId, facultadId);
    if (!carrera) throw Object.assign(new Error("Selecciona una carrera de la facultad indicada."), { code: "CARRERA_INVALIDA" });
    const usuario = db.prepare(`INSERT INTO USUARIOS (nombre,apellidos,email,password_hash,rol,email_verificado)
      VALUES (?,?,?,?,'estudiante',0)`).run(nombre, apellidos, correo, passwordHash);
    db.prepare(`INSERT INTO ESTUDIANTES (usuario_id,numero_cuenta,carrera_id,semestre,promedio,ubicacion)
      VALUES (?,?,?,?,?,?)`).run(usuario.lastInsertRowid, numeroCuenta, carreraId, semestre, promedio, ubicacion);
    return { usuarioId: Number(usuario.lastInsertRowid) };
  })();
}
