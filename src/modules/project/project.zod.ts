import z from "zod";

export const projectZodSchema = z.object({
  _id: z.string().min(3),
  userId: z.string().min(3),
  name: z.string().min(3),
  favourite: z.boolean(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const projectArraySchema = z.array(projectZodSchema);

export const zodString = z.string().min(3);

export type ProjectZodSchemaType = z.infer<typeof projectZodSchema>;
