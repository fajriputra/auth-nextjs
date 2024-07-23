"use server";

import * as z from "zod";

import { LoginSchema, RegisterSchema } from "../models/auth.model";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { message: "Invalid fields!", status: "error" };
  }

  return { message: "Successfully logged in", status: "success" };
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);

  if (!validateFields.success) {
    return { message: "Invalid fields!", status: "error" };
  }

  return { message: "Successfully logged in", status: "success" };
};
