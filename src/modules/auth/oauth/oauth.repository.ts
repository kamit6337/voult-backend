import mongoose, { ClientSession } from "mongoose";
import { OAuthModel } from "./oauth.model.js";
import { CreateRepoType, GetUserRepoType } from "./oauth.types.js";
import { userRepository } from "@/modules/user/user.repository.js";
import { CreateUserRepoType } from "@/modules/user/user.types.js";

class OAuthRepository {
  async create(data: CreateRepoType, session?: ClientSession) {
    return OAuthModel.create(
      [
        {
          userId: data.userId,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
        },
      ],
      { session },
    );
  }

  async getUser(data: GetUserRepoType) {
    return OAuthModel.findOne({
      provider: data.provider,
      providerAccountId: data.providerAccountId,
    });
  }

  async createOAuthAndUser(
    userData: Omit<CreateUserRepoType, "avatar"> & { avatar: string },
    oauthData: GetUserRepoType,
  ) {
    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const user = await userRepository.create(
          {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            isEmailVerified: userData.isEmailVerified,
            avatar: userData.avatar,
          },
          session,
        );

        await this.create(
          {
            userId: user[0]._id,
            provider: oauthData.provider,
            providerAccountId: oauthData.providerAccountId,
          },
          session,
        );

        return user[0]._id.toString();
      });

      return result;
    } finally {
      await session.endSession();
    }
  }
}

export const oauthRepository = new OAuthRepository();
