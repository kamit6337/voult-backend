import z from "zod";

export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().min(3),
});
