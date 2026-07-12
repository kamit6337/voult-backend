import dotenv from "dotenv";
dotenv.config();

import z from "zod";
import ms, { StringValue } from "ms";

const durationSchema = z.custom<StringValue>((value) => {
  return typeof value === "string" && ms(value as StringValue) !== undefined;
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  HOST: z.string(),

  PORT: z.coerce.number().int().positive(),

  MONGODB_URI: z.string().min(1),

  ACCESS_TOKEN_SECRET: z.string().min(32),

  REFRESH_TOKEN_SECRET: z.string().min(32),

  ACCESS_TOKEN_EXPIRES_IN: durationSchema,

  REFRESH_TOKEN_EXPIRES_IN: durationSchema,

  CORS_ORIGIN: z.string(),

  COOKIE_SECRET: z.string().min(32),

  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10),

  JWT_ENCRYPTION_KEY: z.string().min(32),

  JWT_ENCRYPTION_EXPIRE_IN: durationSchema,

  CRYPTO_ENCRYPTION_KEY: z.string().min(32),

  GOOGLE_CLIENT_ID: z.string(),

  GOOGLE_CLIENT_SECRET: z.string(),

  GOOGLE_REDIRECT_URL: z.url().endsWith("/api/v1/auth/google/callback"),
});

export const env = envSchema.parse(process.env);
