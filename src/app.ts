import Fastify from "fastify";
import registerRoutes from "./routes/index.js";
import registerPlugin from "./plugins/index.js";
import {
  validatorCompiler,
  serializerCompiler,
} from "@/shared/validation/zod.js";

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
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
