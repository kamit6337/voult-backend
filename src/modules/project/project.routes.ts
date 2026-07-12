import { FastifyPluginAsync } from "fastify";
import { projectHandler } from "./project.handler.js";
import { createProjectValidation } from "./project.middleware.js";

export const projectRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", { schema: createProjectValidation }, projectHandler.create);

  fastify.get("/", projectHandler.getByUserId);
};
