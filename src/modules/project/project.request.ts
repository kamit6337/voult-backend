import z from "zod";
import { projectZodSchema } from "./project.zod.js";

export const getSingleProjectSchema = z.object({
  id: z.string().min(3),
});

export type GetSingleProjectSchemaType = z.infer<typeof getSingleProjectSchema>;

export const createProjectSchema = projectZodSchema.pick({
  name: true,
  favourite: true,
});

export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = projectZodSchema.pick({
  _id: true,
  name: true,
  favourite: true,
});

export type UpdateProjectSchemaType = z.infer<typeof updateProjectSchema>;

export const deleteProjectSchema = projectZodSchema.pick({
  _id: true,
});

export type DeleteProjectSchemaType = z.infer<typeof deleteProjectSchema>;
