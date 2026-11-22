// Política única de contraseña para todos los formularios de ConectU.
// Validar siempre también en el servidor al integrar la autenticación.
export const PASSWORD_REQUIREMENTS = [
  { key: "length", label: "Mínimo 8 caracteres", test: (value) => [...value].length >= 8 },
  { key: "upper", label: "Una mayúscula", test: (value) => /\p{Lu}/u.test(value) },
  { key: "lower", label: "Una minúscula", test: (value) => /\p{Ll}/u.test(value) },
  { key: "number", label: "Un número", test: (value) => /\p{Nd}/u.test(value) },
  { key: "symbol", label: "Un símbolo", test: (value) => /[\p{P}\p{S}]/u.test(value) },
];

export function checkPassword(password = "") {
  const checks = PASSWORD_REQUIREMENTS.map((rule) => ({
    key: rule.key, label: rule.label, valid: rule.test(password),
  }));
  const score = checks.filter((item) => item.valid).length;
  return { checks, score, valid: score === checks.length, total: checks.length };
}
