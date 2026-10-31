import { AppError } from "@/shared/errors/app-error.js";
import { ProjectModel } from "./project.model.js";
import { CreateProjectType, UpdateProjectType } from "./project.types.js";
import { secretRepository } from "../secret/secret.repository.js";
import mongoose from "mongoose";
import { SecretModel } from "../secret/secret.model.js";

class ProjectRepository {
  async create(data: CreateProjectType) {
    if (!data?.userId || !data.name || !Object.hasOwn(data, "favourite")) {
      throw new Error("Fields is empty");
    }

    return ProjectModel.create({
      userId: data.userId,
      name: data.name,
      favourite: data.favourite,
    });
  }

  async getSingleProject(projectId: string) {
    if (!projectId) throw new AppError(500, "ProjectId is not provided");

    return ProjectModel.findOne({ _id: projectId });
  }

  async getByUserId(userId: string, page = 1, limit = 10) {
    if (!userId) throw new Error("UserId is missing");

    const skip = (page - 1) * limit;

    return ProjectModel.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async getFavouriteByUserId(userId: string, page = 1, limit = 5) {
    if (!userId) throw new Error("UserId is missing");

    const skip = (page - 1) * limit;

    return ProjectModel.find({
      userId,
      favourite: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async updateFavourite(projectId: string, bool: boolean) {
    if (!projectId || typeof bool !== "boolean")
      throw new Error("ProjectId is missing");

    return ProjectModel.findOneAndUpdate(
      {
        _id: projectId,
      },
      {
        favourite: bool,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateNameAndFavourite(data: UpdateProjectType) {
    if (!data?._id || !data.name || !Object.hasOwn(data, "favourite")) {
      throw new Error("Fields is empty");
    }

    return ProjectModel.findOneAndUpdate(
      {
        _id: data._id,
      },
      {
        name: data.name,
        favourite: data.favourite,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async deleteProject(
    projectId: string,
    userId: string,
    isDeleteSecretsAlso = false,
  ) {
    if (!projectId || !userId)
      throw new Error("ProjectId and UserId are missing");

    const mongooseTransaction = await mongoose.connection.transaction(
      async (session) => {
        const deleteProject = await ProjectModel.findOneAndDelete(
          {
            _id: projectId,
            userId,
          },
          {
            session,
          },
        );

        if (!deleteProject) throw new Error("Project not found");

        if (isDeleteSecretsAlso) {
          await SecretModel.deleteMany({ projectId }, { session });
        } else {
          await SecretModel.updateMany(
            { projectId },
            {
              $set: { projectId: null },
            },
            { session },
          );
        }

        const secretIds = await SecretModel.distinct("_id", { projectId });

        return secretIds.map(String);
      },
    );

    return { secretIds: mongooseTransaction, isDeleteSecretsAlso };
  }
}

export const projectRepository = new ProjectRepository();
