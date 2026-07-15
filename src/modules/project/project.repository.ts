import { ProjectModel } from "./project.model.js";
import { CreateProjectType, UpdateProjectType } from "./project.types.js";

class ProjectRepository {
  async create(data: CreateProjectType) {
    return ProjectModel.create({
      userId: data.userId,
      name: data.name,
      favourite: data.favourite,
    });
  }

  async getByUserId(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return ProjectModel.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async getFavouriteByUserId(userId: string, page = 1, limit = 5) {
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
}

export const projectRepository = new ProjectRepository();
