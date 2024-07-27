"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { signIn } from "next-auth/react";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import { Button } from "@/components/ui/button";

const AuthSocial = () => {
  const handleOAuth = async (provider: "google" | "github") => {
    await signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => handleOAuth("google")}
      >
        <FcGoogle className="size-5" />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => handleOAuth("github")}
      >
        <FaGithub className="size-5" />
      </Button>
    </div>
  );
};

export default AuthSocial;
