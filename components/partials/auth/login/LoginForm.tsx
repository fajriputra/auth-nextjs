"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/features/auth/models/auth.model";
import { TBaseStatus } from "@/types";

import { login } from "@/features/auth/actions/auth.action";

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

const LoginForm = () => {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [alertMessage, setAlertMessage] = useState<{
    message: string | undefined;
    status: TBaseStatus;
  }>({
    message: "",
    status: undefined,
  });

  const urlError: { message: string | undefined; status: TBaseStatus } | null =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? {
          message: "Email is already used with different provider.",
          status: "error",
        }
      : null;

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setAlertMessage({ message: "", status: undefined });

    startTransition(() => {
      login(values).then((data) => {
        setAlertMessage({
          message: data?.message,
          status: data?.status as TBaseStatus,
        });
      });
    });
  };

  return (
    <AuthCardWrapper
      label="Welcome back"
      button_text="Don't have an account?"
      button_url="/auth/register"
      isShowSocial
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
            <Button
              size="sm"
              variant="link"
              asChild
              className="font-normal px-0 !mt-0"
            >
              <Link href="/auth/reset-password">Forgot Password</Link>
            </Button>
          </div>
          <FormAlertMessage
            status={alertMessage.status || urlError?.status}
            message={alertMessage.message || urlError?.message}
          />
          <Button className="w-full" type="submit" disabled={isPending}>
            Log in
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
};

export default LoginForm;
