import { z } from "zod";
import { emailSchema, nameSchema, passwordSchema } from "./shared";

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
