// Las contraseñas se calculan exclusivamente del lado del servidor.
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const PARAMETERS = { N: 16384, r: 8, p: 1, keylen: 64 };

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, PARAMETERS.keylen, PARAMETERS);
  return `scrypt$${PARAMETERS.N}$${PARAMETERS.r}$${PARAMETERS.p}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password, savedHash) {
  const parts = (savedHash || "").split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt" || parts[1] !== "16384" || parts[2] !== "8" || parts[3] !== "1" ||
      !/^[a-f0-9]{32}$/i.test(parts[4]) || !/^[a-f0-9]{128}$/i.test(parts[5])) return false;
  const expected = Buffer.from(parts[5], "hex");
  const actual = await scrypt(password, Buffer.from(parts[4], "hex"), expected.length, PARAMETERS);
  return timingSafeEqual(actual, expected);
}
