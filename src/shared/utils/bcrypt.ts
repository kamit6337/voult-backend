import { env } from "@/config/env.js";
import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
}

export async function comparePassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}
