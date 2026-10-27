import z from "zod";
import { secretZodSchema } from "./secret.zod.js";

export const getSecretByProjectIdSchema = z.object({
  id: z.string().min(3),
});

export type GetSecretByProjectIdSchemaType = z.infer<
  typeof getSecretByProjectIdSchema
>;

export const createSecretSchema = secretZodSchema.pick({
  projectId: true,
  name: true,
  value: true,
  favourite: true,
});

export type CreateSecretSchemaType = z.infer<typeof createSecretSchema>;

export const updateSecretSchema = secretZodSchema.pick({
  _id: true,
  name: true,
  value: true,
  favourite: true,
});

export type UpdateSecretSchemaType = z.infer<typeof updateSecretSchema>;

export const updateSecretFavouriteSchema = secretZodSchema.pick({
  _id: true,
  favourite: true,
});

export type UpdateSecretFavouriteSchemaType = z.infer<
  typeof updateSecretFavouriteSchema
>;

export const deleteSecretSchema = secretZodSchema.pick({
  _id: true,
});

export type DeleteSecretSchemaType = z.infer<typeof deleteSecretSchema>;
