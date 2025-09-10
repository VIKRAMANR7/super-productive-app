import { VerificationEmail } from "@/components/emails/verification-email";
import { createElement } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@yourdomain.com";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Your App";

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `Verify your email for ${APP_NAME}`,
      react: createElement(VerificationEmail, {
        name,
        verificationUrl,
      }),
    });

    if (error) {
      console.error("Failed to send verification email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      error: "Failed to send verification email",
    };
  }
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  // You can create a similar password reset email template
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `Reset your password for ${APP_NAME}`,
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the link below to continue:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    if (error) {
      console.error("Failed to send password reset email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      success: false,
      error: "Failed to send password reset email",
    };
  }
}
