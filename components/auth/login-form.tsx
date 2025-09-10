"use client";

import { signInWithCredentials } from "@/app/actions/auth";
import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthFooter } from "@/components/auth/auth-footer";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { SubmitButton } from "@/components/auth/submit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/lib/schemas/signin";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type LoginFormData = z.infer<typeof signInSchema>;

type ServerError = {
  email?: string[];
  password?: string[];
  general?: string;
};

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Account created successfully! Please sign in.");
    }
  }, [searchParams]);

  async function onSubmit(data: LoginFormData) {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("rememberMe", rememberMe.toString());

      const result = await signInWithCredentials(formData);

      if (result?.error) {
        handleServerError(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  }

  function handleServerError(error: string | ServerError) {
    if (typeof error === "string") {
      // General error message
      toast.error(error);
      return;
    }

    // Set field-specific errors
    if (error.email?.[0]) {
      form.setError("email", { message: error.email[0] });
    }
    if (error.password?.[0]) {
      form.setError("password", { message: error.password[0] });
    }

    // Show general error or fallback message
    toast.error(error.general || "Invalid email or password");
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Welcome back</CardTitle>
          <CardDescription>Login with your Github or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <OAuthButtons />
            <AuthDivider text="Or continue with email" />

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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1.5">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm leading-none cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <SubmitButton
                  loadingText="Logging in..."
                  isLoading={form.formState.isSubmitting}
                >
                  Login
                </SubmitButton>
              </form>
            </Form>

            <div className="text-center text-sm -mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <AuthFooter />
    </div>
  );
}
