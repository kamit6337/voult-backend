// shared/types/fastify.ts

import type {
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from "fastify";

export type Reply = FastifyReply;

export type Request<T extends RouteGenericInterface> = FastifyRequest<T>;
