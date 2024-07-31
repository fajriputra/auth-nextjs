"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { newVerification } from "@/lib/utils";
import { TBaseStatus } from "@/types";

import { AuthCardWrapper } from "@/components/partials/auth";
import { FormAlertMessage } from "@/components/shared/FormAlertMessage";

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [alertMessage, setAlertMessage] = useState<{
    message: string | undefined;
    status: TBaseStatus;
  }>({
    message: "",
    status: undefined,
  });

  const onSubmit = useCallback(() => {
    if (!token) {
      setAlertMessage({
        message: "Missing token",
        status: "error",
      });

      return;
    }

    newVerification(token)
      .then((data) => {
        setAlertMessage({
          message: data?.message,
          status: data?.status as TBaseStatus,
        });
      })
      .catch(() => {
        setAlertMessage({
          message: "Something went wrong",
          status: "error",
        });
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <AuthCardWrapper
      label="Confirming your verification"
      button_text="Back to login"
      button_url="/auth/login"
    >
      <div className="flex flex-col items-center w-full justify-center space-y-6">
        {!alertMessage.status && !alertMessage.message && (
          <p className="text-center text-gray-500 text-xs">
            We are confirming your email verification. Please wait...
          </p>
        )}

        <FormAlertMessage
          status={alertMessage.status}
          message={alertMessage.message}
        />
      </div>
    </AuthCardWrapper>
  );
};

export default VerifyEmailForm;
