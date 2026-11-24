-- Fuente: backend.db entregado por el usuario. Solo catálogos públicos.
-- Insertar únicamente claves naturales faltantes; conservar ediciones existentes.
-- Los nuevos campos administrativos (008) usan sus valores por defecto.

INSERT INTO CATALOGO_FACULTADES (nombre) VALUES
  ('Facultad de Ingeniería'),
  ('Facultad de Arquitectura'),
  ('Facultad de Artes y Diseño'),
  ('Facultad de Ciencias'),
  ('Facultad de Ciencias Políticas y Sociales'),
  ('Facultad de Contaduría y Administración'),
  ('Facultad de Derecho'),
  ('Facultad de Economía'),
  ('Facultad de Enfermería y Obstetricia'),
  ('Facultad de Filosofía y Letras'),
  ('Facultad de Medicina'),
  ('Facultad de Medicina Veterinaria y Zootecnia'),
  ('Facultad de Música'),
  ('Facultad de Odontología'),
  ('Facultad de Psicología'),
  ('Facultad de Química'),
  ('Facultad de Trabajo Social'),
  ('Facultad de Estudios Superiores Acatlán'),
  ('Facultad de Estudios Superiores Aragón'),
  ('Facultad de Estudios Superiores Cuautitlán'),
  ('Facultad de Estudios Superiores Iztacala'),
  ('Facultad de Estudios Superiores Zaragoza'),
  ('Facultad de Estudios Superiores Zaragoza (Campus Tlaxcala)'),
  ('Escuela Nacional de Artes Cinematográficas'),
  ('Escuela Nacional de Ciencias de la Tierra'),
  ('Escuela Nacional de Ciencias Forenses'),
  ('Escuela Nacional de Lenguas, Lingüística y Traducción'),
  ('Escuela Nacional de Estudios Superiores Unidad Juriquilla'),
  ('Escuela Nacional de Estudios Superiores Unidad León'),
  ('Escuela Nacional de Estudios Superiores Unidad Mérida'),
  ('Escuela Nacional de Estudios Superiores Unidad Morelia'),
  ('Escuela Nacional de Estudios Superiores Unidad Oaxaca'),
  ('Instituto de Investigaciones en Matemáticas Aplicadas y en Sistemas'),
  ('Instituto de Energías Renovables'),
  ('Instituto de Biotecnología'),
  ('Centro de Nanociencias y Nanotecnología'),
  ('Facultad de Artes y Diseño (Sede Taxco)'),
  ('Centro Universitario de Teatro'),
  ('FES Aragón'),
  ('FES Acatlán')
ON CONFLICT(nombre) DO NOTHING;

INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Teatro y Actuación', id FROM CATALOGO_FACULTADES WHERE nombre = 'Centro Universitario de Teatro'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Nanotecnología', id FROM CATALOGO_FACULTADES WHERE nombre = 'Centro de Nanociencias y Nanotecnología'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Cinematografía', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Artes Cinematográficas'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencia Forense', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Ciencias Forenses'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias de la Tierra (Escuela Nacional de Ciencias de la Tierra)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Ciencias de la Tierra'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Geografía Aplicada (Escuela Nacional de Ciencias de la Tierra)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Ciencias de la Tierra'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias Genómicas (ENES Juriquilla)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Juriquilla'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias de la Tierra (ENES Juriquilla)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Juriquilla'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Aeroespacial (ENES Juriquilla)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Juriquilla'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería en Computación (ENES Juriquilla)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Juriquilla'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería en Energías Renovables (ENES Juriquilla)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Juriquilla'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Matemáticas para el Desarrollo', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Juriquilla'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Negocios Internacionales (ENES Juriquilla)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Juriquilla'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Neurociencias (ENES Juriquilla)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Juriquilla'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Psicología (ENES Juriquilla)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Juriquilla'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Tecnología (ENES Juriquilla)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Juriquilla'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Órtesis y Prótesis', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Juriquilla'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Administración Agropecuaria', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias Agrogenómicas', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Comunicación (ENES León)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Desarrollo Territorial', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Desarrollo y Gestión Interculturales (ENES León)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Economía Industrial', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Fisioterapia (ENES León)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Odontología', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Optometría (ENES León)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Relaciones Internacionales (ENES León)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Traducción (ENES León)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Turismo y Desarrollo Sostenible', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad León'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Administración (ENES Morelia)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Administración de Archivos y Gestión Documental (ENES Morelia)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Arte y Diseño (ENES Morelia)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencia de Materiales Sustentables', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias Agroforestales', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias Ambientales (ENES Morelia)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Derecho (ENES Morelia)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ecología (ENES Morelia)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Estudios Sociales y Gestión Local', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Geociencias', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Geohistoria', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Historia del Arte', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Literatura Intercultural', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Música y Tecnología Artística', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Tecnologías para la Información en Ciencias', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Morelia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Biología (ENES Mérida)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Mérida'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias Ambientales (ENES Mérida)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Mérida'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias de la Tierra (ENES Mérida)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Mérida'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Desarrollo y Gestión Interculturales (ENES Mérida)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Mérida'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ecología (ENES Mérida)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Mérida'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Geografía Aplicada (ENES Mérida)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Mérida'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería en Computación (ENES Mérida)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Mérida'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Manejo Sustentable de Zonas Costeras', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Mérida'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Sociología Aplicada', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Mérida'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Administración (ENES Oaxaca)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Oaxaca'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Contaduría (ENES Oaxaca)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Oaxaca'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Historia (ENES Oaxaca)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Oaxaca'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Informática (ENES Oaxaca)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Oaxaca'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Negocios Internacionales (ENES Oaxaca)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Estudios Superiores Unidad Oaxaca'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Lingüística Aplicada', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Lenguas, Lingüística y Traducción'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Traducción (ENALLT)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Escuela Nacional de Lenguas, Lingüística y Traducción'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Arquitectura (Facultad de Arquitectura)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Arquitectura'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Arquitectura de Paisaje', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Arquitectura'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Diseño Industrial (Facultad de Arquitectura)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Arquitectura'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Urbanismo', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Arquitectura'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Arte y Diseño (Facultad de Artes y Diseño)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Artes y Diseño'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Artes Visuales (Facultad de Artes y Diseño)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Artes y Diseño'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Diseño y Comunicación Visual (Facultad de Artes y Diseño)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Artes y Diseño'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Arte y Diseño (FAD Taxco)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Artes y Diseño (Sede Taxco)'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Artes Visuales (FAD Taxco)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Artes y Diseño (Sede Taxco)'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Actuaría (Facultad de Ciencias)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Biología (Facultad de Ciencias)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias de la Computación', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Física', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Física Biomédica', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Matemáticas', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Matemáticas Aplicadas', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Antropología', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias Políticas y Sociales'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias Políticas y Administración Pública (Facultad de Ciencias Políticas y Sociales)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias Políticas y Sociales'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias de la Comunicación', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias Políticas y Sociales'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Relaciones Internacionales (Facultad de Ciencias Políticas y Sociales)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias Políticas y Sociales'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Sociología (Facultad de Ciencias Políticas y Sociales)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ciencias Políticas y Sociales'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Administración (Facultad de Contaduría y Administración)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Contaduría y Administración'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Contaduría (Facultad de Contaduría y Administración)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Contaduría y Administración'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Informática (Facultad de Contaduría y Administración)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Contaduría y Administración'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Negocios Internacionales (Facultad de Contaduría y Administración)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Contaduría y Administración'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Derecho (Facultad de Derecho)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Derecho'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Economía (Facultad de Economía)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Economía'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Enfermería (Facultad de Enfermería y Obstetricia)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Enfermería y Obstetricia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Enfermería y Obstetricia', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Enfermería y Obstetricia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Actuaría (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Arquitectura (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias Políticas y Administración Pública (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Comunicación (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Derecho (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Diseño Gráfico', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Economía (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Enseñanza de Alemán como Lengua Extranjera', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Enseñanza de Español como Lengua Extranjera', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Enseñanza de Francés como Lengua Extranjera', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Enseñanza de Inglés', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Enseñanza de Inglés como Lengua Extranjera', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Enseñanza de Italiano como Lengua Extranjera', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Filosofía (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Historia (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Civil (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Lengua y Literaturas Hispánicas (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Matemáticas Aplicadas y Computación', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Pedagogía (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Relaciones Internacionales (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Sociología (FES Acatlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Acatlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Arquitectura (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Comunicación y Periodismo', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Derecho (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Diseño Industrial (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Economía (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Civil (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Eléctrica y Electrónica (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Industrial (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Mecánica (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería en Computación (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Pedagogía (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Planificación para el Desarrollo Agropecuario', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Relaciones Internacionales (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Sociología (FES Aragón)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Aragón'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Administración (FES Cuautitlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Bioquímica Diagnóstica', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Contaduría (FES Cuautitlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Diseño y Comunicación Visual (FES Cuautitlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Farmacia', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Informática (FES Cuautitlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Agrícola', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Industrial (FES Cuautitlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Mecánica Eléctrica', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Química (FES Cuautitlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería en Alimentos', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería en Telecomunicaciones, Sistemas y Electrónica', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Medicina Veterinaria y Zootecnia (FES Cuautitlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Química (FES Cuautitlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Química Industrial', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Tecnología (FES Cuautitlán)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Cuautitlán'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Biología (FES Iztacala)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Iztacala'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Cirujano Dentista (FES Iztacala)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Iztacala'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ecología (FES Iztacala)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Iztacala'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Enfermería (FES Iztacala)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Iztacala'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Médico Cirujano (FES Iztacala)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Iztacala'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Optometría (FES Iztacala)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Iztacala'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Psicología (FES Iztacala)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Iztacala'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Biología (FES Zaragoza)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Cirujano Dentista (FES Zaragoza)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Desarrollo Comunitario para el Envejecimiento (FES Zaragoza)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Enfermería (FES Zaragoza)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Química (FES Zaragoza)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Médico Cirujano (FES Zaragoza)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Nutriología', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Psicología (FES Zaragoza)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Química Farmacéutico Biológica (FES Zaragoza)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Biología (FES Zaragoza Tlaxcala)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza (Campus Tlaxcala)'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Desarrollo Comunitario para el Envejecimiento (FES Zaragoza Tlaxcala)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza (Campus Tlaxcala)'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Psicología (FES Zaragoza Tlaxcala)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Estudios Superiores Zaragoza (Campus Tlaxcala)'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Administración de Archivos y Gestión Documental (Facultad de Filosofía y Letras)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Bibliotecología y Estudios de la Información', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Desarrollo y Gestión Interculturales (Facultad de Filosofía y Letras)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Estudios Latinoamericanos', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Filosofía (Facultad de Filosofía y Letras)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Geografía', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Historia (Facultad de Filosofía y Letras)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Lengua y Literaturas Hispánicas (Facultad de Filosofía y Letras)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Lengua y Literaturas Modernas Alemanas', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Lengua y Literaturas Modernas Francesas', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Lengua y Literaturas Modernas Inglesas', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Lengua y Literaturas Modernas Italianas', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Lengua y Literaturas Modernas Portuguesas', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Letras Clásicas', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Literatura Dramática y Teatro', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Pedagogía (Facultad de Filosofía y Letras)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Filosofía y Letras'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Aeroespacial (Facultad de Ingeniería)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Ambiental', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Civil (Facultad de Ingeniería)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Eléctrica y Electrónica (Facultad de Ingeniería)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Geofísica', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Geológica', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Geomática', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Industrial (Facultad de Ingeniería)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Mecatrónica', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Mecánica (Facultad de Ingeniería)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Petrolera', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería de Minas y Metalurgia', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería en Computación (Facultad de Ingeniería)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería en Sistemas Biomédicos', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería en Telecomunicaciones', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencia de la Nutrición Humana', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Medicina'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Fisioterapia (Facultad de Medicina)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Medicina'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Investigación Biomédica Básica', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Medicina'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Médico Cirujano (Facultad de Medicina)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Medicina'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Neurociencias (Facultad de Medicina)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Medicina'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Medicina Veterinaria y Zootecnia (Facultad de Medicina Veterinaria y Zootecnia)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Medicina Veterinaria y Zootecnia'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Canto', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Música'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Composición', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Música'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Educación Musical', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Música'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Etnomusicología', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Música'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Instrumentista', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Música'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Piano', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Música'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Cirujano Dentista (Facultad de Odontología)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Odontología'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Psicología (Facultad de Psicología)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Psicología'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Química (Facultad de Química)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Química'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Química Metalúrgica', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Química'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Química (Facultad de Química)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Química'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Química Farmacéutico Biológica (Facultad de Química)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Química'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Química de Alimentos', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Química'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Química e Ingeniería en Materiales', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Química'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Trabajo Social', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Trabajo Social'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencias Genómicas (Instituto de Biotecnología)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Instituto de Biotecnología'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería en Energías Renovables (Instituto de Energías Renovables)', id FROM CATALOGO_FACULTADES WHERE nombre = 'Instituto de Energías Renovables'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ciencia de Datos', id FROM CATALOGO_FACULTADES WHERE nombre = 'Instituto de Investigaciones en Matemáticas Aplicadas y en Sistemas'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería en Computación', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Eléctrica Electrónica', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Mecánica', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;
INSERT INTO CATALOGO_CARRERAS (nombre, facultad_id)
SELECT 'Ingeniería Industrial', id FROM CATALOGO_FACULTADES WHERE nombre = 'Facultad de Ingeniería'
ON CONFLICT(nombre) DO NOTHING;

INSERT INTO CATALOGO_EJES_ACCION (nombre) VALUES
  ('Ciencia, Tecnología e Innovación'),
  ('Seguridad Energética'),
  ('Salud'),
  ('Educación'),
  ('Arte, Cultura y Recreación'),
  ('Derechos Humanos, Seguridad Social y Jurídica'),
  ('Desarrollo de Investigación'),
  ('Desarrollo Social'),
  ('Equipamiento e Infraestructura Urbana y Rural'),
  ('Medio Ambiente y Desarrollo Sustentable'),
  ('Medios de Comunicación'),
  ('Modernización, Automatización y Fortalecimiento de la Administración Pública'),
  ('Seguridad Alimentaria')
ON CONFLICT(nombre) DO NOTHING;

