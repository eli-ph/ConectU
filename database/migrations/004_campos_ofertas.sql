-- Etapa 3: conservar los campos ya presentes en el formulario empresarial.
-- Ejecutar solo cuando esas columnas no existan; scripts/preparar_db.py verifica antes.
ALTER TABLE OFERTAS ADD COLUMN creditos_minimos INTEGER CHECK(creditos_minimos BETWEEN 0 AND 100);
ALTER TABLE OFERTAS ADD COLUMN horas_requeridas TEXT;
ALTER TABLE OFERTAS ADD COLUMN clave_programa TEXT;
