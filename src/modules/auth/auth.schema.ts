import { Schema } from "mongoose";
import { Session } from "./auth.types.js";

export const sessionSchema = new Schema<Session>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hashedRefreshToken: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    userAgent: String,
    ipAddress: String,
  },
  {
    timestamps: true,
  },
);
