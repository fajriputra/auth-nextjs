"use client";

import { useState, useTransition } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetPasswordSchema } from "@/features/auth/models/auth.model";
import { TBaseStatus } from "@/types";

import { resetPassword } from "@/features/auth/actions/auth.action";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components//ui/button";

import { AuthCardWrapper } from "@/components/partials/auth";
import { FormAlertMessage } from "@/components/shared/FormAlertMessage";

const ResetPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [alertMessage, setAlertMessage] = useState<{
    message: string | undefined;
    status: TBaseStatus;
  }>({
    message: "",
    status: undefined,
  });

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setAlertMessage({ message: "", status: undefined });

    startTransition(() => {
      resetPassword(values).then((data) => {
        setAlertMessage({
          message: data?.message,
          status: data?.status as TBaseStatus,
        });
      });
    });
  };

  return (
    <AuthCardWrapper
      label="Forgot your password?"
      button_text="Back to login"
      button_url="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              disabled={isPending}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe@gmail.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormAlertMessage
            status={alertMessage.status}
            message={alertMessage.message}
          />
          <Button className="w-full" type="submit" disabled={isPending}>
            Send reset link
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
};

export default ResetPasswordForm;
