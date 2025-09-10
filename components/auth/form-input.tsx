import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
  description?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, touched, description, className, id, ...props }, ref) => {
    const showError = touched && error;
    const inputId = id || props.name;

    return (
      <div className="grid gap-2">
        <Label htmlFor={inputId} className={cn(showError && "text-destructive")}>
          {label}
        </Label>
        <Input
          ref={ref}
          id={inputId}
          className={cn(
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

FormInput.displayName = "FormInput";
