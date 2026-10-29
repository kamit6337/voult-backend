import { FastifySchema } from "fastify";
import {
  createSecretSchema,
  deleteSecretSchema,
  getSecretByProjectIdSchema,
  getSecretByUserIdSchema,
  updateSecretFavouriteSchema,
  updateSecretSchema,
} from "./secret.request.js";
import {
  secretArrZodSchema,
  secretZodSchema,
  zodString,
} from "./secret.zod.js";
import { getSecretByPaginationResponseSchema } from "./secret.response.js";

export const getSecretByUserIdValidationSchema: FastifySchema = {
  tags: ["Secrets"],
  summary: "get",
  querystring: getSecretByUserIdSchema,
  response: {
    200: getSecretByPaginationResponseSchema,
  },
};

export const getSecretByProjectIdValidationSchema: FastifySchema = {
  tags: ["Secrets"],
  summary: "get-projectId",
  querystring: getSecretByProjectIdSchema,
  response: {
    200: getSecretByPaginationResponseSchema,
  },
};

export const createSecretValidationSchema: FastifySchema = {
  tags: ["Secrets"],
  summary: "create",
  body: createSecretSchema,
  response: {
    200: secretZodSchema,
  },
};

export const updateSecretValidationSchema: FastifySchema = {
  tags: ["Secrets"],
  summary: "update",
  body: updateSecretSchema,
  response: {
    200: secretZodSchema,
  },
};

export const updateSecretFavouriteValidationSchema: FastifySchema = {
  tags: ["Secrets"],
  summary: "update-favourite",
  body: updateSecretFavouriteSchema,
  response: {
    200: secretZodSchema,
  },
};

export const deleteSecretValidationSchema: FastifySchema = {
  tags: ["Secrets"],
  summary: "delete",
  querystring: deleteSecretSchema,
  response: {
    200: zodString,
  },
};
