import z from "zod";
import { cursorZodSchema, secretArrZodSchema } from "./secret.zod.js";

export const getSecretByPaginationResponseSchema = z.object({
  data: secretArrZodSchema,
  nextCursor: cursorZodSchema.nullable(),
  hasNextPage: z.boolean(),
});

export type GetSecretByPaginationResponseType = z.infer<
  typeof getSecretByPaginationResponseSchema
>;
