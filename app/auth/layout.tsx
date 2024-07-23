import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="main-auth-background">{children}</div>;
};

export default AuthLayout;
