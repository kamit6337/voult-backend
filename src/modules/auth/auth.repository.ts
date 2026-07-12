import mongoose, { ClientSession } from "mongoose";
import { createSessionId, SessionModel } from "./auth.model.js";
import {
  CreateSessionRepositoryType,
  CreateUserAndSessionType,
} from "./auth.types.js";
import { userRepository } from "../user/user.repository.js";
import { env } from "@/config/env.js";
import ms from "ms";

class AuthRepository {
  async createSession(
    data: CreateSessionRepositoryType,
    session?: ClientSession,
  ) {
    return SessionModel.create(
      [
        {
          _id: data._id,
          userId: data.userId,
          userAgent: data.userAgent,
          ipAddress: data.ipAddress,
          hashedRefreshToken: data.hashedRefreshToken,
          expiresAt: data.expiresAt,
        },
      ],
      { session },
    );
  }

  async getSessionById(sessionId: string) {
    return SessionModel.findOne({
      _id: sessionId,
    })
      .populate({
        path: "userId",
        select: "_id email",
      })
      .exec();
  }

  async rotateRefreshToken(sessionId: string, hashedToken: string) {
    return SessionModel.findOneAndUpdate(
      {
        _id: sessionId,
      },
      {
        hashedRefreshToken: hashedToken,
        lastUsedAt: Date.now(),
      },
      {
        new: true,
      },
    );
  }

  async createUserAndSession(data: CreateUserAndSessionType) {
    const { userData, hashedToken, ipAddress, userAgent } = data;

    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const newUser = await userRepository.create(
          {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            isEmailVerified: userData.isEmailVerified,
          },
          session,
        );

        const sessionId = createSessionId();

        await this.createSession(
          {
            _id: sessionId,
            userId: newUser[0]._id,
            hashedRefreshToken: hashedToken,
            ipAddress,
            userAgent,
            expiresAt: new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRES_IN)),
          },
          session,
        );

        return {
          userId: newUser[0]._id.toString(),
          sessionId: sessionId.toString(),
        };
      });

      return result;
    } finally {
      await session.endSession();
    }
  }

  deleteAllSessionByUserId(userId: string) {
    return SessionModel.deleteMany({
      userId,
    });
  }
}

export const authRepository = new AuthRepository();
