import { FastifyPluginAsync } from "fastify";
import { authHandler } from "./auth.handler.js";
import {
  loginMiddleware,
  logoutUserMiddleware,
  oauthSessionMiddleware,
  registerMiddleware,
  signInMiddleware,
  signUpMiddleware,
  verifyOtpMiddleware,
} from "./auth.middleware.js";
import { googleRoutes } from "./google/google.routes.js";
import { authenticate } from "@/hooks/authenticate.js";

export const authRoutes: FastifyPluginAsync = async function authRoutes(
  fastify,
) {
  // SIGN-UP AND SIGN-IN USING PASSWORD AND SAVE IT IN DB
  fastify.post("/sign-in", { schema: signInMiddleware }, authHandler.signin);

  fastify.post("/sign-up", { schema: signUpMiddleware }, authHandler.signup);

  // NEED TO SEND OTP TO EMAIL : NOT POSSIBLE YET
  fastify.post("/login", loginMiddleware, authHandler.login);

  fastify.post("/register", registerMiddleware, authHandler.register);

  fastify.post("/resend-otp", authHandler.resendOTP);

  fastify.post("/verify-otp", verifyOtpMiddleware, authHandler.verifyOTP);

  fastify.post(
    "/oauth-session",
    oauthSessionMiddleware,
    authHandler.oauthSession,
  );

  fastify.delete(
    "/logout",
    { preHandler: [authenticate], schema: logoutUserMiddleware },
    authHandler.logout,
  );

  fastify.register(googleRoutes);
};
