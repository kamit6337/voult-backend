import z from "zod";

export const deleteProjectResponseZodSchema = z.object({
  secretIds: z.array(z.string().min(3)),
  isDeleteSecretsAlso: z.boolean(),
});

export type DeleteProjectResponseZodType = z.infer<
  typeof deleteProjectResponseZodSchema
>;
