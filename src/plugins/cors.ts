import fp from "fastify-plugin";
import cors from "@fastify/cors";
import { env } from "@/config/env.js";

export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin: ["http://localhost:3000", "http://localhost:5173", env.CORS_ORIGIN],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });
});
