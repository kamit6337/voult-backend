import { FastifyPluginAsync } from "fastify";
import { secretHandler } from "./secret.handler.js";
import {
  createSecretValidationSchema,
  deleteSecretValidationSchema,
  getSecretByProjectIdValidationSchema,
  getSecretByUserIdValidationSchema,
  updateSecretFavouriteValidationSchema,
  updateSecretValidationSchema,
} from "./secret.middleware.js";

export const secretRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/",
    { schema: getSecretByUserIdValidationSchema },
    secretHandler.getByUserId,
  );

  fastify.get(
    "/favourite",
    { schema: getSecretByUserIdValidationSchema },
    secretHandler.getFavouriteByUserId,
  );

  fastify.get(
    "/project",
    { schema: getSecretByProjectIdValidationSchema },
    secretHandler.getByProjectId,
  );

  fastify.post(
    "/",
    { schema: createSecretValidationSchema },
    secretHandler.create,
  );

  fastify.patch(
    "/",
    { schema: updateSecretValidationSchema },
    secretHandler.updateValue,
  );

  fastify.delete(
    "/",
    { schema: deleteSecretValidationSchema },
    secretHandler.deleteSecret,
  );

  fastify.patch(
    "/favourite",
    { schema: updateSecretFavouriteValidationSchema },
    secretHandler.updateFavourite,
  );
};
