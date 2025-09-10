import Link from "next/link";

export function AuthFooter() {
  return (
    <div className="text-balance text-center text-xs text-muted-foreground">
      By continuing, you agree to our{" "}
      <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
        Privacy Policy
      </Link>
    </div>
  );
}
