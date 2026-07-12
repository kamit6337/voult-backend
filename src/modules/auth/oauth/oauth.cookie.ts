import { env } from "@/config/env.js";
import { AppError } from "@/shared/errors/app-error.js";
import { CookieSerializeOptions } from "@fastify/cookie";
import { FastifyReply, FastifyRequest } from "fastify";

class OAuthCookie {
  private cookieOptions = (
    data?: Pick<CookieSerializeOptions, "maxAge">,
  ): CookieSerializeOptions => ({
    httpOnly: true,
    maxAge: data?.maxAge || 60 * 15, //15 minutes,
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    secure: env.NODE_ENV === "production",
    signed: true,
    path: "/",
  });

  setOAuthState(reply: FastifyReply, payload: string) {
    reply.setCookie("oauth_state", payload, this.cookieOptions());
  }

  getOAuthState(request: FastifyRequest) {
    const cookie = request.cookies["oauth_state"];
    return this.validateSignedCookie(request, cookie);
  }

  clearOAuthState(reply: FastifyReply) {
    reply.clearCookie("oauth_state", this.cookieOptions());
  }

  private validateSignedCookie(
    request: FastifyRequest,
    cookie: string | undefined,
  ) {
    if (!cookie) {
      throw new AppError(400, "Issue with the cookies");
    }

    const result = request.unsignCookie(cookie);

    if (!result.valid) {
      throw new AppError(400, "Misuse with the cookies");
    }

    return result.value;
  }
}

export const oauthCookie = new OAuthCookie();
