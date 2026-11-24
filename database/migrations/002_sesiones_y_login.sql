-- Etapa 2: sesiones persistentes y limitación básica de intentos.
-- Ejecutar una vez; es seguro volver a ejecutar (CREATE IF NOT EXISTS).
CREATE TABLE IF NOT EXISTS USUARIO_SESIONES (
  token_hash TEXT PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES USUARIOS(id) ON DELETE CASCADE,
  creada_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expira_en TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_usuario_sesiones_usuario ON USUARIO_SESIONES(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_sesiones_expira ON USUARIO_SESIONES(expira_en);

CREATE TABLE IF NOT EXISTS LOGIN_INTENTOS (
  email TEXT PRIMARY KEY,
  intentos INTEGER NOT NULL DEFAULT 0 CHECK (intentos >= 0),
  ventana_inicio INTEGER NOT NULL,
  bloqueado_hasta INTEGER NOT NULL DEFAULT 0
);
