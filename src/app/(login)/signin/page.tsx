import { Button } from "@headlessui/react";
import { GithubIcon } from "lucide-react";
import React from "react";
import { signIn } from "~/server/auth";

const SignInPage = () => {
  return (
    <form
      className="flex flex-col gap-10 items-center bg-secondary-light dark:bg-secondary-dark
        rounded-lg p-10"
      action={async () => {
        "use server";

        await signIn("github", { redirectTo: "/dashboard" });
      }}
    >
      <div>
        <h1 className="text-3xl font-bold text-center">Sign In</h1>
        <p className="text-sm text-center">
          Sign in to your existing account, or a new account will be created for
          you
        </p>
      </div>

      <Button
        type="submit"
        className="flex flex-row gap-2 w-3/4 justify-center py-3 bg-black text-white rounded-lg"
      >
        <GithubIcon />
        Github
      </Button>
    </form>
  );
};

export default SignInPage;
