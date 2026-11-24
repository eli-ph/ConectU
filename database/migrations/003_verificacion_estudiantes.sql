-- Etapa 2B: códigos de verificación institucional.
-- El código nunca se almacena en texto plano. Migración repetible.
CREATE TABLE IF NOT EXISTS VERIFICACIONES_CORREO (
  usuario_id INTEGER PRIMARY KEY REFERENCES USUARIOS(id) ON DELETE CASCADE,
  codigo_hash TEXT NOT NULL,
  sal TEXT NOT NULL,
  expira_epoch INTEGER NOT NULL,
  intentos INTEGER NOT NULL DEFAULT 0 CHECK (intentos BETWEEN 0 AND 5),
  ultimo_envio_epoch INTEGER NOT NULL,
  ventana_inicio_epoch INTEGER NOT NULL,
  envios_ventana INTEGER NOT NULL DEFAULT 1 CHECK (envios_ventana BETWEEN 1 AND 5)
);
CREATE INDEX IF NOT EXISTS idx_verificaciones_expiracion ON VERIFICACIONES_CORREO(expira_epoch);
