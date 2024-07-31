"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewPasswordSchema } from "@/features/auth/models/auth.model";
import { TBaseStatus } from "@/types";

import { newPassword } from "@/features/auth/actions/auth.action";

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

const NewPasswordForm = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [alertMessage, setAlertMessage] = useState<{
    message: string | undefined;
    status: TBaseStatus;
  }>({
    message: "",
    status: undefined,
  });

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setAlertMessage({ message: "", status: undefined });

    if (token) {
      startTransition(() => {
        newPassword(values, token).then((data) => {
          setAlertMessage({
            message: data?.message,
            status: data?.status as TBaseStatus,
          });
        });
      });
    }
  };

  return (
    <AuthCardWrapper
      label="Enter a new password"
      button_text="Back to login"
      button_url="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              disabled={isPending}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
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
            Reset your password
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
};

export default NewPasswordForm;
