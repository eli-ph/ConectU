-- Bitácora administrativa. Los registros originales no se eliminan.
CREATE TABLE IF NOT EXISTS ADMIN_ACCIONES (
 id INTEGER PRIMARY KEY,
 admin_id INTEGER NOT NULL REFERENCES USUARIOS(id),
 entidad TEXT NOT NULL CHECK(entidad IN ('usuario','oferta','catalogo')),
 entidad_id INTEGER NOT NULL,
 accion TEXT NOT NULL,
 motivo TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_admin_acciones_entidad ON ADMIN_ACCIONES(entidad,entidad_id,created_at);
