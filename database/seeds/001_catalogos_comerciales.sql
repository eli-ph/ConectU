-- Fuente: backend.db entregado por el usuario. Solo catálogos públicos.
-- Insertar únicamente claves naturales faltantes; conservar ediciones existentes.
-- Los nuevos campos administrativos (008) usan sus valores por defecto.

INSERT INTO CATALOGO_PLANES (nombre, precio_centavos, limite_ofertas_activas, duracion_dias, promociones_incluidas, dias_promocion_incluida, activo)
SELECT 'Gratuito', 0, 10, 30, 0, 7, 1 WHERE NOT EXISTS (SELECT 1 FROM CATALOGO_PLANES WHERE lower(nombre) = 'gratuito');
INSERT INTO CATALOGO_PLANES (nombre, precio_centavos, limite_ofertas_activas, duracion_dias, promociones_incluidas, dias_promocion_incluida, activo)
SELECT 'Básico', 9900, 20, 30, 1, 7, 1 WHERE NOT EXISTS (SELECT 1 FROM CATALOGO_PLANES WHERE lower(nombre) IN ('basico','básico'));
INSERT INTO CATALOGO_PLANES (nombre, precio_centavos, limite_ofertas_activas, duracion_dias, promociones_incluidas, dias_promocion_incluida, activo)
SELECT 'Premium', 24900, NULL, 30, 3, 7, 1 WHERE NOT EXISTS (SELECT 1 FROM CATALOGO_PLANES WHERE lower(nombre) = 'premium');
INSERT INTO CATALOGO_PROMOCION (costo_centavos, duracion_maxima_dias, activo)
SELECT 3900, 7, 1 WHERE NOT EXISTS (SELECT 1 FROM CATALOGO_PROMOCION WHERE duracion_maxima_dias = 7);
INSERT INTO CATALOGO_PROMOCION (costo_centavos, duracion_maxima_dias, activo)
SELECT 6900, 15, 1 WHERE NOT EXISTS (SELECT 1 FROM CATALOGO_PROMOCION WHERE duracion_maxima_dias = 15);
INSERT INTO CATALOGO_PROMOCION (costo_centavos, duracion_maxima_dias, activo)
SELECT 11900, 30, 1 WHERE NOT EXISTS (SELECT 1 FROM CATALOGO_PROMOCION WHERE duracion_maxima_dias = 30);

INSERT INTO ESTATUS_COMPRA (clave, descripcion) VALUES
  ('pendiente', 'Creada, sin pago confirmado'),
  ('confirmada', 'Pago confirmado por el proveedor'),
  ('fallida', 'El cobro no se completó'),
  ('reembolsada', 'Importe devuelto a la empresa')
ON CONFLICT(clave) DO NOTHING;

