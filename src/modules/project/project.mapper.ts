import { ProjectDocument } from "./project.types.js";
import { ProjectZodSchemaType } from "./project.zod.js";

export const toProjectResponse = (
  project: ProjectDocument,
): ProjectZodSchemaType => ({
  _id: project._id.toString(),
  userId: project.userId.toString(),
  name: project.name,
  favourite: project.favourite,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});
