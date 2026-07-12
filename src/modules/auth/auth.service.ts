import mongoose from "mongoose";
import { userRepository } from "../user/user.repository.js";
import { AppError } from "@/shared/errors/app-error.js";
import { LoginRequestType, RegisterRequestType } from "./auth.request.js";
import { generateOtp } from "@/utils/generateOtp.js";
import { comparePassword, hashPassword } from "@/shared/utils/bcrypt.js";
import {
  AccessTokenObjType,
  CreateAccessAndRefreshTokenType,
  CreateSessionServiceType,
  RefreshTokenObjType,
  VerifyOTPServiceType,
} from "./auth.types.js";
import { createSessionId } from "./auth.model.js";
import generateCryptoString from "@/utils/generateCryptoString.js";
import { env } from "@/config/env.js";
import { authRepository } from "./auth.repository.js";
import ms from "ms";
import { jwtEncrypt } from "@/shared/utils/jwtEncrypt.js";
import { CreateUserRepoType } from "../user/user.types.js";
import { encrypt } from "@/shared/utils/encrypt.js";

export class AuthService {
  async login(body: LoginRequestType) {
    const { email } = body;

    const findUser = await userRepository.findByEmail(email);

    if (!findUser) {
      throw new AppError(404, "Sign Up first.");
    }

    const otp = generateOtp();

    await this.sendOTP(findUser.email, otp);

    return {
      userId: findUser._id.toString(),
      otp: await hashPassword(otp),
    };
  }

  async register(body: RegisterRequestType) {
    const existingUser = await userRepository.findByEmail(body.email);

    if (existingUser) {
      throw new AppError(400, "Email already exists");
    }

    const otp = generateOtp();

    await this.sendOTP(body.email, otp);

    return {
      otp: await hashPassword(otp),
    };
  }

  async resendOTP(email: string) {
    const otp = generateOtp();

    await this.sendOTP(email, otp);

    return {
      otp: await hashPassword(otp),
    };
  }

  private async sendOTP(email: string, otp: string) {}

  async verifyOTP({
    otp,
    hashedOTP,
    cookie,
    userAgent,
    ipAddress,
  }: VerifyOTPServiceType) {
    const isOTPVerified = await comparePassword(otp, hashedOTP);

    if (!isOTPVerified) {
      throw new AppError(404, "Wrong OTP provided. Please provide correct OTP");
    }

    const dataType = cookie.type;

    if (dataType === "login") {
      const { userId, email } = cookie;

      const result = await this.accessAndRefreshToken({
        email,
        userId: new mongoose.Types.ObjectId(userId),
        ipAddress,
        userAgent,
      });

      return result;
    }

    const { email, firstName, lastName } = cookie;

    const result = await this.createUserAndAccessAndRefreshToken(
      {
        firstName,
        lastName,
        email,
        isEmailVerified: true,
      },
      userAgent,
      ipAddress,
    );

    return result;
  }

  private async createUserAndAccessAndRefreshToken(
    userData: CreateUserRepoType,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const randomRefreshToken = generateCryptoString();
    const hashedToken = await hashPassword(randomRefreshToken);

    const result = await authRepository.createUserAndSession({
      hashedToken,
      userAgent,
      ipAddress,
      userData: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        isEmailVerified: userData.isEmailVerified,
      },
    });

    return this.createAccessAndRefreshToken({
      userId: result.userId,
      email: userData.email,
      sessionId: result.sessionId,
      randomRefreshStr: randomRefreshToken,
    });
  }

  async accessAndRefreshToken(
    data: CreateSessionServiceType & { email: string },
  ) {
    const sessionId = createSessionId();
    const randomRefreshToken = generateCryptoString();

    const hashedToken = await hashPassword(randomRefreshToken);

    await authRepository.createSession({
      _id: sessionId,
      userId: data.userId,
      hashedRefreshToken: hashedToken,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      expiresAt: new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRES_IN)),
    });

    return this.createAccessAndRefreshToken({
      userId: data.userId.toString(),
      email: data.email,
      sessionId: sessionId.toString(),
      randomRefreshStr: randomRefreshToken,
    });
  }

  private createAccessAndRefreshToken(data: CreateAccessAndRefreshTokenType) {
    const accessTokenObj: AccessTokenObjType = {
      userId: data.userId,
      email: data.email,
      type: "access",
    };

    const refreshTokenObj: RefreshTokenObjType = {
      userId: data.userId,
      sessionId: data.sessionId,
      randomStr: data.randomRefreshStr,
      type: "refresh",
      exp: Date.now() + ms(env.REFRESH_TOKEN_EXPIRES_IN),
    };

    const encryptAccessToken = jwtEncrypt.sign(accessTokenObj, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
      secret: env.ACCESS_TOKEN_SECRET,
    });

    const encryptRefreshToken = encrypt(
      refreshTokenObj,
      env.REFRESH_TOKEN_SECRET,
    );

    // const encryptRefreshToken = jwtEncrypt.sign(refreshTokenObj, {
    //   expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    //   secret: env.REFRESH_TOKEN_SECRET,
    // });

    return {
      accessToken: encryptAccessToken,
      refreshToken: encryptRefreshToken,
      accessTokenObj,
      refreshTokenObj,
    };
  }

  async logoutFromAllSession(userId: string) {
    await authRepository.deleteAllSessionByUserId(userId);

    return "All Session Deleted";
  }

  async checkSessionWithRefreshToken(
    data: RefreshTokenObjType & { ipAddress?: string; userAgennt?: string },
  ) {
    const session = await authRepository.getSessionById(data.sessionId);

    if (!session) {
      throw new AppError(401, "Issue with Refresh Token");
    }

    // check expire
    const sessionExpireDate = session.expiresAt.getTime();
    const now = Date.now();

    if (now > sessionExpireDate) {
      throw new AppError(401, "Token is Expired");
    }

    if (!session.userId) {
      throw new AppError(401, "User is not present");
    }

    const sessionUser = session.userId as unknown as {
      _id: mongoose.Types.ObjectId;
      email: string;
    };

    // check userId
    if (sessionUser._id.toString() !== data.userId) {
      throw new AppError(401, "UserId is not matching");
    }

    // check random string
    const isHashedMatch = await comparePassword(
      data.randomStr,
      session.hashedRefreshToken,
    );

    if (!isHashedMatch) {
      throw new AppError(401, "Random Str is not matching");
    }

    return this.newAccessAndRotateRefreshToken({
      userId: sessionUser._id,
      email: sessionUser.email,
      sessionId: data.sessionId,
      ipAddress: data.ipAddress,
      userAgent: data.userAgennt,
    });
  }

  async newAccessAndRotateRefreshToken(
    data: CreateSessionServiceType & { email: string; sessionId: string },
  ) {
    const randomRefreshToken = generateCryptoString();
    const hashedToken = await hashPassword(randomRefreshToken);

    await authRepository.rotateRefreshToken(data.sessionId, hashedToken);

    return this.createAccessAndRefreshToken({
      userId: data.userId.toString(),
      email: data.email,
      sessionId: data.sessionId,
      randomRefreshStr: randomRefreshToken,
    });
  }
}

export const authService = new AuthService();
