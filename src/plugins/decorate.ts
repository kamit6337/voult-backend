import fp from "fastify-plugin";

export default fp(async (fastify) => {
  fastify.decorateRequest("user");
});
