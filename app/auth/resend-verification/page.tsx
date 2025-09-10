import { ResendVerificationForm } from "@/components/auth/resend-verification-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resend Verification | Super Productive App",
  description: "Resend email verification link",
};

export default function ResendVerificationPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <ResendVerificationForm />
    </div>
  );
}
