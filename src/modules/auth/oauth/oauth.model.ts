import mongoose from "mongoose";
import { OAuth } from "./oauth.types.js";

const oauthSchema = new mongoose.Schema<OAuth>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: ["google", "github"],
      required: true,
    },
  },
  { timestamps: true },
);

oauthSchema.index({ provider: 1, providerAccountId: 1 });

export const OAuthModel = mongoose.model("OAuth", oauthSchema);
