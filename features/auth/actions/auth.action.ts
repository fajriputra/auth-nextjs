"use server";

import * as z from "zod";
import bcrypt from "bcrypt";

import { LoginSchema, RegisterSchema } from "../models/auth.model";
import { db } from "@/lib/db";

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

  const { name, email, password } = validateFields.data;
  const hashPassword = await bcrypt.hash(password, 10);

  const checkUser = await db.user.findUnique({ where: { email } });

  if (checkUser) {
    return { message: "Email already exists", status: "error" };
  }

  // Save user to database
  await db.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  return { message: "Successfully created account", status: "success" };
};
