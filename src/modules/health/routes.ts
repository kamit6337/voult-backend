import { FastifyPluginAsync } from "fastify";
import { getHealthHandler } from "./handler.js";

const healthRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", getHealthHandler);
};

export default healthRoute;
