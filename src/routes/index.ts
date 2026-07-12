import { FastifyPluginAsync } from "fastify";
import apiV1 from "./api-v1/api-v1.js";
import healthRoute from "../modules/health/routes.js";

const routes: FastifyPluginAsync = async (fastify) => {
  // Public
  await fastify.get("/", async () => {
    return {
      success: true,
      message: "Home Page",
    };
  });

  await fastify.register(healthRoute, {
    prefix: "/health",
  });

  // API v1
  await fastify.register(apiV1, {
    prefix: "/api/v1",
  });
};

export default routes;
