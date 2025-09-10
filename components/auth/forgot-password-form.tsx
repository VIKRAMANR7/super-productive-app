"use client";

import { requestPasswordReset } from "@/app/actions/auth";
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
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const router = useRouter();

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: ForgotPasswordData) {
    try {
      const result = await requestPasswordReset(data.email);

      if (result.success) {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
        toast.success(result.message || "Password reset email sent!");
      } else if (result.error) {
        form.setError("email", {
          type: "manual",
          message: result.error,
        });
        toast.error(result.error);
      }
    } catch (error) {
      const errorMessage = "Failed to send reset email. Please try again.";
      form.setError("email", {
        type: "manual",
        message: errorMessage,
      });
      toast.error(errorMessage);
    }
  }

  if (isSubmitted) {
    return (
      <div className={cn("w-full max-w-md", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <MailIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription className="mt-2">
              We've sent a password reset link to <strong>{submittedEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  form.reset();
                }}
                className="font-medium underline underline-offset-2 hover:text-foreground transition-colors"
              >
                try again
              </button>
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/auth/login")}
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to login
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
          <CardTitle className="text-xl font-bold">Forgot your password?</CardTitle>
          <CardDescription className="max-w-xs mx-auto text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                Send reset link
              </SubmitButton>

              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => router.push("/auth/login")}
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
