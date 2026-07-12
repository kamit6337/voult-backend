import { Types } from "mongoose";

type Provider = "google" | "github";

export interface OAuth {
  userId: Types.ObjectId;
  providerAccountId: string;
  provider: Provider;

  createdAt: Date;
  updatedAt: Date;
}

export type CreateRepoType = Pick<
  OAuth,
  "userId" | "provider" | "providerAccountId"
>;

export type GetUserRepoType = Pick<OAuth, "provider" | "providerAccountId">;

export type OAuthEncryptionType = {
  userId: string;
  email: string;
};
