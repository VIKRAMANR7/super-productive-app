"use server";

import { signIn, signOut } from "@/auth";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/schemas/shared";
import { signInSchema } from "@/lib/schemas/signin";
import { signUpSchema } from "@/lib/schemas/signup";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AuthError } from "next-auth";

// ============================================
// AUTHENTICATION ACTIONS
// ============================================

/**
 * Sign in with email and password credentials
 */
export async function signInWithCredentials(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("rememberMe") === "true";

    const validatedFields = signInSchema.safeParse({
      email,
      password,
      rememberMe,
    });

    if (!validatedFields.success) {
      return {
        error: "Invalid credentials.",
      };
    }

    // Check if user exists and email is verified
    const user = await prisma.user.findUnique({
      where: { email: validatedFields.data.email },
      select: { emailVerified: true },
    });

    if (user && !user.emailVerified) {
      return {
        error:
          "Please verify your email before signing in. Check your inbox for the verification link.",
      };
    }

    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    throw error;
  }
}

/**
 * Sign in with OAuth providers (Google, GitHub)
 */
export async function signInWithOAuth(provider: "google" | "github") {
  try {
    await signIn(provider, { redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: `Failed to sign in with ${provider}. Please try again.` };
    }
    throw error;
  }
}

/**
 * Sign up new user with email verification
 */
export async function signUp(formData: FormData) {
  try {
    const validatedFields = signUpSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      const flattenedErrors = validatedFields.error.flatten();
      return {
        error: flattenedErrors.fieldErrors,
      };
    }

    const { name, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return {
          error: "An account already exists with this email address.",
        };
      } else {
        // If user exists but not verified, delete old record
        await prisma.user.delete({
          where: { email },
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with unverified status
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null, // Email not verified yet
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(email, name, emailVerificationToken);

    if (!emailResult.success) {
      // If email fails, delete the user to allow retry
      await prisma.user.delete({
        where: { id: newUser.id },
      });

      return {
        error: "Failed to send verification email. Please try again.",
      };
    }

    return {
      success: true,
      message: "Account created! Please check your email to verify your account.",
      requiresVerification: true,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "Failed to create account. Please try again." };
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  try {
    await signOut({ redirectTo: "/" });
  } catch (error) {
    throw error;
  }
}

// ============================================
// EMAIL VERIFICATION ACTIONS
// ============================================

/**
 * Verify email with token from email link
 */
export async function verifyEmail(token: string) {
  try {
    if (!token) {
      return { error: "Invalid verification token" };
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      return { error: "Invalid or expired verification token" };
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Email verification error:", error);
    return { error: "Failed to verify email. Please try again." };
  }
}

/**
 * Resend verification email to user
 */
export async function resendVerificationEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        emailVerified: true,
        emailVerificationExpires: true,
      },
    });

    if (!user) {
      return { error: "No account found with this email address." };
    }

    if (user.emailVerified) {
      return { error: "Email is already verified." };
    }

    // Check if we need to wait before resending (rate limiting)
    if (user.emailVerificationExpires) {
      const timeLeft = user.emailVerificationExpires.getTime() - Date.now();
      const hoursLeft = timeLeft / (1000 * 60 * 60);

      if (hoursLeft > 23) {
        return {
          error:
            "Please wait a few minutes before requesting another verification email.",
        };
      }
    }

    // Generate new token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    // Send new verification email
    const emailResult = await sendVerificationEmail(
      email,
      user.name || "User",
      emailVerificationToken
    );

    if (!emailResult.success) {
      return { error: "Failed to send verification email. Please try again." };
    }

    return {
      success: true,
      message: "Verification email sent! Please check your inbox.",
    };
  } catch (error) {
    console.error("Resend verification error:", error);
    return { error: "Failed to resend verification email." };
  }
}

// ============================================
// PASSWORD RESET ACTIONS
// ============================================

/**
 * Request password reset - sends email with reset link
 */
export async function requestPasswordReset(email: string) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        emailVerified: true,
        passwordResetExpires: true,
      },
    });

    // Don't reveal if user exists - always return success
    if (!user) {
      return {
        success: true,
        message: "If an account exists with this email, a reset link has been sent.",
      };
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return {
        error:
          "Please verify your email address first. Check your inbox for the verification link.",
      };
    }

    // Rate limiting - check if recent reset was requested
    if (user.passwordResetExpires) {
      const timeLeft = user.passwordResetExpires.getTime() - Date.now();
      const minutesLeft = Math.floor(timeLeft / (1000 * 60));

      if (minutesLeft > 55) {
        // If token was created less than 5 minutes ago
        return {
          error: `Please wait ${minutesLeft - 55} minutes before requesting another reset link.`,
        };
      }
    }

    // Generate reset token
    const passwordResetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    // Send reset email
    const emailResult = await sendPasswordResetEmail(
      email,
      user.name || "User",
      passwordResetToken
    );

    if (!emailResult.success) {
      // Clear the token if email fails
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      return {
        error: "Failed to send reset email. Please try again.",
      };
    }

    return {
      success: true,
      message: "Password reset link sent! Please check your email.",
    };
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      error: "Failed to process password reset request. Please try again.",
    };
  }
}

/**
 * Verify password reset token is valid
 */
export async function verifyPasswordResetToken(token: string) {
  try {
    if (!token) {
      return { error: "Invalid reset token" };
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(), // Token not expired
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return { error: "Invalid or expired reset token" };
    }

    return {
      success: true,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return { error: "Failed to verify reset token" };
  }
}

/**
 * Reset password with valid token
 */
export async function resetPassword(token: string, newPassword: string) {
  try {
    // Validate password
    const validatedPassword = passwordSchema.safeParse(newPassword);

    if (!validatedPassword.success) {
      return {
        error: validatedPassword.error.errors[0]?.message || "Invalid password",
      };
    }

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return { error: "Invalid or expired reset token" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return {
      success: true,
      message: "Password reset successfully! You can now sign in with your new password.",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      error: "Failed to reset password. Please try again.",
    };
  }
}
