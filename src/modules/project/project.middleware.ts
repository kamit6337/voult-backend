import { FastifySchema } from "fastify";
import {
  createProjectSchema,
  deleteProjectSchema,
  updateProjectSchema,
} from "./project.request.js";
import {
  projectArraySchema,
  projectZodSchema,
  zodString,
} from "./project.zod.js";

export const createProjectValidation: FastifySchema = {
  tags: ["Project"],
  summary: "create",
  body: createProjectSchema,
  response: {
    200: projectZodSchema,
  },
};

export const getProjectValidation: FastifySchema = {
  tags: ["Project"],
  summary: "get",
  response: {
    200: projectArraySchema,
  },
};

export const updateProjectValidation: FastifySchema = {
  tags: ["Project"],
  summary: "update",
  body: updateProjectSchema,
  response: {
    200: projectZodSchema,
  },
};

export const deleteProjectValidation: FastifySchema = {
  tags: ["Project"],
  summary: "delete",
  querystring: deleteProjectSchema,
  response: {
    200: zodString,
  },
};
