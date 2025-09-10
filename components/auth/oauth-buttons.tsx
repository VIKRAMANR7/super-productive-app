import { signInWithOAuth } from "@/app/actions/auth";
import { GithubIcon } from "@/components/icons/github-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";

interface OAuthButtonsProps {
  mode?: "signin" | "signup";
}

export function OAuthButtons({ mode = "signin" }: OAuthButtonsProps) {
  async function handleOAuthSignIn(provider: "github" | "google") {
    await signInWithOAuth(provider);
  }

  return (
    <div className="flex gap-2">
      <form action={() => handleOAuthSignIn("github")} className="flex-1">
        <Button variant="outline" className="w-full cursor-pointer" type="submit">
          <GithubIcon className="h-5 w-5" />
          Github
        </Button>
      </form>
      <form action={() => handleOAuthSignIn("google")} className="flex-1">
        <Button variant="outline" className="w-full cursor-pointer" type="submit">
          <GoogleIcon className="h-5 w-5" />
          Google
        </Button>
      </form>
    </div>
  );
}
