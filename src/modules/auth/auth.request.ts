import z from "zod";

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
