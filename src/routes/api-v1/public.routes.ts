import { authRoutes } from "@/modules/auth/auth.routes.js";
import { FastifyPluginAsync } from "fastify";

export const publicRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authRoutes, {
    prefix: "/auth",
  });
};
