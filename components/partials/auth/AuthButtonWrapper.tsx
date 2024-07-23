"use client";

import React from "react";

import { useRouter } from "next/navigation";

interface IAuthButtonWrapperProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
  redirectTo?: string;
}

const AuthButtonWrapper = ({
  children,
  mode = "redirect",
  asChild,
  redirectTo = "/auth/login",
}: IAuthButtonWrapperProps) => {
  const router = useRouter();

  const handleClick = () => router.push(redirectTo);

  if (mode === "modal") {
    return <span>TODO: Implement Modal</span>;
  }

  return <span onClick={handleClick}>{children}</span>;
};

export default AuthButtonWrapper;
