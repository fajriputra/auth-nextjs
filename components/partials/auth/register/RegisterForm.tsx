"use client";

import { useState, useTransition } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/features/auth/models/auth.model";
import { TBaseStatus } from "@/types";

import { register } from "@/features/auth/actions/auth.action";

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

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    status: TBaseStatus;
  }>({
    message: "",
    status: undefined,
  });

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setAlertMessage({ message: "", status: undefined });

    startTransition(() => {
      register(values).then((data) => {
        setAlertMessage({
          message: data.message,
          status: data.status as TBaseStatus,
        });
      });
    });
  };

  return (
    <AuthCardWrapper
      label="Create an account"
      button_text="Already have an account?"
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
          </div>
          <FormAlertMessage
            status={alertMessage.status}
            message={alertMessage.message}
          />
          <Button className="w-full" type="submit" disabled={isPending}>
            Create an account
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
};

export default RegisterForm;
