import z from "zod";
import { projectZodSchema } from "./project.zod.js";

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
