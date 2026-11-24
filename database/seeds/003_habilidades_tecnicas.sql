-- Catálogo ConectU: conservar registros y ediciones existentes al repetir.
INSERT INTO CATALOGO_HABILIDADES (nombre, categoria) VALUES
  ('JavaScript', 'Lenguajes de programación y scripting'),
  ('React', 'Desarrollo web y frameworks'),
  ('Python', 'Lenguajes de programación y scripting'),
  ('SQL', 'Bases de datos'),
  ('Docker', 'Cloud, DevOps y control de versiones'),
  ('Git', 'Cloud, DevOps y control de versiones'),
  ('Linux', 'Cloud, DevOps y control de versiones'),
  ('AWS', 'Cloud, DevOps y control de versiones'),
  ('Excel', 'Ofimática y productividad'),
  ('CAD', 'Ingeniería mecánica, diseño industrial y CAD'),
  ('IoT', 'Electrónica y sistemas embebidos'),
  ('Redes', 'Redes y telecomunicaciones')
ON CONFLICT(nombre) DO NOTHING;
