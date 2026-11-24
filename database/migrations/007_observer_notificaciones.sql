-- Etapa 6A: eventos de dominio duraderos y cola de correo.
-- NOTIFICACIONES ya existe en el esquema. La migración Python añade sus dos
-- columnas si faltan (SQLite no soporta ALTER TABLE ADD COLUMN IF NOT EXISTS).
CREATE TABLE IF NOT EXISTS EVENTOS_DOMINIO (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL,
  entidad_id INTEGER NOT NULL,
  dato TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  procesado_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_eventos_dominio_pendientes ON EVENTOS_DOMINIO(procesado_at,id);

CREATE TABLE IF NOT EXISTS NOTIFICACIONES_CORREO (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  notificacion_id INTEGER NOT NULL UNIQUE REFERENCES NOTIFICACIONES(id) ON DELETE CASCADE,
  destinatario TEXT NOT NULL,
  asunto TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('pendiente','enviando','enviado','fallido')),
  intentos INTEGER NOT NULL DEFAULT 0,
  siguiente_intento_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reservado_at TEXT,
  enviado_at TEXT,
  ultimo_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notificaciones_correo_envio
  ON NOTIFICACIONES_CORREO(estado,siguiente_intento_at,id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_notificaciones_evento_usuario
  ON NOTIFICACIONES(evento_id,usuario_id) WHERE evento_id IS NOT NULL;

-- Registrar el evento dentro de la misma transacción de la acción de negocio.
-- No se envían correos ni se llama a APIs desde los triggers.
CREATE TRIGGER IF NOT EXISTS trg_evento_empresa_nueva
AFTER INSERT ON EMPRESAS BEGIN
 INSERT INTO EVENTOS_DOMINIO(tipo,entidad_id,dato)
 VALUES('empresa.registrada',NEW.id,NULL);
END;

CREATE TRIGGER IF NOT EXISTS trg_evento_empresa_resuelta
AFTER UPDATE OF estado_verificacion ON EMPRESAS
WHEN NEW.estado_verificacion<>OLD.estado_verificacion BEGIN
 INSERT INTO EVENTOS_DOMINIO(tipo,entidad_id,dato)
 VALUES('empresa.estado',NEW.id,NEW.estado_verificacion);
END;

CREATE TRIGGER IF NOT EXISTS trg_evento_oferta_publicada_insert
AFTER INSERT ON OFERTAS WHEN NEW.estado='publicada' BEGIN
 INSERT INTO EVENTOS_DOMINIO(tipo,entidad_id,dato)
 VALUES('oferta.publicada',NEW.id,NULL);
END;
CREATE TRIGGER IF NOT EXISTS trg_evento_oferta_publicada_update
AFTER UPDATE OF estado ON OFERTAS
WHEN NEW.estado='publicada' AND OLD.estado<>'publicada' BEGIN
 INSERT INTO EVENTOS_DOMINIO(tipo,entidad_id,dato)
 VALUES('oferta.publicada',NEW.id,NULL);
END;

CREATE TRIGGER IF NOT EXISTS trg_evento_postulacion_nueva
AFTER INSERT ON POSTULACIONES BEGIN
 INSERT INTO EVENTOS_DOMINIO(tipo,entidad_id,dato)
 VALUES('postulacion.creada',NEW.id,NULL);
END;

CREATE TRIGGER IF NOT EXISTS trg_evento_postulacion_estado
AFTER UPDATE OF estado ON POSTULACIONES
WHEN NEW.estado<>OLD.estado BEGIN
 INSERT INTO EVENTOS_DOMINIO(tipo,entidad_id,dato)
 VALUES('postulacion.estado',NEW.id,NEW.estado);
END;

CREATE TRIGGER IF NOT EXISTS trg_evento_compra_confirmada_insert
AFTER INSERT ON COMPRAS WHEN EXISTS(
 SELECT 1 FROM ESTATUS_COMPRA e WHERE e.id=NEW.estatus_id AND e.clave='confirmada'
) BEGIN
 INSERT INTO EVENTOS_DOMINIO(tipo,entidad_id,dato)
 VALUES('compra.confirmada',NEW.id,NULL);
END;
CREATE TRIGGER IF NOT EXISTS trg_evento_compra_confirmada_update
AFTER UPDATE OF estatus_id ON COMPRAS
WHEN NEW.estatus_id<>OLD.estatus_id AND EXISTS(
 SELECT 1 FROM ESTATUS_COMPRA e WHERE e.id=NEW.estatus_id AND e.clave='confirmada'
) BEGIN
 INSERT INTO EVENTOS_DOMINIO(tipo,entidad_id,dato)
 VALUES('compra.confirmada',NEW.id,NULL);
END;

CREATE TRIGGER IF NOT EXISTS trg_evento_promocion_incluida
AFTER INSERT ON PROMOCIONES
WHEN NEW.origen='incluida' AND NEW.estado='activa' BEGIN
 INSERT INTO EVENTOS_DOMINIO(tipo,entidad_id,dato)
 VALUES('promocion.incluida',NEW.id,NULL);
END;
