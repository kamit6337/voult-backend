import { Types } from "mongoose";
import { CreateUserRepoType } from "../user/user.types.js";

export type AUTH_HANDLER_ENCRYPT_TYPE =
  | {
      type: "login";
      userId: string;
      email: string;
    }
  | {
      type: "register";
      email: string;
      firstName: string;
      lastName: string;
    };

export interface Session {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  hashedRefreshToken: string;

  userAgent?: string;
  ipAddress?: string;

  expiresAt: Date;

  lastUsedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type CreateSessionRepositoryType = Pick<
  Session,
  | "userId"
  | "userAgent"
  | "ipAddress"
  | "_id"
  | "hashedRefreshToken"
  | "expiresAt"
>;

export type CreateSessionServiceType = Pick<
  Session,
  "userId" | "userAgent" | "ipAddress"
>;

export type VerifyOTPServiceType = {
  otp: string;
  hashedOTP: string;
  cookie: AUTH_HANDLER_ENCRYPT_TYPE;
  userAgent?: string;
  ipAddress?: string;
};

export type CreateAccessAndRefreshTokenType = {
  email: string;
  userId: string;
  sessionId: string;
  randomRefreshStr: string;
};

export type CreateUserAndSessionType = {
  userData: CreateUserRepoType;
  hashedToken: string;
  userAgent?: string;
  ipAddress?: string;
};

export type AccessTokenObjType = {
  userId: string;
  email: string;
  type: "access" | "refresh";
};

export type RefreshTokenObjType = {
  userId: string;
  sessionId: string;
  randomStr: string;
  type: "access" | "refresh";
  exp: number;
};
