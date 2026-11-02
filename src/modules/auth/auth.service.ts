import mongoose from "mongoose";
import { userRepository } from "../user/user.repository.js";
import { AppError } from "@/shared/errors/app-error.js";
import {
  LoginRequestType,
  RegisterRequestType,
  SignInRequestType,
  SignUpRequestType,
} from "./auth.request.js";
import { generateOtp } from "@/utils/generateOtp.js";
import { comparePassword, hashPassword } from "@/shared/utils/bcrypt.js";
import { VerifyOTPServiceType } from "./auth.types.js";
import { authRepository } from "./auth.repository.js";
import { sessionService } from "./session.service.js";

type AuthHeader = {
  ipAddress: string | undefined;
  userAgent: string | undefined;
};

export class AuthService {
  async signin(body: SignInRequestType & AuthHeader) {
    const findUser = await userRepository.findByEmail(body.email);

    if (!findUser) {
      throw new AppError(404, "Sign Up first.");
    }

    const isVerifyPassword = await comparePassword(
      body.password,
      findUser.password || "",
    );

    if (!isVerifyPassword) throw new AppError(404, "Wrong password provided");

    // CREATE SESSION UPON VERIFY LOGIN
    const result = await sessionService.accessAndRefreshToken({
      email: findUser.email,
      userId: findUser._id,
      ipAddress: body.ipAddress,
      userAgent: body.userAgent,
    });

    return result;
  }

  async signup(body: SignUpRequestType & AuthHeader) {
    console.log("BODY", body);
    const findUser = await userRepository.findByEmail(body.email);

    if (findUser) {
      throw new AppError(404, "Already Sign Up.");
    }

    const { email, firstName, lastName, ipAddress, userAgent, password } = body;

    // CREATE USER AND SESSION
    const result = await sessionService.createUserAndAccessAndRefreshToken(
      {
        firstName,
        lastName,
        email,
        isEmailVerified: true,
        password,
      },
      userAgent,
      ipAddress,
    );

    return result;
  }

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

      // CREATE NEW SESSION UPON LOGIN
      const result = await sessionService.accessAndRefreshToken({
        email,
        userId: new mongoose.Types.ObjectId(userId),
        ipAddress,
        userAgent,
      });

      return result;
    }

    const { email, firstName, lastName } = cookie;

    // CREATE USER AND SESSION
    const result = await sessionService.createUserAndAccessAndRefreshToken(
      {
        firstName,
        lastName,
        email,
        isEmailVerified: true,
        password: null,
      },
      userAgent,
      ipAddress,
    );

    return result;
  }

  async logoutFromAllSession(userId: string) {
    await authRepository.deleteAllSessionByUserId(userId);

    return "All Session Deleted";
  }
}

export const authService = new AuthService();
