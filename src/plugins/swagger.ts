import fp from "fastify-plugin";

import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "@/shared/validation/zod.js";

export default fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Voult API",
        description: "Voult Backend API",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/docs",

    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },

    staticCSP: true,
  });
});
