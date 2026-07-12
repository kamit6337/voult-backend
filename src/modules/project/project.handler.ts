import { FastifyReply, FastifyRequest } from "fastify";
import { CreateProjectSchemaType } from "./project.request.js";
import { projectService } from "./project.service.js";
import convertToMongoId from "@/utils/convertToMongoId.js";

class ProjectHandler {
  async create(
    request: FastifyRequest<{ Body: CreateProjectSchemaType }>,
    reply: FastifyReply,
  ) {
    const { userId } = request.userObj;

    const { name, favourite } = request.body;

    const result = await projectService.create({
      userId: convertToMongoId(userId),
      name,
      favourite,
    });

    return reply.send(result);
  }

  async getByUserId(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.userObj;

    const result = await projectService.getByUserId(userId);

    return reply.send(result);
  }
}

export const projectHandler = new ProjectHandler();
