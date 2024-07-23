import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface IAuthButtonLinkProps {
  button_text: string;
  button_url: string;
}

const AuthButtonLink = ({ button_text, button_url }: IAuthButtonLinkProps) => {
  return (
    <Button size="sm" variant="link" className="font-normal w-full" asChild>
      <Link href={button_url}>{button_text}</Link>
    </Button>
  );
};

export default AuthButtonLink;
