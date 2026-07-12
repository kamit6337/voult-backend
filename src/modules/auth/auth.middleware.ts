import {
  loginRequestSchema,
  oauthSessionRequestSchema,
  registerRequestSchema,
  verifyOTPRequestSchema,
} from "./auth.request.js";

export const loginMiddleware = {
  schema: {
    tags: ["Authentication"],
    summary: "Login",
    body: loginRequestSchema,
    // response: {
    //   200: loginResponseSchema,
    // },
  },
} as const;

export const registerMiddleware = {
  schema: {
    tags: ["Authentication"],
    summary: "Register",
    body: registerRequestSchema,
    // response: {
    //   200: loginResponseSchema,
    // },
  },
} as const;

export const verifyOtpMiddleware = {
  schema: {
    tags: ["Authentication"],
    summary: "Verify-OTP",
    body: verifyOTPRequestSchema,
  },
} as const;

export const oauthSessionMiddleware = {
  schema: {
    tags: ["Authentication"],
    summary: "OAuth-Session",
    body: oauthSessionRequestSchema,
  },
} as const;
