// modules/health/controller.ts

import { FastifyReply, FastifyRequest } from "fastify";
import * as healthService from "./service.js";

export async function getHealthHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log("protocol", request.protocol);
  console.log("hostname", request.hostname);
  console.log("headers", request.headers);
  const health = await healthService.getHealthStatus();

  return reply.send(health);
}
