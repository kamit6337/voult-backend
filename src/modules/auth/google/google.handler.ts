import generateCryptoString from "@/utils/generateCryptoString.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { googleService } from "./google.service.js";
import { AppError } from "@/shared/errors/app-error.js";
import { GoogleCallbackRequest } from "./google.validation.js";
import { oauthCookie } from "../oauth/oauth.cookie.js";
import { env } from "@/config/env.js";

class GoogleHandler {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const state = generateCryptoString();

    oauthCookie.setOAuthState(reply, state);
    const url = googleService.getAuthUrl(state);
    return reply.redirect(url);
  }

  async googleRedirect(
    request: FastifyRequest<{ Querystring: GoogleCallbackRequest }>,
    reply: FastifyReply,
  ) {
    try {
      // only validating oauth state
      const stateFromCookie = oauthCookie.getOAuthState(request);
      const queryState = request.query?.state;

      // CSRF issue
      if (!queryState || queryState !== stateFromCookie) {
        throw new AppError(400, "Issue with OAuth State");
      }

      const code = request.query?.code;

      if (!code) {
        throw new AppError(403, "Invalid OAuth");
      }

      const tokens = await googleService.exchangeCode(code as string);

      if (!tokens.id_token) {
        throw new AppError(403, "Invalid OAuth");
      }

      const payload = await googleService.verifyIdToken(tokens.id_token);

      if (!payload) {
        throw new AppError(403, "Issue in getting user data from Google");
      }

      const result = await googleService.verifyUserFromDB(payload);

      const oauthLoginUrl = `${env.CORS_ORIGIN}/oauth?verify=${result}`;

      return reply.redirect(oauthLoginUrl);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Something went wrong.Please try later";

      const oauthLoginUrl = `${env.CORS_ORIGIN}/oauth?error=${msg}`;
      return reply.redirect(oauthLoginUrl);
    }
  }
}

export const googleHandler = new GoogleHandler();
