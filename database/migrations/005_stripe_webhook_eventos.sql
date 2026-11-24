-- Solo bitácora técnica de idempotencia: no modifica el modelo de relaciones comercial.
CREATE TABLE IF NOT EXISTS STRIPE_WEBHOOK_EVENTOS (
  event_id TEXT PRIMARY KEY,
  tipo_evento TEXT NOT NULL,
  proveedor TEXT NOT NULL DEFAULT 'stripe',
  procesado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
