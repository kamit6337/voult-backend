import z from "zod";

export const signInRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type SignInRequestType = z.infer<typeof signInRequestSchema>;

export const signUpRequestSchema = z.object({
  firstName: z.string().min(3).max(20),
  lastName: z.string().min(3).max(20),
  email: z.email(),
  password: z.string().min(8, "Password need to be strong").max(20),
});

export type SignUpRequestType = z.infer<typeof signUpRequestSchema>;

export const loginRequestSchema = z.object({
  email: z.email(),
});

export type LoginRequestType = z.infer<typeof loginRequestSchema>;

export const registerRequestSchema = z.object({
  email: z.email(),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
});

export type RegisterRequestType = z.infer<typeof registerRequestSchema>;

export const verifyOTPRequestSchema = z.object({
  otp: z.string().length(6),
});

export type VerifyOTPRequestType = z.infer<typeof verifyOTPRequestSchema>;

export const oauthSessionRequestSchema = z.object({
  token: z.string().min(10),
});

export type OAuthSessionRequestType = z.infer<typeof oauthSessionRequestSchema>;
