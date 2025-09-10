import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  loadingText?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function SubmitButton({
  loadingText = "Loading...",
  children,
  className,
  isLoading = false,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn(
        "w-full cursor-pointer hover:opacity-95/50 mt-2 text-[15px] font-bold tracking-wider",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
