import { projectRepository } from "./project.repository.js";
import { CreateProjectType, UpdateProjectType } from "./project.types.js";

class ProjectService {
  async create(data: CreateProjectType) {
    const result = await projectRepository.create(data);
    return result;
  }

  async getByUserId(userId: string) {
    const results = await projectRepository.getByUserId(userId);
    return results;
  }

  async updateNameFavourite(data: UpdateProjectType) {
    const result = await projectRepository.updateNameAndFavourite(data);
    return result;
  }
}

export const projectService = new ProjectService();
