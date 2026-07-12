import mongoose from "mongoose";
import { Session } from "./auth.types.js";

export const createSessionId = () => new mongoose.Types.ObjectId();

export const sessionSchema = new mongoose.Schema<Session>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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

export const SessionModel = mongoose.model("Session", sessionSchema);
