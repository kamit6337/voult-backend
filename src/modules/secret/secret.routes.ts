import { FastifyPluginAsync } from "fastify";
import { secretHandler } from "./secret.handler.js";
import {
  createSecretValidationSchema,
  deleteSecretValidationSchema,
  updateSecretFavouriteValidationSchema,
  updateSecretValidationSchema,
} from "./secret.middleware.js";

export const secretRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", secretHandler.getByUserId);

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
