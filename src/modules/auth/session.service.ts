import generateCryptoString from "@/utils/generateCryptoString.js";
import { CreateUserRepoType } from "../user/user.types.js";
import { comparePassword, hashPassword } from "@/shared/utils/bcrypt.js";
import { authRepository } from "./auth.repository.js";
import {
  AccessTokenObjType,
  CreateAccessAndRefreshTokenType,
  CreateSessionServiceType,
  RefreshTokenObjType,
} from "./auth.types.js";
import { createSessionId } from "./auth.model.js";
import ms from "ms";
import { env } from "@/config/env.js";
import { jwtEncrypt } from "@/shared/utils/jwtEncrypt.js";
import { encrypt } from "@/shared/utils/encrypt.js";
import { AppError } from "@/shared/errors/app-error.js";
import mongoose from "mongoose";

class SessionService {
  //   CHECK SESSION WHEN ACCESS TOKEN EXPIRES
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

  // NEW ACCESS AND REFRESH TOKEN - UPON ACCESS TOKEN EXPIRE
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

  //   CREATE USER,SESSION AND ACCESS AND REFRESH LOGIN - UPON SIGN-UP
  async createUserAndAccessAndRefreshToken(
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
        password: userData.password,
      },
    });

    return this.createAccessAndRefreshToken({
      userId: result.userId,
      email: userData.email,
      sessionId: result.sessionId,
      randomRefreshStr: randomRefreshToken,
    });
  }

  //   CREATE SESSION AND ACCESS AND REFRESH LOGIN - UPON LOGIN
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
}

export const sessionService = new SessionService();
