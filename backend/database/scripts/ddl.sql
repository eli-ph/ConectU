-- Plataforma de Vinculación Universitaria
-- SQLite 3 — 22 tablas (Idempotente)

PRAGMA foreign_keys = ON;

-- ==========================================
-- 1. CATÁLOGOS
-- ==========================================

CREATE TABLE IF NOT EXISTS CATALOGO_FACULTADES (
  id     INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS CATALOGO_CARRERAS (
  id          INTEGER PRIMARY KEY,
  nombre      TEXT    NOT NULL UNIQUE,
  facultad_id INTEGER REFERENCES CATALOGO_FACULTADES(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS CATALOGO_EJES_ACCION (
  id     INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS CATALOGO_HABILIDADES (
  id     INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS CATALOGO_PLANES (
  id                     INTEGER PRIMARY KEY,
  nombre                 TEXT    NOT NULL UNIQUE,
  precio_centavos        INTEGER NOT NULL CHECK (precio_centavos >= 0),
  limite_ofertas_activas INTEGER CHECK (limite_ofertas_activas IS NULL OR limite_ofertas_activas > 0),
  duracion_dias          INTEGER NOT NULL CHECK (duracion_dias > 0),
  activo                 INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0,1))
);

CREATE TABLE IF NOT EXISTS CATALOGO_PROMOCION (
  id                   INTEGER PRIMARY KEY,
  costo_centavos       INTEGER NOT NULL CHECK (costo_centavos >= 0),
  duracion_maxima_dias INTEGER NOT NULL CHECK (duracion_maxima_dias > 0),
  activo               INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0,1)),
  actualizado_en       TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ESTATUS_COMPRA (
  id          INTEGER PRIMARY KEY,
  clave       TEXT NOT NULL UNIQUE CHECK (clave IN ('pendiente','confirmada','fallida','reembolsada')),
  descripcion TEXT
);

-- ==========================================
-- 2. USUARIOS, ESTUDIANTES Y EMPRESAS
-- ==========================================

CREATE TABLE IF NOT EXISTS USUARIOS (
  id               INTEGER PRIMARY KEY,
  nombre           TEXT    NOT NULL,
  apellidos        TEXT    NOT NULL,
  email            TEXT    NOT NULL UNIQUE,
  password_hash    TEXT    NOT NULL,
  rol              TEXT    NOT NULL CHECK (rol IN ('estudiante','empresa','admin')),
  email_verificado INTEGER NOT NULL DEFAULT 0 CHECK (email_verificado IN (0,1)),
  activo           INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0,1)),
  created_at       TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ESTUDIANTES (
  id                  INTEGER PRIMARY KEY,
  usuario_id          INTEGER NOT NULL UNIQUE REFERENCES USUARIOS(id),
  numero_cuenta       TEXT    UNIQUE,
  carrera_id          INTEGER REFERENCES CATALOGO_CARRERAS(id) ON DELETE SET NULL,
  semestre            INTEGER CHECK (semestre BETWEEN 1 AND 10),
  fecha_egreso        TEXT,
  promedio            REAL    CHECK (promedio BETWEEN 0 AND 10),
  telefono            TEXT,
  ubicacion           TEXT,
  resumen_profesional TEXT,
  cv_ruta             TEXT,
  cv_nombre           TEXT,
  cv_actualizado_at   TEXT
);

CREATE TABLE IF NOT EXISTS EMPRESAS (
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
                              CHECK (estado_verificacion IN ('pendiente','aprobada','rechazada')),
  motivo_rechazo      TEXT,
  revisado_por        INTEGER REFERENCES USUARIOS(id) ON DELETE SET NULL,
  fecha_solicitud     TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_aprobacion    TEXT
);

CREATE TABLE IF NOT EXISTS EMPRESA_DOCUMENTOS (
  id              INTEGER PRIMARY KEY,
  empresa_id      INTEGER NOT NULL REFERENCES EMPRESAS(id),
  tipo            TEXT    NOT NULL CHECK (tipo IN ('constancia_fiscal','acta_constitutiva','otro')),
  nombre_original TEXT    NOT NULL,
  ruta_archivo    TEXT    NOT NULL,
  mime            TEXT,
  tamano_bytes    INTEGER CHECK (tamano_bytes >= 0),
  fecha_carga     TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ESTUDIANTE_HABILIDADES (
  estudiante_id INTEGER NOT NULL REFERENCES ESTUDIANTES(id),
  habilidad_id  INTEGER NOT NULL REFERENCES CATALOGO_HABILIDADES(id),
  nivel         TEXT    CHECK (nivel IN ('basico','intermedio','avanzado')),
  PRIMARY KEY (estudiante_id, habilidad_id)
);

-- ==========================================
-- 3. OFERTAS Y POSTULACIONES
-- ==========================================

CREATE TABLE IF NOT EXISTS OFERTAS (
  id                 INTEGER PRIMARY KEY,
  empresa_id         INTEGER NOT NULL REFERENCES EMPRESAS(id),
  eje_accion_id      INTEGER REFERENCES CATALOGO_EJES_ACCION(id) ON DELETE SET NULL,
  titulo             TEXT    NOT NULL,
  descripcion        TEXT,
  tipo               TEXT    NOT NULL CHECK (tipo IN ('empleo','servicio_social','practicas','becariado')),
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

CREATE TABLE IF NOT EXISTS ADJUNTOS_OFERTA (
  id              INTEGER PRIMARY KEY,
  oferta_id       INTEGER NOT NULL REFERENCES OFERTAS(id),
  nombre_original TEXT    NOT NULL,
  ruta_archivo    TEXT    NOT NULL,
  mime            TEXT,
  tamano_bytes    INTEGER CHECK (tamano_bytes >= 0),
  posicion        INTEGER NOT NULL CHECK (posicion BETWEEN 1 AND 3),
  fecha_carga     TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (oferta_id, posicion)
);

CREATE TABLE IF NOT EXISTS OFERTA_CARRERAS (
  oferta_id  INTEGER NOT NULL REFERENCES OFERTAS(id),
  carrera_id INTEGER NOT NULL REFERENCES CATALOGO_CARRERAS(id),
  PRIMARY KEY (oferta_id, carrera_id)
);

CREATE TABLE IF NOT EXISTS OFERTA_HABILIDADES (
  oferta_id    INTEGER NOT NULL REFERENCES OFERTAS(id),
  habilidad_id INTEGER NOT NULL REFERENCES CATALOGO_HABILIDADES(id),
  obligatoria  INTEGER NOT NULL DEFAULT 0 CHECK (obligatoria IN (0,1)),
  PRIMARY KEY (oferta_id, habilidad_id)
);

CREATE TABLE IF NOT EXISTS POSTULACIONES (
  id             INTEGER PRIMARY KEY,
  oferta_id      INTEGER NOT NULL REFERENCES OFERTAS(id),
  estudiante_id  INTEGER NOT NULL REFERENCES ESTUDIANTES(id),
  estado         TEXT    NOT NULL DEFAULT 'enviada'
                         CHECK (estado IN ('enviada','en_revision','aceptada','rechazada','retirada','cerrada')),
  mensaje        TEXT,
  postulada_at   TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizada_at TEXT,
  cerrada_en     TEXT
);

CREATE TABLE IF NOT EXISTS HISTORIAL_POSTULACIONES (
  id             INTEGER PRIMARY KEY,
  postulacion_id INTEGER NOT NULL REFERENCES POSTULACIONES(id),
  estado         TEXT    NOT NULL,
  cambiado_por   INTEGER REFERENCES USUARIOS(id) ON DELETE SET NULL,
  comentario     TEXT,
  created_at     TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS NOTIFICACIONES (
  id         INTEGER PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES USUARIOS(id),
  tipo       TEXT,
  titulo     TEXT    NOT NULL,
  mensaje    TEXT,
  leida      INTEGER NOT NULL DEFAULT 0 CHECK (leida IN (0,1)),
  created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. SUSCRIPCIONES, PROMOCIONES Y COMPRAS
-- ==========================================

CREATE TABLE IF NOT EXISTS SUSCRIPCIONES (
  id           INTEGER PRIMARY KEY,
  empresa_id   INTEGER NOT NULL UNIQUE REFERENCES EMPRESAS(id),
  plan_id      INTEGER NOT NULL REFERENCES CATALOGO_PLANES(id) ON DELETE RESTRICT,
  fecha_inicio TEXT,
  fecha_fin    TEXT,
  estado       TEXT    NOT NULL DEFAULT 'pendiente_pago'
                       CHECK (estado IN ('pendiente_pago','activa','vencida','cancelada')),
  expira_en    TEXT,
  CHECK (fecha_fin IS NULL OR fecha_inicio IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE TABLE IF NOT EXISTS PROMOCIONES (
  id                  INTEGER PRIMARY KEY,
  oferta_id           INTEGER NOT NULL REFERENCES OFERTAS(id),
  tarifa_promocion_id INTEGER NOT NULL REFERENCES CATALOGO_PROMOCION(id) ON DELETE RESTRICT,
  fecha_inicio        TEXT,
  fecha_fin           TEXT,
  estado              TEXT    NOT NULL DEFAULT 'pendiente_pago'
                              CHECK (estado IN ('pendiente_pago','activa','vencida','cancelada')),
  expira_en           TEXT,
  CHECK (fecha_fin IS NULL OR fecha_inicio IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE TABLE IF NOT EXISTS COMPRAS (
  id                 INTEGER PRIMARY KEY,
  folio              TEXT    NOT NULL UNIQUE,
  tipo               TEXT    NOT NULL CHECK (tipo IN ('plan','promocion')),
  suscripcion_id     INTEGER REFERENCES SUSCRIPCIONES(id) ON DELETE RESTRICT,
  promocion_id       INTEGER REFERENCES PROMOCIONES(id) ON DELETE RESTRICT,
  monto_centavos     INTEGER NOT NULL CHECK (monto_centavos >= 0),
  moneda             TEXT    NOT NULL DEFAULT 'MXN',
  estatus_id         INTEGER NOT NULL REFERENCES ESTATUS_COMPRA(id) ON DELETE RESTRICT,
  proveedor          TEXT,
  referencia_externa TEXT    UNIQUE,
  comprobante_ruta   TEXT,
  verificado_en      TEXT,
  created_at         TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    (tipo = 'plan'      AND suscripcion_id IS NOT NULL AND promocion_id IS NULL) OR
    (tipo = 'promocion' AND promocion_id IS NOT NULL AND suscripcion_id IS NULL)
  )
);

-- ==========================================
-- 5. ÍNDICES Y REGLAS DE UNICIDAD PARCIAL
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_carreras_facultad        ON CATALOGO_CARRERAS(facultad_id);
CREATE INDEX IF NOT EXISTS idx_estudiantes_carrera      ON ESTUDIANTES(carrera_id);
CREATE INDEX IF NOT EXISTS idx_empresas_estado          ON EMPRESAS(estado_verificacion);
CREATE INDEX IF NOT EXISTS idx_documentos_empresa       ON EMPRESA_DOCUMENTOS(empresa_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_empresa          ON OFERTAS(empresa_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_estado           ON OFERTAS(estado, fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_ofertas_eje              ON OFERTAS(eje_accion_id);
CREATE INDEX IF NOT EXISTS idx_adjuntos_oferta          ON ADJUNTOS_OFERTA(oferta_id);
CREATE INDEX IF NOT EXISTS idx_postulaciones_oferta     ON POSTULACIONES(oferta_id);
CREATE INDEX IF NOT EXISTS idx_postulaciones_estudiante ON POSTULACIONES(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_historial_postulacion    ON HISTORIAL_POSTULACIONES(postulacion_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario   ON NOTIFICACIONES(usuario_id, leida);
CREATE INDEX IF NOT EXISTS idx_planes_activos           ON CATALOGO_PLANES(activo);
CREATE INDEX IF NOT EXISTS idx_suscripciones_estado     ON SUSCRIPCIONES(estado, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_promociones_oferta       ON PROMOCIONES(oferta_id, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_promociones_estado       ON PROMOCIONES(estado);
CREATE INDEX IF NOT EXISTS idx_compras_estatus          ON COMPRAS(estatus_id);
CREATE INDEX IF NOT EXISTS idx_compras_suscripcion      ON COMPRAS(suscripcion_id);
CREATE INDEX IF NOT EXISTS idx_compras_promocion        ON COMPRAS(promocion_id);

-- Evita duplicados de postulación activa por estudiante y oferta
CREATE UNIQUE INDEX IF NOT EXISTS idx_postulacion_unica_activa
  ON POSTULACIONES(estudiante_id, oferta_id)
  WHERE estado NOT IN ('retirada', 'cerrada');

-- ==========================================
-- 6. DATOS INICIALES
-- ==========================================

INSERT OR IGNORE INTO CATALOGO_FACULTADES (nombre) VALUES
  ('Facultad de Ingeniería');

INSERT OR IGNORE INTO CATALOGO_EJES_ACCION (nombre) VALUES
  ('Ciencia y tecnología'),
  ('Industria y energía'),
  ('Salud'),
  ('Educación');

INSERT OR IGNORE INTO ESTATUS_COMPRA (clave, descripcion) VALUES
  ('pendiente',   'Creada, sin pago confirmado'),
  ('confirmada',  'Pago confirmado por el proveedor'),
  ('fallida',     'El cobro no se completó'),
  ('reembolsada', 'Importe devuelto a la empresa');