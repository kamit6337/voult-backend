import Fastify from "fastify";
import registerRoutes from "./routes/index.js";
import registerPlugin from "./plugins/index.js";
import {
  validatorCompiler,
  serializerCompiler,
} from "@/shared/validation/zod.js";
import { env } from "./config/env.js";

const logger =
  env.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
        },
      }
    : true;

export async function buildApp() {
  const fastify = Fastify({
    logger,
  });

  // validator and serializer zod schema
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // Plugins
  await fastify.register(registerPlugin);
  // Hooks

  // Routes
  await fastify.register(registerRoutes);

  return fastify;
}
