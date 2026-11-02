import { FastifySchema } from "fastify/types/schema.js";
import {
  loginRequestSchema,
  oauthSessionRequestSchema,
  registerRequestSchema,
  signInRequestSchema,
  verifyOTPRequestSchema,
  signUpRequestSchema,
} from "./auth.request.js";
import { authResponseSchema } from "./auth.response.js";

export const signInMiddleware: FastifySchema = {
  tags: ["Authenticate"],
  summary: "sign-in",
  body: signInRequestSchema,
  response: {
    200: authResponseSchema,
  },
};

export const signUpMiddleware: FastifySchema = {
  tags: ["Authenticate"],
  summary: "sign-in",
  body: signUpRequestSchema,
  response: {
    200: authResponseSchema,
  },
};

export const loginMiddleware = {
  schema: {
    tags: ["Authentication"],
    summary: "Login",
    body: loginRequestSchema,
    response: {
      200: authResponseSchema,
    },
  },
} as const;

export const registerMiddleware = {
  schema: {
    tags: ["Authentication"],
    summary: "Register",
    body: registerRequestSchema,
    response: {
      200: authResponseSchema,
    },
  },
} as const;

export const verifyOtpMiddleware = {
  schema: {
    tags: ["Authentication"],
    summary: "Verify-OTP",
    body: verifyOTPRequestSchema,
    response: {
      200: authResponseSchema,
    },
  },
} as const;

export const oauthSessionMiddleware = {
  schema: {
    tags: ["Authentication"],
    summary: "OAuth-Session",
    body: oauthSessionRequestSchema,
    response: {
      200: authResponseSchema,
    },
  },
} as const;

export const logoutUserMiddleware: FastifySchema = {
  tags: ["Authentication"],
  summary: "logout",
  response: {
    200: authResponseSchema,
  },
};
