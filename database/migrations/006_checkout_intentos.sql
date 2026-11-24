-- Etapa 5C: las sesiones Stripe son intentos técnicos, NO compras ni beneficios.
-- Las tablas COMPRAS/SUSCRIPCIONES/PROMOCIONES se insertan exclusivamente
-- al validar checkout.session.completed con payment_status=paid.
CREATE TABLE IF NOT EXISTS CHECKOUT_INTENTOS (
  id INTEGER PRIMARY KEY,
  folio TEXT NOT NULL UNIQUE,
  empresa_id INTEGER NOT NULL REFERENCES EMPRESAS(id),
  tipo TEXT NOT NULL CHECK(tipo IN ('plan','promocion')),
  plan_id INTEGER REFERENCES CATALOGO_PLANES(id),
  tarifa_id INTEGER REFERENCES CATALOGO_PROMOCION(id),
  oferta_id INTEGER REFERENCES OFERTAS(id),
  monto_centavos INTEGER NOT NULL CHECK(monto_centavos>0),
  moneda TEXT NOT NULL DEFAULT 'MXN' CHECK(moneda='MXN'),
  stripe_session_id TEXT UNIQUE,
  payment_intent_id TEXT UNIQUE,
  estado TEXT NOT NULL DEFAULT 'iniciada' CHECK(estado IN ('iniciada','confirmada','expirada','reembolsada','reembolso_pendiente')),
  compra_id INTEGER UNIQUE REFERENCES COMPRAS(id),
  motivo TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((tipo='plan' AND plan_id IS NOT NULL AND tarifa_id IS NULL AND oferta_id IS NULL)
       OR (tipo='promocion' AND plan_id IS NULL AND tarifa_id IS NOT NULL AND oferta_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS idx_checkout_intentos_empresa_estado ON CHECKOUT_INTENTOS(empresa_id,estado);
