import { type ClassValue, clsx } from "clsx";
import { v4 as uuiv4 } from "uuid";
import { twMerge } from "tailwind-merge";
import { Resend } from "resend";
import { db } from "@/lib/db";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = uuiv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const sendEmail = async (args: {
  email: string;
  token: string;
  path: string;
  subject: string;
}) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const qToken = args.token ? `?token=${args.token}` : "";

  const resultLink = `http://localhost:3000${args.path}${qToken}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: args.email,
    subject: args.subject,
    html: `<a href="${resultLink}">Click here to ${args.subject.toLowerCase()}</a>`,
  });
};

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken || !existingToken.token) {
    return {
      message: "Token doesn't exist",
      status: "error",
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      message: "Token has expired",
      status: "error",
    };
  }

  const existingUser = await db.user.findUnique({
    where: {
      email: existingToken.email,
    },
  });

  if (!existingUser) {
    return {
      message: "User doesn't exist",
      status: "error",
    };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return {
    message: "Successfully email verified",
    status: "success",
  };
};

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const resetPasswordToken = await db.resetPasswordToken.findFirst({
      where: {
        email,
      },
    });

    return resetPasswordToken;
  } catch (error) {
    return null;
  }
};

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const resetPasswordToken = await db.resetPasswordToken.findUnique({
      where: {
        token,
      },
    });

    return resetPasswordToken;
  } catch (error) {
    return null;
  }
};

export const generateResetPasswordToken = async (email: string) => {
  const token = uuiv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await getResetPasswordTokenByEmail(email);

  if (existingToken) {
    await db.resetPasswordToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const resetPasswordToken = await db.resetPasswordToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return resetPasswordToken;
};
