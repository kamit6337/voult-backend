import z from "zod";
import { userZodSchema } from "./user.zod.js";

export const userResponseSchema = userZodSchema.pick({
  _id: true,
  firstName: true,
  lastName: true,
  email: true,
  avatar: true,
  role: true,
});

export type UserResponseType = z.infer<typeof userResponseSchema>;
