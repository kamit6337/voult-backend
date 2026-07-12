import crypto from "node:crypto";
import { env } from "@/config/env.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getKey(secret: string): Buffer {
  const key = Buffer.from(secret, "hex");

  if (key.length !== 32) {
    throw new Error(
      "CRYPTO_ENCRYPTION_KEY must be a 32-byte key encoded as 64 hex characters.",
    );
  }

  return key;
}

export function encrypt<T extends object | string>(
  value: T,
  secret = env.CRYPTO_ENCRYPTION_KEY,
): string {
  const key = getKey(secret);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // Prefix with type information
  const plaintext =
    typeof value === "string" ? `s:${value}` : `j:${JSON.stringify(value)}`;

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decrypt<T = unknown>(
  encryptedText: string,
  secret = env.CRYPTO_ENCRYPTION_KEY,
): T {
  try {
    const key = getKey(secret);

    const payload = Buffer.from(encryptedText, "base64");

    if (payload.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
      throw new Error();
    }

    const iv = payload.subarray(0, IV_LENGTH);
    const authTag = payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString("utf8");

    if (decrypted.startsWith("s:")) {
      return decrypted.slice(2) as T;
    }

    if (decrypted.startsWith("j:")) {
      return JSON.parse(decrypted.slice(2)) as T;
    }

    throw new Error("Unknown payload type.");
  } catch {
    throw new Error("Invalid or tampered encrypted payload.");
  }
}
