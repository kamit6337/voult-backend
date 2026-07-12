import { FastifySchema } from "fastify";
import { createSecretSchema } from "./secret.request.js";
import { secretZodSchema } from "./secret.zod.js";

export const createSecretValidationSchema: FastifySchema = {
  tags: ["Secrets"],
  summary: "create",
  body: createSecretSchema,
  response: {
    200: secretZodSchema,
  },
};
