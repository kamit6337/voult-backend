import { FastifyReply, FastifyRequest } from "fastify";
import { userService } from "./user.service.js";

class UserHandler {
  async me(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.userObj;

    const result = await userService.getUserById(userId);

    return reply.code(200).send(result);
  }
}

export const userhandler = new UserHandler();
