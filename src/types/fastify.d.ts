import { AccessTokenObjType } from "@/modules/auth/auth.types.ts";
import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userObj: AccessTokenObjType;
  }
}
