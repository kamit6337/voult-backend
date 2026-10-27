import { FastifyPluginAsync } from "fastify";
import { projectHandler } from "./project.handler.js";
import {
  createProjectValidation,
  deleteProjectValidation,
  getProjectValidation,
  getSingleProjectValidation,
  updateProjectValidation,
} from "./project.middleware.js";

export const projectRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", { schema: createProjectValidation }, projectHandler.create);

  fastify.get(
    "/",
    { schema: getProjectValidation },
    projectHandler.getByUserId,
  );

  fastify.get(
    "/single",
    { schema: getSingleProjectValidation },
    projectHandler.getSingleProject,
  );

  fastify.patch(
    "/",
    { schema: updateProjectValidation },
    projectHandler.updateNameFavourite,
  );

  fastify.delete(
    "/",
    { schema: deleteProjectValidation },
    projectHandler.deleteProject,
  );
};
