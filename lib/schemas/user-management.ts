import { z } from "zod";
import { emailSchema, nameSchema, oauthProviders, passwordSchema } from "./shared";

// Forgot Password
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset Password
export const resetPasswordSchema = z.object({
  token: z.string().min(1, { error: "Reset token is required" }),
  password: passwordSchema,
});

// Verify Email
export const verifyEmailSchema = z.object({
  token: z.string().min(1, { error: "Verification token is required" }),
});

// Change Password (for logged-in users)
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Current password is required" }),
    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    error: "New password must be different from current password",
    path: ["newPassword"],
  });

// Update Profile
export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  bio: z.string().max(500).optional(),
  avatar: z.url().optional(),
});

// Two-Factor Authentication
export const enableTwoFactorSchema = z.object({
  password: z.string().min(1, { error: "Password is required for security" }),
});

export const verifyTwoFactorSchema = z.object({
  code: z
    .string()
    .length(6, { error: "Code must be exactly 6 digits" })
    .regex(/^[0-9]+$/, { error: "Code must contain only numbers" }),
});

// OAuth Account Linking
export const oauthAccountSchema = z.object({
  provider: oauthProviders,
  providerAccountId: z.string(),
  email: emailSchema,
  name: z.string().optional(),
  image: z.url().optional(),
});

// Session Management
export const createSessionSchema = z.object({
  userId: z.string(),
  userAgent: z.string(),
  ipAddress: z.ipv4().or(z.ipv6()).optional(), // Updated for Zod v4
  rememberMe: z.boolean().default(false),
});

// Magic Link
export const magicLinkSchema = z.object({
  email: emailSchema,
});

// Delete Account
export const deleteAccountSchema = z.object({
  password: z.string().min(1, { error: "Password is required" }),
  confirmText: z.literal("DELETE", {
    error: "Please type 'DELETE' to confirm",
  }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type EnableTwoFactorInput = z.infer<typeof enableTwoFactorSchema>;
export type VerifyTwoFactorInput = z.infer<typeof verifyTwoFactorSchema>;
export type OAuthAccountInput = z.infer<typeof oauthAccountSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
