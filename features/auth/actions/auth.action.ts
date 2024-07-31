"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import {
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
  NewPasswordSchema,
} from "@/features/auth/models/auth.model";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  generateVerificationToken,
  sendEmail,
  generateResetPasswordToken,
  getResetPasswordTokenByToken,
} from "@/lib/utils";

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
  await sendEmail({
    email: verifToken.email,
    token: verifToken.token,
    path: "/auth/verify-email",
    subject: "Verify your email",
  });

  return {
    message:
      "Successfully created account. Please check your email to verify account",
    status: "success",
  };
};

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  const validateFields = ResetPasswordSchema.safeParse(values);

  if (!validateFields.success) {
    return { message: "Invalid fields!", status: "error" };
  }

  const { email } = validateFields.data;

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return { message: "Email doesn't exist", status: "error" };
  }

  const resetPasswordToken = await generateResetPasswordToken(email);

  // Send email verification
  await sendEmail({
    email: resetPasswordToken.email,
    token: resetPasswordToken.token,
    path: "/auth/new-password",
    subject: "Reset your password",
  });

  return {
    message: "Reset password link sent to your email",
    status: "success",
  };
};

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string
) => {
  if (!token) {
    return { message: "Invalid token", status: "error" };
  }

  const validateFields = NewPasswordSchema.safeParse(values);

  if (!validateFields.success) {
    return { message: "Invalid fields!", status: "error" };
  }

  const { password } = validateFields.data;

  const hashPassword = await bcrypt.hash(password, 10);

  const existingToken = await getResetPasswordTokenByToken(token);

  if (!existingToken || !existingToken.token) {
    return { message: "Token doesn't exist", status: "error" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { message: "Token has expired", status: "error" };
  }

  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return { message: "Email doesn't exist", status: "error" };
  }

  // Save user to database
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashPassword },
  });

  // Delete token
  await db.resetPasswordToken.delete({ where: { id: existingToken.id } });

  return { message: "Password reset successfully", status: "success" };
};
