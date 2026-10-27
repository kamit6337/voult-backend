import { FastifySchema } from "fastify";
import {
  createSecretSchema,
  deleteSecretSchema,
  updateSecretFavouriteSchema,
  updateSecretSchema,
} from "./secret.request.js";
import { secretZodSchema, zodString } from "./secret.zod.js";

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
