import z from "zod";

export const userZodSchema = z.object({
  _id: z.string(),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.email(),
  avatar: z.url().optional(),

  role: z.enum(["user", "admin"]),

  isEmailVerified: z.boolean(),
  isActive: z.boolean(),

  deletedAt: z.date().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserZodSchemaType = z.infer<typeof userZodSchema>;
