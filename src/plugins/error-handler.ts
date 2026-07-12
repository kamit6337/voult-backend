import { env } from "@/config/env.js";
import { AppError } from "@/shared/errors/app-error.js";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
  await fastify.setErrorHandler((error: any, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "TokenExpiredError") {
      return reply.code(500).send({
        success: false,
        message: "Time lapsed. Please try again",
      });
    }

    if (error.name === "TypeError") {
      return reply.code(404).send({
        success: false,
        message: "Server is down. Please login again after sometime!",
      });
    }

    if (error.code === 11000) {
      let message = "";

      Object.keys(error.keyValue).forEach((key) => {
        message += key + ", ";
      });

      message = message.split(",").slice(0, -1).join(",");
      message = message + " - this should be Unique. Try Different....";

      return reply.code(400).send({
        success: false,
        message,
      });
    }

    if (error.message.includes("ETIMEDOUT")) {
      return reply.code(404).send({
        success: false,
        message: "Please check your connection. This is a network issues.",
      });
    }

    if (error.name === "AxiosError") {
      return reply.code(404).send({
        success: false,
        message: "Please check your URL or you API key or Bearer Token.",
      });
    }

    if (error.name === "InternalOAuthError") {
      return reply.redirect(env.CORS_ORIGIN);
    }

    console.log("Global Error Handler", error);
    console.log("error name", error.name);
    console.log("error msg", error.message);
    console.log("error cause", error.cause);

    return reply.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  });
});
