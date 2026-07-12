import { FastifySchema } from "fastify";
import { userResponseSchema } from "./user.response.js";

export const meRouteSchema: FastifySchema = {
  tags: ["Users"],
  summary: "me",
  response: {
    200: userResponseSchema,
  },
};
