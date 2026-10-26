import { FastifyReply, FastifyRequest } from "fastify";
import { secretService } from "./secret.service.js";
import {
  CreateSecretSchemaType,
  DeleteSecretSchemaType,
  UpdateSecretFavouriteSchemaType,
  UpdateSecretSchemaType,
} from "./secret.request.js";
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

  async updateValue(
    request: FastifyRequest<{ Body: UpdateSecretSchemaType }>,
    reply: FastifyReply,
  ) {
    const data = request.body;

    const result = await secretService.updateValue({
      _id: convertToMongoId(data._id),
      name: data.name,
      value: data.value,
      favourite: data.favourite,
    });

    return reply.send(result);
  }

  async updateFavourite(
    request: FastifyRequest<{ Body: UpdateSecretFavouriteSchemaType }>,
    reply: FastifyReply,
  ) {
    const result = await secretService.updateFavourite(
      request.body._id,
      request.body.favourite,
    );

    return reply.send(result);
  }

  async deleteSecret(
    request: FastifyRequest<{ Body: DeleteSecretSchemaType }>,
    reply: FastifyReply,
  ) {
    const result = await secretService.deleteSecret(request.body._id);

    return reply.send(result);
  }
}

export const secretHandler = new SecretHandler();
