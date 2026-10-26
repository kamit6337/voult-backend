import { FastifyPluginAsync } from "fastify";
import { getHealthHandler } from "./health.handler.js";

const healthRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", getHealthHandler);
};

export default healthRoute;
