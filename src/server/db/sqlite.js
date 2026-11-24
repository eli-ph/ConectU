// Capa de datos: conexion compartida por proceso Node.js.
// Solo debe importarse en Server Components, Server Actions o Route Handlers.
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const globalForSqlite = globalThis;

function databasePath() {
  const value = process.env.DATABASE_PATH || "database/backend.db";
  return path.resolve(process.cwd(), value);
}

export function getDatabase() {
  const filename = databasePath();
  if (globalForSqlite.__conectuDatabase?.name === filename) {
    return globalForSqlite.__conectuDatabase;
  }

  // No crear silenciosamente una BD vacia si se olvido preparar la existente.
  if (!fs.existsSync(filename)) {
    throw new Error(`SQLite no encontrada: ${filename}. Ejecuta python scripts/preparar_db.py`);
  }

  const db = new Database(filename, { fileMustExist: true });
  try {
    db.pragma("foreign_keys = ON");
    db.pragma("busy_timeout = 5000");
    db.pragma("journal_mode = WAL");

    const requiredTables = ["USUARIOS", "EMPRESAS", "OFERTAS", "CATALOGO_PLANES", "CATALOGO_PROMOCION"];
    const found = new Set(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((r) => r.name));
    if (requiredTables.some((name) => !found.has(name))) {
      throw new Error("El esquema SQLite no esta preparado. Ejecuta python scripts/preparar_db.py");
    }
  } catch (error) {
    db.close();
    throw error;
  }

  // En desarrollo, evita crear una nueva conexion con cada Hot Reload.
  globalForSqlite.__conectuDatabase = db;
  return db;
}
