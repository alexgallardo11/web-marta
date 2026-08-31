import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;

function getEncryptionKey() {
  const secret =
    process.env.SHARE_LINK_ENCRYPTION_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    throw new Error(
      "Falta SHARE_LINK_ENCRYPTION_KEY o SUPABASE_SECRET_KEY para recuperar enlaces permanentes.",
    );
  }
  return createHash("sha256")
    .update(`marta-moreno:share-link-token:${secret}`)
    .digest();
}

function encode(value: Buffer) {
  return value.toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url");
}

export function isShareToken(token: string) {
  return /^[A-Za-z0-9_-]{43}$/.test(token);
}

export function hashShareToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function encryptShareToken(token: string) {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);
  return [encode(iv), encode(cipher.getAuthTag()), encode(ciphertext)].join(".");
}

export function decryptShareToken(value: string) {
  const [encodedIv, encodedAuthTag, encodedCiphertext] = value.split(".");
  if (!encodedIv || !encodedAuthTag || !encodedCiphertext) {
    throw new Error("El token cifrado no tiene un formato válido.");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    decode(encodedIv),
  );
  decipher.setAuthTag(decode(encodedAuthTag));
  const token = Buffer.concat([
    decipher.update(decode(encodedCiphertext)),
    decipher.final(),
  ]).toString("utf8");

  if (!isShareToken(token)) {
    throw new Error("El token recuperado no es válido.");
  }
  return token;
}
