import z from "zod";
import { cursorZodSchema, secretArrZodSchema } from "./secret.zod.js";

export const getSecretByUserIdResponseSchema = z.object({
  data: secretArrZodSchema,
  nextCursor: cursorZodSchema.nullable(),
  hasNextPage: z.boolean(),
});

export type GetSecretByUserIdResponseType = z.infer<
  typeof getSecretByUserIdResponseSchema
>;
