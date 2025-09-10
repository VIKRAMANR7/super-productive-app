"use client";

import { resetPassword, verifyPasswordResetToken } from "@/app/actions/auth";
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
import { passwordSchema } from "@/lib/schemas/shared";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps extends React.ComponentProps<"div"> {
  token: string;
}

export function ResetPasswordForm({
  token,
  className,
  ...props
}: ResetPasswordFormProps) {
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const password = form.watch("password");

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        toast.error("Invalid reset link");
        router.push("/auth/forgot-password");
        return;
      }

      try {
        const result = await verifyPasswordResetToken(token);

        if (result.success && result.email) {
          setIsTokenValid(true);
          setUserEmail(result.email);
        } else {
          toast.error(result.error || "Invalid or expired reset link");
          router.push("/auth/forgot-password");
        }
      } catch (error) {
        toast.error("Failed to validate reset link");
        router.push("/auth/forgot-password");
        console.error(error);
      } finally {
        setIsValidatingToken(false);
      }
    }

    validateToken();
  }, [token, router]);

  async function onSubmit(data: ResetPasswordData) {
    try {
      const result = await resetPassword(token, data.password);

      if (result.success) {
        toast.success(result.message || "Password reset successfully!");
        router.push("/auth/login");
      } else {
        toast.error(result.error || "Failed to reset password");

        // If token is invalid, redirect to forgot password
        if (result.error?.includes("token")) {
          setTimeout(() => router.push("/auth/forgot-password"), 2000);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  if (isValidatingToken) {
    return (
      <div className={cn("w-full max-w-md", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Validating reset link...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isTokenValid) {
    return null;
  }

  return (
    <div className={cn("w-full max-w-md", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Reset your password</CardTitle>
          <CardDescription>
            {userEmail
              ? `Enter a new password for ${userEmail}`
              : "Enter your new password below"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className={cn(fieldState.error && "text-destructive")}>
                      New Password
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className={cn(fieldState.error && "text-destructive")}>
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubmitButton
                loadingText="Resetting..."
                isLoading={form.formState.isSubmitting}
              >
                Reset password
              </SubmitButton>

              <div className="text-center text-sm">
                Remember your password?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={() => router.push("/auth/login")}
                >
                  Back to login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
