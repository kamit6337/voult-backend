import { env } from "@/config/env.js";
import { AppError } from "@/shared/errors/app-error.js";
import { CookieSerializeOptions } from "@fastify/cookie";
import { FastifyReply, FastifyRequest } from "fastify";
import ms from "ms";

class AuthCookie {
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

  setAuthData(reply: FastifyReply, value: string) {
    reply.setCookie(
      "auth_data",
      value,
      this.cookieOptions({ maxAge: 60 * 60 }),
    );
  }

  getAuthData(request: FastifyRequest) {
    const cookie = request.cookies["auth_data"];
    return this.validateSignedCookie(request, cookie, false);
  }

  clearAuthData(reply: FastifyReply) {
    reply.clearCookie("auth_data", this.cookieOptions({ maxAge: 60 * 60 }));
  }

  setOTP(reply: FastifyReply, value: string) {
    reply.setCookie("verification_otp", value, this.cookieOptions());
  }

  getOTP(request: FastifyRequest) {
    const cookie = request.cookies["verification_otp"];
    return this.validateSignedCookie(request, cookie);
  }

  clearOTP(reply: FastifyReply) {
    reply.clearCookie("verification_otp", this.cookieOptions());
  }

  setAccessToken(reply: FastifyReply, access_token: string) {
    reply.setCookie(
      "access_token",
      access_token,
      this.cookieOptions({ maxAge: ms(env.ACCESS_TOKEN_EXPIRES_IN) / 1000 }),
    );
  }

  getAccessToken(request: FastifyRequest) {
    const cookie = request.cookies["access_token"];
    return this.validateSignedCookie(request, cookie, true);
  }

  clearAccessToken(reply: FastifyReply) {
    reply.clearCookie(
      "access_token",
      this.cookieOptions({ maxAge: ms(env.ACCESS_TOKEN_EXPIRES_IN) / 1000 }),
    );
  }

  setRefreshToken(reply: FastifyReply, Refresh_token: string) {
    reply.setCookie(
      "refresh_token",
      Refresh_token,
      this.cookieOptions({ maxAge: ms(env.REFRESH_TOKEN_EXPIRES_IN) / 1000 }),
    );
  }

  getRefreshToken(request: FastifyRequest) {
    const cookie = request.cookies["refresh_token"];
    return this.validateSignedCookie(request, cookie);
  }

  clearRefreshToken(reply: FastifyReply) {
    reply.clearCookie(
      "refresh_token",
      this.cookieOptions({ maxAge: ms(env.REFRESH_TOKEN_EXPIRES_IN) / 1000 }),
    );
  }

  private validateSignedCookie(
    request: FastifyRequest,
    cookie: string | undefined,
    returnNull = false,
  ) {
    if (!cookie) {
      if (returnNull) {
        return null;
      }
      throw new AppError(400, "Issue with the cookies");
    }

    const result = request.unsignCookie(cookie);

    if (!result.valid) {
      if (returnNull) {
        return null;
      }
      throw new AppError(400, "Misuse with the cookies");
    }

    return result.value;
  }
}

export const authCookie = new AuthCookie();
