import { FastifyPluginAsync } from "fastify";
import { googleHandler } from "./google.handler.js";

export const googleRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/google", googleHandler.login);

  fastify.get("/google/callback", googleHandler.googleRedirect);
};
