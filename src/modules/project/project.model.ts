import mongoose from "mongoose";
import { Project } from "./project.types.js";

const projectSchema = new mongoose.Schema<Project>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    favourite: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ userId: 1, name: 1 }, { unique: true });

projectSchema.index({ userId: 1, favourite: 1, createdAt: -1, _id: -1 });

export const ProjectModel = mongoose.model("Project", projectSchema);
