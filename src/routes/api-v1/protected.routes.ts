import { authenticate } from "@/hooks/authenticate.js";
import adminRoutes from "@/modules/admin/admin.routes.js";
import { projectRoutes } from "@/modules/project/project.routes.js";
import { secretRoutes } from "@/modules/secret/secret.routes.js";
import userRoutes from "@/modules/user/user.routes.js";
import { FastifyPluginAsync } from "fastify";

export const protectedRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.addHook("preHandler", authenticate);

  await fastify.register(userRoutes, {
    prefix: "/users",
  });

  await fastify.register(secretRoutes, {
    prefix: "/secrets",
  });

  await fastify.register(projectRoutes, {
    prefix: "/projects",
  });

  await fastify.register(adminRoutes, {
    prefix: "/admin",
  });
};
