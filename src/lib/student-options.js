// Rango académico compartido (coincide con CHECK(semestre BETWEEN 1 AND 10) de SQLite).
export const SEMESTER_NUMBERS = Object.freeze(Array.from({ length: 10 }, (_, index) => index + 1));
