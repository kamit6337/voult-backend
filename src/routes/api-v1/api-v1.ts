import { FastifyPluginAsync } from "fastify";

import { publicRoutes } from "./public.routes.js";
import { protectedRoutes } from "./protected.routes.js";

const apiV1: FastifyPluginAsync = async (fastify) => {
  await fastify.register(publicRoutes);
  await fastify.register(protectedRoutes);
};

export default apiV1;
