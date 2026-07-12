import { FastifyReply, FastifyRequest } from "fastify";
import { secretService } from "./secret.service.js";
import { CreateSecretSchemaType } from "./secret.request.js";
import convertToMongoId from "@/utils/convertToMongoId.js";

class SecretHandler {
  async getByUserId(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.userObj;

    const results = await secretService.getByUserId(userId);
    return reply.send(results);
  }

  async create(
    request: FastifyRequest<{ Body: CreateSecretSchemaType }>,
    reply: FastifyReply,
  ) {
    const { userId } = request.userObj;
    const data = request.body;

    const result = await secretService.create({
      userId: convertToMongoId(userId),
      projectId: data.projectId ? convertToMongoId(data.projectId) : undefined,
      name: data.name,
      value: data.value,
      favourite: data.favourite,
    });

    return reply.send(result);
  }
}

export const secretHandler = new SecretHandler();
