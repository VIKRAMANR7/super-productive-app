import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  className,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) return 0;

    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Calculate percentage (max score is 6)
    return Math.min(100, (score / 6) * 100);
  }, [password]);

  const getStrengthColor = () => {
    if (strength < 33) return "bg-destructive";
    if (strength < 66) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (!password) return "";
    if (strength < 33) return "Weak";
    if (strength < 66) return "Medium";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            getStrengthColor()
          )}
          style={{ width: `${strength}%` }}
        />
      </div>
      <p
        className={cn("text-xs", {
          "text-destructive": strength < 33,
          "text-yellow-600": strength >= 33 && strength < 66,
          "text-green-600": strength >= 66,
        })}
      >
        {getStrengthText()}
      </p>
    </div>
  );
}
