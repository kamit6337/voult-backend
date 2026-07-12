import { HydratedDocument, Types } from "mongoose";

export interface Secret {
  userId: Types.ObjectId;
  projectId?: Types.ObjectId;

  name: string;
  value: string;

  encryptionVersion?: number;
  favourite: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type SecretDocument = HydratedDocument<Secret>;

export type CreateSecretType = Pick<
  Secret,
  "userId" | "projectId" | "name" | "value" | "favourite"
>;

export type UpdateSecretRepoType = Pick<Secret, "name" | "value"> & {
  _id: Types.ObjectId;
};
