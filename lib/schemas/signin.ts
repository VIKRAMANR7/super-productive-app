import { z } from "zod";
import { emailSchema } from "./shared";

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "Password is required" }),
  rememberMe: z.boolean(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
