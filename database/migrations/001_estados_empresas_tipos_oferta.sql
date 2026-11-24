-- Migracion 001: agrega EMPRESAS.suspendida y OFERTAS.internship.
-- REQUIERE respaldo previo. Ejecutar una sola vez (scripts/preparar_db.py
-- automatiza respaldo, deteccion y esta migracion).
-- La FK se desactiva FUERA de la transaccion durante la reconstruccion.
PRAGMA foreign_keys = OFF;
BEGIN IMMEDIATE;
DROP TRIGGER IF EXISTS trg_suscripcion_fijar_cupos;
DROP TRIGGER IF EXISTS trg_promocion_incluida_consumir;
DROP TRIGGER IF EXISTS trg_compra_no_cobrar_incluida;
DROP TRIGGER IF EXISTS trg_promocion_identidad_fija;
DROP TRIGGER IF EXISTS trg_promocion_incluida_no_extender;
-- Reconstruccion de EMPRESAS porque SQLite no permite editar un CHECK directamente.
CREATE TABLE __ETAPA1_NUEVA_EMPRESAS (
  id                  INTEGER PRIMARY KEY,
  usuario_id          INTEGER NOT NULL UNIQUE REFERENCES USUARIOS(id),
  nombre_comercial    TEXT    NOT NULL,
  razon_social        TEXT    NOT NULL,
  rfc                 TEXT    NOT NULL UNIQUE,
  tipo_contribuyente  TEXT    CHECK (tipo_contribuyente IN ('fisica','moral')),
  sector              TEXT,
  tamano              TEXT    CHECK (tamano IN ('micro','pequena','mediana','grande')),
  descripcion         TEXT,
  sitio_web           TEXT,
  contacto_nombre     TEXT,
  contacto_cargo      TEXT,
  telefono            TEXT,
  ciudad              TEXT,
  entidad             TEXT,
  estado_verificacion TEXT    NOT NULL DEFAULT 'pendiente'
                              CHECK (estado_verificacion IN ('pendiente','aprobada','rechazada','suspendida')),
  motivo_rechazo      TEXT,
  revisado_por        INTEGER REFERENCES USUARIOS(id) ON DELETE SET NULL,
  fecha_solicitud     TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_aprobacion    TEXT
);
INSERT INTO __ETAPA1_NUEVA_EMPRESAS ("id", "usuario_id", "nombre_comercial", "razon_social", "rfc", "tipo_contribuyente", "sector", "tamano", "descripcion", "sitio_web", "contacto_nombre", "contacto_cargo", "telefono", "ciudad", "entidad", "estado_verificacion", "motivo_rechazo", "revisado_por", "fecha_solicitud", "fecha_aprobacion")
SELECT "id", "usuario_id", "nombre_comercial", "razon_social", "rfc", "tipo_contribuyente", "sector", "tamano", "descripcion", "sitio_web", "contacto_nombre", "contacto_cargo", "telefono", "ciudad", "entidad", "estado_verificacion", "motivo_rechazo", "revisado_por", "fecha_solicitud", "fecha_aprobacion" FROM EMPRESAS;
DROP TABLE EMPRESAS;
ALTER TABLE __ETAPA1_NUEVA_EMPRESAS RENAME TO EMPRESAS;
-- Reconstruccion de OFERTAS porque SQLite no permite editar un CHECK directamente.
CREATE TABLE __ETAPA1_NUEVA_OFERTAS (
  id                 INTEGER PRIMARY KEY,
  empresa_id         INTEGER NOT NULL REFERENCES EMPRESAS(id),
  eje_accion_id      INTEGER REFERENCES CATALOGO_EJES_ACCION(id) ON DELETE SET NULL,
  titulo             TEXT    NOT NULL,
  descripcion        TEXT,
  tipo               TEXT    NOT NULL CHECK (tipo IN ('empleo','servicio_social','practicas','internship')),
  modalidad          TEXT    NOT NULL CHECK (modalidad IN ('presencial','hibrida','remota')),
  entidad_federativa TEXT,
  ciudad             TEXT,
  requisitos         TEXT,
  responsabilidades  TEXT,
  semestre_minimo    INTEGER CHECK (semestre_minimo BETWEEN 1 AND 10),
  promedio_minimo    REAL    CHECK (promedio_minimo BETWEEN 0 AND 10),
  compensacion       TEXT,
  plazas             INTEGER NOT NULL DEFAULT 1 CHECK (plazas > 0),
  vistas             INTEGER NOT NULL DEFAULT 0 CHECK (vistas >= 0),
  estado             TEXT    NOT NULL DEFAULT 'borrador'
                             CHECK (estado IN ('borrador','publicada','cerrada','eliminada')),
  fecha_publicacion  TEXT,
  fecha_vencimiento  TEXT,
  eliminada_en       TEXT,
  created_at         TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (fecha_vencimiento IS NULL OR fecha_publicacion IS NULL OR fecha_vencimiento >= fecha_publicacion)
);
INSERT INTO __ETAPA1_NUEVA_OFERTAS ("id", "empresa_id", "eje_accion_id", "titulo", "descripcion", "tipo", "modalidad", "entidad_federativa", "ciudad", "requisitos", "responsabilidades", "semestre_minimo", "promedio_minimo", "compensacion", "plazas", "vistas", "estado", "fecha_publicacion", "fecha_vencimiento", "eliminada_en", "created_at")
SELECT "id", "empresa_id", "eje_accion_id", "titulo", "descripcion", CASE WHEN tipo = 'becariado' THEN 'internship' ELSE tipo END, "modalidad", "entidad_federativa", "ciudad", "requisitos", "responsabilidades", "semestre_minimo", "promedio_minimo", "compensacion", "plazas", "vistas", "estado", "fecha_publicacion", "fecha_vencimiento", "eliminada_en", "created_at" FROM OFERTAS;
DROP TABLE OFERTAS;
ALTER TABLE __ETAPA1_NUEVA_OFERTAS RENAME TO OFERTAS;
-- Los indices que dependian de las tablas reconstruidas se recrean.
CREATE INDEX idx_empresas_estado ON EMPRESAS(estado_verificacion);
CREATE INDEX idx_ofertas_empresa ON OFERTAS(empresa_id);
CREATE INDEX idx_ofertas_estado ON OFERTAS(estado, fecha_vencimiento);
CREATE INDEX idx_ofertas_eje ON OFERTAS(eje_accion_id);
CREATE TRIGGER IF NOT EXISTS trg_suscripcion_fijar_cupos
AFTER INSERT ON SUSCRIPCIONES
BEGIN
  UPDATE SUSCRIPCIONES
     SET promociones_incluidas = (
           SELECT promociones_incluidas FROM CATALOGO_PLANES WHERE id = NEW.plan_id
         ),
         dias_promocion_incluida = (
           SELECT dias_promocion_incluida FROM CATALOGO_PLANES WHERE id = NEW.plan_id
         )
   WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_promocion_incluida_consumir
AFTER INSERT ON PROMOCIONES
WHEN NEW.origen = 'incluida'
BEGIN
  SELECT RAISE(ABORT, 'La promocion incluida debe activarse inmediatamente')
  WHERE NEW.estado <> 'activa' OR NEW.fecha_inicio IS NULL OR NEW.fecha_fin IS NULL;

  UPDATE SUSCRIPCIONES
     SET promociones_usadas = promociones_usadas + 1
   WHERE empresa_id = (SELECT o.empresa_id FROM OFERTAS AS o WHERE o.id = NEW.oferta_id)
     AND estado = 'activa'
     AND datetime(fecha_inicio) <= datetime('now')
     AND datetime(fecha_fin) > datetime('now')
     AND promociones_usadas < promociones_incluidas
     -- El beneficio siempre es de la duración que se contrató para ese periodo.
     AND dias_promocion_incluida = (
       SELECT c.duracion_maxima_dias FROM CATALOGO_PROMOCION AS c
       WHERE c.id = NEW.tarifa_promocion_id
     )
     AND datetime(NEW.fecha_fin) = datetime(NEW.fecha_inicio, '+' || dias_promocion_incluida || ' days')
     AND EXISTS (
       SELECT 1 FROM OFERTAS AS o
       JOIN EMPRESAS AS e ON e.id = o.empresa_id
       JOIN USUARIOS AS u ON u.id = e.usuario_id
       WHERE o.id = NEW.oferta_id
         AND o.empresa_id = SUSCRIPCIONES.empresa_id
         AND e.estado_verificacion = 'aprobada'
         AND u.activo = 1
         AND o.estado = 'publicada'
         AND o.fecha_vencimiento IS NOT NULL
         AND date(o.fecha_vencimiento) >= date(NEW.fecha_fin)
     );

  SELECT RAISE(ABORT, 'Sin cupo de promocion incluida o oferta no elegible')
  WHERE changes() <> 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_compra_no_cobrar_incluida
BEFORE INSERT ON COMPRAS
WHEN NEW.tipo = 'promocion' AND EXISTS (
  SELECT 1 FROM PROMOCIONES WHERE id = NEW.promocion_id AND origen = 'incluida'
)
BEGIN
  SELECT RAISE(ABORT, 'La promocion incluida no genera compra adicional');
END;

CREATE TRIGGER IF NOT EXISTS trg_promocion_identidad_fija
BEFORE UPDATE OF origen, oferta_id, tarifa_promocion_id ON PROMOCIONES
WHEN NEW.origen <> OLD.origen
  OR NEW.oferta_id <> OLD.oferta_id
  OR NEW.tarifa_promocion_id <> OLD.tarifa_promocion_id
BEGIN
  SELECT RAISE(ABORT, 'Una promocion no puede cambiar de oferta, tarifa u origen');
END;

CREATE TRIGGER IF NOT EXISTS trg_promocion_incluida_no_extender
BEFORE UPDATE OF fecha_inicio, fecha_fin, estado ON PROMOCIONES
WHEN OLD.origen = 'incluida' AND (
  NEW.fecha_inicio IS NOT OLD.fecha_inicio
  OR NEW.fecha_fin IS NOT OLD.fecha_fin
  OR (OLD.estado <> 'activa' AND NEW.estado = 'activa')
)
BEGIN
  SELECT RAISE(ABORT, 'La promocion incluida consumida no se puede reactivar ni extender');
END;
PRAGMA user_version = 1;
COMMIT;
PRAGMA foreign_keys = ON;
-- El script de preparacion verifica tambien foreign_key_check e integrity_check.
