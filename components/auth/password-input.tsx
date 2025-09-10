import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { forwardRef, useState } from "react";
import { Button } from "../ui/button";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  touched?: boolean;
  description?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, touched, description, className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const showError = touched && error;
    const inputId = id || props.name;

    return (
      <div className="grid gap-2">
        <Label htmlFor={inputId} className={cn(showError && "text-destructive")}>
          {label}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={cn(
              "pr-10",
              showError && "border-destructive focus-visible:ring-destructive",
              className
            )}
            aria-invalid={showError ? "true" : undefined}
            aria-describedby={
              showError
                ? `${inputId}-error`
                : description
                ? `${inputId}-description`
                : undefined
            }
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 px-0"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        {showError && (
          <p id={`${inputId}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
        {!showError && description && (
          <p id={`${inputId}-description`} className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";



