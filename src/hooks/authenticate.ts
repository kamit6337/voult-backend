import { env } from "@/config/env.js";
import { authCookie } from "@/modules/auth/auth.cookie.js";
import { authService } from "@/modules/auth/auth.service.js";
import {
  AccessTokenObjType,
  RefreshTokenObjType,
} from "@/modules/auth/auth.types.js";
import { decrypt } from "@/shared/utils/encrypt.js";
import { jwtEncrypt } from "@/shared/utils/jwtEncrypt.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const accessToken = authCookie.getAccessToken(request);

    if (!accessToken) {
      // check refresh token is present or not
      const refreshToken = authCookie.getRefreshToken(request);

      // if not present, send error of login
      if (!refreshToken) {
        return reply
          .code(401)
          .send("UnAuthorized Access. Refresh Token absent");
      }

      console.log("refreshToken", refreshToken);

      // if present, validate with session, is not expired - create a new access token and update refresh token
      const refreshTokenObj = decrypt<RefreshTokenObjType>(
        refreshToken,
        env.REFRESH_TOKEN_SECRET,
      );

      if (Date.now() > refreshTokenObj.exp) {
        return reply
          .code(401)
          .send("UnAuthorized Access. Refresh Token expired");
      }

      const result =
        await authService.checkSessionWithRefreshToken(refreshTokenObj);

      authCookie.setAccessToken(reply, result.accessToken);
      authCookie.setRefreshToken(reply, result.refreshToken);

      request.userObj = result.accessTokenObj;
    } else {
      const payload = jwtEncrypt.verify<AccessTokenObjType>(accessToken, {
        secret: env.ACCESS_TOKEN_SECRET,
      });

      request.userObj = payload;
    }
  } catch (error) {
    console.log("ERROR Authenticate", error);
    return reply.code(401).send("UnAuthorized Access. Error in Authenticate");
  }
}
