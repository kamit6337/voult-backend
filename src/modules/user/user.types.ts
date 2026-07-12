import { HydratedDocument } from "mongoose";

export type UserRole = "user" | "admin";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;

  role: UserRole;

  isEmailVerified: boolean;
  isActive: boolean;

  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

export type CreateUserRepoType = Pick<
  User,
  "firstName" | "lastName" | "email" | "isEmailVerified" | "avatar"
>;
