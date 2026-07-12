import { env } from "@/config/env.js";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { oauthRepository } from "../oauth/oauth.repository.js";
import { jwtEncrypt } from "@/shared/utils/jwtEncrypt.js";
import { userRepository } from "@/modules/user/user.repository.js";

class GoogleService {
  private client: OAuth2Client = new OAuth2Client({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URL,
  });

  getAuthUrl(state: string): string {
    return this.client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
      state,
    });
  }

  async exchangeCode(code: string) {
    const { tokens } = await this.client.getToken(code);
    return tokens;
  }

  async verifyIdToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    return ticket.getPayload();
  }

  async verifyUserFromDB(payload: TokenPayload) {
    const { email, sub } = payload;

    const isUseroAuthPresent = await oauthRepository.getUser({
      providerAccountId: sub,
      provider: "google",
    });

    if (isUseroAuthPresent) {
      const isUserPresent = await userRepository.findById(
        isUseroAuthPresent.userId.toString(),
      );

      if (!isUserPresent) {
        throw new Error("User is not present against OAuth");
      }

      const obj = {
        userId: isUserPresent._id.toString(),
        email: isUserPresent.email,
      };

      const encrypted = jwtEncrypt.sign(obj, {
        secret: env.JWT_ENCRYPTION_KEY,
        expiresIn: "15m",
      });

      return encrypted;
    }

    const result = await oauthRepository.createOAuthAndUser(
      {
        firstName: payload.given_name!,
        lastName: payload.family_name!,
        email: email!,
        isEmailVerified: payload.email_verified!,
        avatar: payload.picture!,
      },
      { providerAccountId: sub, provider: "google" },
    );

    const obj = {
      userId: result,
      email,
    };

    const encrypted = jwtEncrypt.sign(obj, {
      secret: env.JWT_ENCRYPTION_KEY,
      expiresIn: "15m",
    });

    console.log("PAYLOAD", payload);

    return encrypted;
  }
}

export const googleService = new GoogleService();
