import { FastifySchema } from "fastify";
import { createProjectSchema } from "./project.request.js";

export const createProjectValidation: FastifySchema = {
  tags: ["Project"],
  summary: "create",
  body: createProjectSchema,
};
