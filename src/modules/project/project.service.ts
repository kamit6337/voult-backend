import { AppError } from "@/shared/errors/app-error.js";
import { toProjectResponse } from "./project.mapper.js";
import { projectRepository } from "./project.repository.js";
import { CreateProjectType, UpdateProjectType } from "./project.types.js";

class ProjectService {
  async create(data: CreateProjectType) {
    const result = await projectRepository.create(data);
    return toProjectResponse(result);
  }

  async getSingleProject(projectId: string) {
    const result = await projectRepository.getSingleProject(projectId);

    if (!result) throw new AppError(404, "ProjectID is wrong");

    return toProjectResponse(result);
  }

  async getByUserId(userId: string) {
    const results = await projectRepository.getByUserId(userId);
    return results.map((i) => toProjectResponse(i));
  }

  async updateNameFavourite(data: UpdateProjectType) {
    const result = await projectRepository.updateNameAndFavourite(data);

    if (!result) throw new AppError(500, "Issue in Updating. Please try later");

    return toProjectResponse(result);
  }

  async deleteProject(projectId: string) {
    const result = await projectRepository.deleteProject(projectId);

    if (!result) throw new Error("Issue in deleting Project");

    return "Successfully Deleted";
  }
}

export const projectService = new ProjectService();
