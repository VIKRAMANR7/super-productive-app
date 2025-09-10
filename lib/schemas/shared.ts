import { z } from "zod";

// ✅ Name Schema
export const nameSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? "Name is required" : "Invalid name input",
  })
  .min(2, { error: "Name must be at least 2 characters long" })
  .max(30, { error: "Name must be at most 30 characters long" })
  .refine((val) => val.trim().length > 0, {
    error: "Name cannot be empty or just spaces",
  })
  .refine((val) => /^[a-zA-Z]/.test(val.trim()), {
    error: "Name must start with a letter",
  })
  .refine((val) => /^[a-zA-Z][a-zA-Z\s'-]*$/.test(val.trim()), {
    error: "Name can only contain letters, spaces, hyphens, and apostrophes",
  })
  .refine((val) => !/\s{2,}/.test(val), {
    error: "Name cannot contain consecutive spaces",
  });

// ✅ Email Schema
export const emailSchema = z
  .string()
  .min(1, { error: "Email is required" })
  .pipe(z.email({ error: "Please enter a valid email address" }));

// ✅ Password Schema
export const passwordSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? "Password is required" : "Invalid password input",
  })
  .min(12, { error: "Password must be at least 12 characters long" })
  .max(32, { error: "Password must be at most 32 characters long" })
  .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { error: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { error: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, {
    error: "Password must contain at least one special character",
  });

// Enums
export const oauthProviders = z.enum(["google", "github"]);
export const deviceTypes = z.enum(["desktop", "mobile", "tablet", "unknown"]);

export type OAuthProvider = z.infer<typeof oauthProviders>;
export type DeviceType = z.infer<typeof deviceTypes>;
