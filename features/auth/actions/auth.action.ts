"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { LoginSchema, RegisterSchema } from "@/features/auth/models/auth.model";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { generateVerificationToken, sendVerificationEmail } from "@/lib/utils";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { message: "Invalid fields!", status: "error" };
  }

  const { email, password } = validateFields.data;

  const existingUser = await db.user.findUnique({ where: { email } });

  if (!existingUser || !existingUser?.email || !existingUser?.password) {
    return { message: "Email doesn't exist", status: "error" };
  }

  if (!existingUser?.emailVerified) {
    return {
      message: `${existingUser.email} is not verified. Please verify your account to login`,
      status: "error",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return { message: "Invalid credentials", status: "error" };
        default:
          return { message: "Oops, An error occurred", status: "error" };
      }
    }

    throw error;
  }
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

  const verifToken = await generateVerificationToken(email);

  // Send email verification
  await sendVerificationEmail(verifToken.email, verifToken.token);

  return {
    message:
      "Successfully created account. Please check your email to verify account",
    status: "success",
  };
};
