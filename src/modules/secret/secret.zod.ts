import z from "zod";

export const secretZodSchema = z.object({
  _id: z.string().min(3),
  userId: z.string().min(3),
  projectId: z.string().min(3).optional(),

  name: z.string().min(3),
  value: z.string().min(3),
  favourite: z.boolean(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SecretZodSchemaType = z.infer<typeof secretZodSchema>;
