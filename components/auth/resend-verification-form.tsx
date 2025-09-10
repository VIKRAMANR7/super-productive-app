"use client";

import { resendVerificationEmail } from "@/app/actions/auth";
import { SubmitButton } from "@/components/auth/submit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailSchema } from "@/lib/schemas/shared";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const resendVerificationSchema = z.object({
  email: emailSchema,
});

type ResendVerificationData = z.infer<typeof resendVerificationSchema>;

export function ResendVerificationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ResendVerificationData>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: ResendVerificationData) {
    try {
      const result = await resendVerificationEmail(data.email);

      if (result.success) {
        setSubmittedEmail(data.email);
        setSubmitted(true);
        toast.success(result.message || "Verification email sent!");
      } else {
        form.setError("email", {
          type: "manual",
          message: result.error || "Failed to send verification email",
        });
        toast.error(result.error || "Failed to send verification email");
      }
    } catch (error) {
      const errorMessage = "An unexpected error occurred";
      form.setError("email", {
        type: "manual",
        message: errorMessage,
      });
      toast.error(errorMessage);
    }
  }

  if (submitted) {
    return (
      <div className={cn("w-full max-w-md", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We&apos;ve sent a verification link to <strong>{submittedEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Please check your inbox and click the verification link to complete your
              registration. The link will expire in 24 hours.
            </p>
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Didn&apos;t receive the email?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    form.reset();
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
            <Button asChild className="w-full" variant="outline">
              <Link href="/auth/login">
                <ArrowLeft className="h-5 w-5" />
                Back to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Resend Verification Email</CardTitle>
          <CardDescription className="max-w-xs mx-auto mt-2.5">
            Enter your email address and we&apos;ll send you a new verification link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className={cn(fieldState.error && "text-destructive")}>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        className={cn(
                          fieldState.error &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubmitButton
                loadingText="Sending..."
                isLoading={form.formState.isSubmitting}
              >
                Send Verification Email
              </SubmitButton>

              <div className="text-center text-sm -mt-3.5">
                Remember your password?{" "}
                <Link href="/auth/login" className="font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
