import { FastifyPluginAsync } from "fastify";
import { secretHandler } from "./secret.handler.js";
import { createSecretValidationSchema } from "./secret.middleware.js";

export const secretRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", secretHandler.getByUserId);

  fastify.post(
    "/",
    { schema: createSecretValidationSchema },
    secretHandler.create,
  );
};
