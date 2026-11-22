-- Plataforma de Vinculación Universitaria
-- SQLite 3 — 22 tablas (creación de base nueva + reglas de promoción)
-- IMPORTANTE: para una base ya creada usa 02_migracion_promociones.sql.
-- NOTA: los cambios del esquema no se aplican a tablas existentes usando IF NOT EXISTS.

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
  -- Cupos por periodo de suscripción, no promociones preasignadas.
  promociones_incluidas INTEGER NOT NULL DEFAULT 0 CHECK (promociones_incluidas >= 0),
  dias_promocion_incluida INTEGER NOT NULL DEFAULT 7 CHECK (dias_promocion_incluida > 0),
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
  id                         INTEGER PRIMARY KEY,
  -- No UNIQUE aquí: conservamos un registro por cada periodo contratado.
  empresa_id                 INTEGER NOT NULL REFERENCES EMPRESAS(id),
  plan_id                    INTEGER NOT NULL REFERENCES CATALOGO_PLANES(id) ON DELETE RESTRICT,
  fecha_inicio               TEXT,
  fecha_fin                  TEXT,
  estado                     TEXT NOT NULL DEFAULT 'pendiente_pago'
                                     CHECK (estado IN ('pendiente_pago','activa','vencida','cancelada')),
  expira_en                  TEXT,
  -- Beneficios congelados al crear cada periodo; no cambian si el catálogo se edita.
  promociones_incluidas      INTEGER NOT NULL DEFAULT 0 CHECK (promociones_incluidas >= 0),
  promociones_usadas         INTEGER NOT NULL DEFAULT 0 CHECK (promociones_usadas >= 0),
  dias_promocion_incluida    INTEGER NOT NULL DEFAULT 7 CHECK (dias_promocion_incluida > 0),
  CHECK (promociones_usadas <= promociones_incluidas),
  CHECK (fecha_fin IS NULL OR fecha_inicio IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE TABLE IF NOT EXISTS PROMOCIONES (
  id                  INTEGER PRIMARY KEY,
  oferta_id           INTEGER NOT NULL REFERENCES OFERTAS(id),
  tarifa_promocion_id INTEGER NOT NULL REFERENCES CATALOGO_PROMOCION(id) ON DELETE RESTRICT,
  -- 'incluida': consume cupo del plan; 'adicional': exige compra confirmada.
  -- No hay empresa_id ni suscripcion_id en PROMOCIONES.
  origen              TEXT NOT NULL DEFAULT 'adicional'
                            CHECK (origen IN ('incluida','adicional')),
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
  proveedor            TEXT    DEFAULT 'stripe',
  url_proveedor        TEXT,                -- Link de Stripe Checkout (para reutilizar si da doble clic)
  referencia_externa   TEXT    UNIQUE,      -- Stripe session_id (cs_...)
  payment_intent_id    TEXT    UNIQUE,      -- Stripe payment_intent (pi_...), obligatorio para reembolsos
  verificado_en      TEXT,
  created_at         TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    (tipo = 'plan'      AND suscripcion_id IS NOT NULL AND promocion_id IS NULL) OR
    (tipo = 'promocion' AND promocion_id IS NOT NULL AND suscripcion_id IS NULL)
  )
);

-- 2. Tabla REEMBOLSOS (soporta reembolsos totales y múltiples parciales)
CREATE TABLE IF NOT EXISTS REEMBOLSOS (
  id                 INTEGER PRIMARY KEY,
  compra_id          INTEGER NOT NULL REFERENCES COMPRAS(id) ON DELETE RESTRICT,
  referencia_externa TEXT    NOT NULL UNIQUE, -- Stripe refund_id (re_...)
  idempotency_key    TEXT    UNIQUE,          -- NULL permitido para reembolsos hechos desde el Dashboard de Stripe
  monto_centavos     INTEGER NOT NULL CHECK (monto_centavos > 0),
  motivo             TEXT    CHECK (motivo IN ('duplicate','fraudulent','requested_by_customer')),
  nota               TEXT,
  estatus            TEXT    NOT NULL CHECK (estatus IN ('pending','succeeded','failed','canceled')),
  created_at         TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla WEBHOOK_EVENTOS (evita procesar dos veces el mismo webhook de Stripe)
CREATE TABLE IF NOT EXISTS WEBHOOK_EVENTOS (
  event_id     TEXT PRIMARY KEY,              -- Stripe event.id (evt_...)
  proveedor    TEXT NOT NULL DEFAULT 'stripe',
  tipo_evento  TEXT NOT NULL,
  procesado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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
CREATE INDEX IF NOT EXISTS idx_suscripciones_empresa    ON SUSCRIPCIONES(empresa_id, fecha_inicio);
-- La misma empresa puede tener historial, pero solo un plan activo simultáneamente.
CREATE UNIQUE INDEX IF NOT EXISTS ux_suscripcion_activa_empresa
  ON SUSCRIPCIONES(empresa_id) WHERE estado = 'activa';
CREATE INDEX IF NOT EXISTS idx_promociones_oferta       ON PROMOCIONES(oferta_id, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_promociones_estado       ON PROMOCIONES(estado);
-- Una oferta no puede tener dos promociones activas ni checkouts sin resolver a la vez.
CREATE UNIQUE INDEX IF NOT EXISTS ux_promocion_en_curso_por_oferta
  ON PROMOCIONES(oferta_id) WHERE estado IN ('pendiente_pago','activa');
CREATE INDEX IF NOT EXISTS idx_compras_estatus          ON COMPRAS(estatus_id);
CREATE INDEX IF NOT EXISTS idx_compras_suscripcion      ON COMPRAS(suscripcion_id);
CREATE INDEX IF NOT EXISTS idx_compras_promocion        ON COMPRAS(promocion_id);
-- Índice para consultar rápido el historial de reembolsos de una compra
CREATE INDEX IF NOT EXISTS idx_reembolsos_compra_id ON REEMBOLSOS(compra_id);
-- Evita duplicados de postulación activa por estudiante y oferta
CREATE UNIQUE INDEX IF NOT EXISTS idx_postulacion_unica_activa
  ON POSTULACIONES(estudiante_id, oferta_id)
  WHERE estado NOT IN ('retirada', 'cerrada');


-- ==========================================
-- 5.1. REGLAS PARA ACTIVACIONES INCLUIDAS
-- ==========================================

-- Al crear una suscripción se copian automáticamente los cupos y días del plan.
-- Son valores congelados para ese periodo: editar el catálogo no los modifica.
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

-- Una promoción incluida se crea ya activa y solo si corresponde a una oferta publicada.
-- El mismo INSERT descuenta 1 cupo, todo dentro de una operación atómica de SQLite.
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

-- Evita cobros para una promoción marcada como beneficio incluido.
CREATE TRIGGER IF NOT EXISTS trg_compra_no_cobrar_incluida
BEFORE INSERT ON COMPRAS
WHEN NEW.tipo = 'promocion' AND EXISTS (
  SELECT 1 FROM PROMOCIONES WHERE id = NEW.promocion_id AND origen = 'incluida'
)
BEGIN
  SELECT RAISE(ABORT, 'La promocion incluida no genera compra adicional');
END;


-- No permitir cambiar después la oferta o el origen de una promoción para
-- evitar reubicar beneficios o convertir promociones pagadas en incluidas.
CREATE TRIGGER IF NOT EXISTS trg_promocion_identidad_fija
BEFORE UPDATE OF origen, oferta_id, tarifa_promocion_id ON PROMOCIONES
WHEN NEW.origen <> OLD.origen
  OR NEW.oferta_id <> OLD.oferta_id
  OR NEW.tarifa_promocion_id <> OLD.tarifa_promocion_id
BEGIN
  SELECT RAISE(ABORT, 'Una promocion no puede cambiar de oferta, tarifa u origen');
END;

-- Una promoción incluida ya utilizada no se puede extender ni reactivar sin
-- consumir una activación nueva. Sí puede pasar de activa a vencida/cancelada.
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

-- Cuotas asociadas a planes existentes (sin inventar tarifas monetarias).
-- Este archivo no crea planes: los precios deben cargarse con la configuración comercial.
UPDATE CATALOGO_PLANES SET promociones_incluidas = 0, dias_promocion_incluida = 7
 WHERE lower(nombre) = 'gratuito';
UPDATE CATALOGO_PLANES SET promociones_incluidas = 1, dias_promocion_incluida = 7
 WHERE lower(nombre) IN ('basico', 'básico');
UPDATE CATALOGO_PLANES SET promociones_incluidas = 3, dias_promocion_incluida = 7
 WHERE lower(nombre) = 'premium';