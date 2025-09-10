interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = "Or continue with" }: AuthDividerProps) {
  return (
    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
      <span className="relative z-10 bg-card px-2 text-muted-foreground">{text}</span>
    </div>
  );
}
