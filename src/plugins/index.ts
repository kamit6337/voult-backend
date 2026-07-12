import fp from "fastify-plugin";
import corsPlugin from "./cors.js";
import helmetPlugin from "./helmet.js";
import jwtPlugin from "./jwt.js";
import mongoosePlugin from "./mongoose.js";
import cookiePlugin from "./cookie.js";
import swaggerPlugin from "./swagger.js";
import sensiblePlugin from "./sensible.js";
import compressPlugin from "./compress.js";
import globalErrorPlugin from "./error-handler.js";
import decorateRequestPlugin from "./decorate.js";

export default fp(async (fastify) => {
  // DECORATE
  await fastify.register(decorateRequestPlugin);

  // SECURITY
  await fastify.register(helmetPlugin);
  await fastify.register(corsPlugin);

  // PERFORMANCE
  await fastify.register(compressPlugin);

  // REQUEST PROCESSING
  await fastify.register(cookiePlugin);
  // await fastify.register(jwtPlugin);

  // UTILITIES
  await fastify.register(sensiblePlugin);

  // INFRASTRUCTURE
  await fastify.register(mongoosePlugin);

  // DOCUMENTATION
  await fastify.register(swaggerPlugin);

  // GLOBAL ERROR HANDLER
  await fastify.register(globalErrorPlugin);
});
