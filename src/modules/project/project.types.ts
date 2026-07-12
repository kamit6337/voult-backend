import { Types } from "mongoose";

export interface Project {
  userId: Types.ObjectId;
  name: string;
  favourite: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type CreateProjectType = Pick<Project, "userId" | "name" | "favourite">;
