import { HydratedDocument, Types } from "mongoose";

export interface Project {
  userId: Types.ObjectId;
  name: string;
  favourite: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type ProjectDocument = HydratedDocument<Project>;

export type CreateProjectType = Pick<Project, "userId" | "name" | "favourite">;

export type UpdateProjectType = Pick<
  ProjectDocument,
  "_id" | "name" | "favourite"
>;
