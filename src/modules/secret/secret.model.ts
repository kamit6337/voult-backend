import mongoose from "mongoose";
import { Secret } from "./secret.types.js";
import { encrypt } from "@/shared/utils/encrypt.js";

const secretSchema = new mongoose.Schema<Secret>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    encryptionVersion: {
      type: Number,
      default: 1,
      required: false,
      select: false,
    },
    favourite: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

secretSchema.index(
  {
    userId: 1,
    projectId: 1,
    name: 1,
  },
  { unique: true },
);

secretSchema.index({
  userId: 1,
  createdAt: -1,
});

secretSchema.index({
  projectId: 1,
});

secretSchema.index({
  userId: 1,
  favourite: 1,
  createdAt: -1,
});

secretSchema.pre("save", function () {
  if (!this.isModified("value")) return;
  this.value = encrypt(this.value);
});

export const SecretModel = mongoose.model("Secret", secretSchema);
