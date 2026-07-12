import z from "zod";
import { secretZodSchema } from "./secret.zod.js";

export const createSecretSchema = secretZodSchema.pick({
  projectId: true,
  name: true,
  value: true,
  favourite: true,
});

export type CreateSecretSchemaType = z.infer<typeof createSecretSchema>;
