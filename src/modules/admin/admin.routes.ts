import { FastifyPluginAsync } from "fastify";

const adminRoutes: FastifyPluginAsync = async (app) => {
  app.get("/dashboard", async () => {
    return {
      dashboard: true,
    };
  });
};

export default adminRoutes;
