import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { userhandler } from "./user.handler.js";
import { meRouteSchema } from "./user.middleware.js";

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async (request: FastifyRequest) => {
    return {
      users: [],
    };
  });

  fastify.get("/me", { schema: meRouteSchema }, userhandler.me);
};

export default userRoutes;
