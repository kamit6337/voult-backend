import { FastifyPluginAsync } from "fastify";
import { authHandler } from "./auth.handler.js";
import {
  loginMiddleware,
  oauthSessionMiddleware,
  registerMiddleware,
  verifyOtpMiddleware,
} from "./auth.middleware.js";
import { googleRoutes } from "./google/google.routes.js";
import { authenticate } from "@/hooks/authenticate.js";

export const authRoutes: FastifyPluginAsync = async function authRoutes(
  fastify,
) {
  fastify.post("/login", loginMiddleware, authHandler.login);

  fastify.post("/register", registerMiddleware, authHandler.register);

  fastify.post("/resend-otp", authHandler.resendOTP);

  fastify.post("/verify-otp", verifyOtpMiddleware, authHandler.verifyOTP);

  fastify.post(
    "/oauth-session",
    oauthSessionMiddleware,
    authHandler.oauthSession,
  );

  fastify.delete("/logout", { preHandler: [authenticate] }, authHandler.logout);

  fastify.register(googleRoutes);
};
