import { ProjectModel } from "./project.model.js";
import { CreateProjectType, UpdateProjectType } from "./project.types.js";

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

  async deleteProject(projectId: string) {
    if (!projectId) throw new Error("ProjectId is missing");

    return ProjectModel.findOneAndDelete({
      _id: projectId,
    });
  }
}

export const projectRepository = new ProjectRepository();
