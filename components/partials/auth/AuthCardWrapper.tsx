import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import {
  AuthHeader,
  AuthSocial,
  AuthButtonLink,
} from "@/components/partials/auth";

interface IAuthCardWrapper {
  children: React.ReactNode;
  label: string;
  button_text: string;
  button_url: string;
  isShowSocial?: boolean;
}

const AuthCardWrapper = ({
  children,
  label,
  button_text,
  button_url,
  isShowSocial,
}: IAuthCardWrapper) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <AuthHeader label={label} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {isShowSocial && (
        <CardFooter>
          <AuthSocial />
        </CardFooter>
      )}
      <CardFooter>
        <AuthButtonLink button_text={button_text} button_url={button_url} />
      </CardFooter>
    </Card>
  );
};

export default AuthCardWrapper;
