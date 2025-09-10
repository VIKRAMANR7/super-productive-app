"use client";

import { signUp } from "@/app/actions/auth";
import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthFooter } from "@/components/auth/auth-footer";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator";
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
import { signUpSchema } from "@/lib/schemas/signup";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, EyeIcon, EyeOffIcon, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type RegisterFormData = z.infer<typeof signUpSchema>;

type ServerError = {
  [K in keyof RegisterFormData]?: string[];
} & { general?: string };

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const password = form.watch("password");

  async function onSubmit(data: RegisterFormData) {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await signUp(formData);

      if (result?.error) {
        handleServerError(result.error);
      } else if (result?.success) {
        setRegisteredEmail(data.email);
        setEmailSent(true);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  }

  function handleServerError(error: string | ServerError) {
    if (typeof error === "string") {
      toast.error(error);
      return;
    }

    const fields: (keyof RegisterFormData)[] = ["name", "email", "password"];
    fields.forEach((field) => {
      if (error[field]?.[0]) {
        form.setError(field, { message: error[field][0] });
      }
    });

    toast.error(error.general || "Please check the form for errors");
  }

  // Show success message after email is sent
  if (emailSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We&apos;ve sent a verification link to <strong>{registeredEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-start space-x-3">
                <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Next steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Check your email inbox</li>
                    <li>Click the verification link</li>
                    <li>Sign in to your account</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>The verification link will expire in 24 hours.</p>
              <p className="mt-2">
                Didn&apos;t receive the email?{" "}
                <Link
                  href="/auth/resend-verification"
                  className="font-medium text-primary hover:underline"
                >
                  Resend verification email
                </Link>
              </p>
            </div>

            <Button asChild className="w-full" variant="outline">
              <Link href="/auth/login">
                <ArrowLeft className="h-5 w-5" />
                Go to Sign In
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Sign up with your Github or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <OAuthButtons mode="signup" />
            <AuthDivider text="Or continue with email" />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className={cn(fieldState.error && "text-destructive")}>
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="John Doe"
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className={cn(fieldState.error && "text-destructive")}>
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={cn(
                              "pr-10",
                              fieldState.error &&
                                "border-destructive focus-visible:ring-destructive"
                            )}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 px-0"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOffIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <PasswordStrengthIndicator password={password || ""} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SubmitButton
                  loadingText="Creating Account..."
                  isLoading={form.formState.isSubmitting}
                >
                  Create Account
                </SubmitButton>
              </form>
            </Form>

            <div className="text-center text-sm -mt-4">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <AuthFooter />
    </div>
  );
}
