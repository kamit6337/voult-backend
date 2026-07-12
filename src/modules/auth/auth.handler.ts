import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "./auth.service.js";
import {
  LoginRequestType,
  OAuthSessionRequestType,
  RegisterRequestType,
  VerifyOTPRequestType,
} from "./auth.request.js";
import { AUTH_HANDLER_ENCRYPT_TYPE } from "./auth.types.js";
import { authCookie } from "./auth.cookie.js";
import { AppError } from "@/shared/errors/app-error.js";
import { env } from "@/config/env.js";
import { jwtEncrypt } from "@/shared/utils/jwtEncrypt.js";
import { OAuthEncryptionType } from "./oauth/oauth.types.js";
import convertToMongoId from "@/utils/convertToMongoId.js";
import { oauthCookie } from "./oauth/oauth.cookie.js";

class AuthHandler {
  async login(
    request: FastifyRequest<{
      Body: LoginRequestType;
    }>,
    reply: FastifyReply,
  ) {
    const { email } = request.body;

    const result = await authService.login({ email });

    const obj: AUTH_HANDLER_ENCRYPT_TYPE = {
      type: "login",
      userId: result.userId,
      email,
    };

    const encrypted = jwtEncrypt.sign(obj, {
      expiresIn: env.JWT_ENCRYPTION_EXPIRE_IN,
      secret: env.JWT_ENCRYPTION_KEY,
    });

    authCookie.setAuthData(reply, encrypted);
    authCookie.setOTP(reply, result.otp);

    return reply.send({
      success: true,
      message: "OTP send to email for verification",
    });
  }

  async register(
    request: FastifyRequest<{ Body: RegisterRequestType }>,
    reply: FastifyReply,
  ) {
    const { email, firstName, lastName } = request.body;
    const result = await authService.register({ email, firstName, lastName });

    const obj: AUTH_HANDLER_ENCRYPT_TYPE = {
      email,
      firstName,
      lastName,
      type: "register",
    };

    const encrypted = jwtEncrypt.sign(obj, {
      expiresIn: env.JWT_ENCRYPTION_EXPIRE_IN,
      secret: env.JWT_ENCRYPTION_KEY,
    });

    authCookie.setAuthData(reply, encrypted);
    authCookie.setOTP(reply, result.otp);

    return reply.send({
      success: true,
      message: "OTP send to Email for verification",
    });
  }

  async resendOTP(request: FastifyRequest, reply: FastifyReply) {
    const encryptedAuthData = authCookie.getAuthData(request);

    if (!encryptedAuthData) {
      throw new AppError(400, "Issue in resending OTP");
    }

    const { email } = jwtEncrypt.verify<AUTH_HANDLER_ENCRYPT_TYPE>(
      encryptedAuthData,
      {
        secret: env.JWT_ENCRYPTION_KEY,
      },
    );

    const result = await authService.resendOTP(email);

    authCookie.setOTP(reply, result.otp);

    return {
      success: true,
      message: "OTP send again to your email",
    };
  }

  async verifyOTP(
    request: FastifyRequest<{ Body: VerifyOTPRequestType }>,
    reply: FastifyReply,
  ) {
    const cookieOtp = authCookie.getOTP(request);

    const authDataCookie = authCookie.getAuthData(request);

    if (!cookieOtp || !authDataCookie) {
      throw new AppError(400, "Issue in verifying OTP. Please try later");
    }

    const userAgent = request.headers["user-agent"];
    const ipAddress = request.ip;

    const { otp } = request.body;

    const auth_data = jwtEncrypt.verify<AUTH_HANDLER_ENCRYPT_TYPE>(
      authDataCookie,
      {
        secret: env.JWT_ENCRYPTION_KEY,
      },
    );

    const result = await authService.verifyOTP({
      otp,
      hashedOTP: cookieOtp,
      cookie: auth_data,
      userAgent,
      ipAddress,
    });

    authCookie.setAccessToken(reply, result.accessToken);
    authCookie.setRefreshToken(reply, result.refreshToken);

    authCookie.clearAuthData(reply);
    authCookie.clearOTP(reply);

    return {
      success: true,
      message: "Verification completed successfully.",
    };
  }

  async oauthSession(
    request: FastifyRequest<{
      Body: OAuthSessionRequestType;
    }>,
    reply: FastifyReply,
  ) {
    const userAgent = request.headers["user-agent"];
    const ipAddress = request.ip;

    const token = request.body.token;

    oauthCookie.clearOAuthState(reply);
    authCookie.clearAccessToken(reply);
    authCookie.clearRefreshToken(reply);

    const decrypt = jwtEncrypt.verify<OAuthEncryptionType>(token, {
      secret: env.JWT_ENCRYPTION_KEY,
    });

    const result = await authService.accessAndRefreshToken({
      email: decrypt.email,
      userId: convertToMongoId(decrypt.userId),
      userAgent,
      ipAddress,
    });

    authCookie.setAccessToken(reply, result.accessToken);
    authCookie.setRefreshToken(reply, result.refreshToken);

    return {
      success: true,
      message: "OAuth Login completed successfully.",
    };
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.userObj;

    const response = await authService.logoutFromAllSession(userId);

    authCookie.clearAccessToken(reply);
    authCookie.clearRefreshToken(reply);

    return reply.send({
      success: true,
      message: response,
    });
  }
}

export const authHandler = new AuthHandler();
