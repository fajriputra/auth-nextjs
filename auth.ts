import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import authConfig from "@/auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    linkAccount: async ({ user }) => {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      // allow oauth without email verification
      if (account?.provider !== "credentials") return true;

      // get user login
      const existingUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
      });

      // prevent login if email is not verified
      if (!existingUser?.emailVerified) return false;

      // TODO : 2FA Authentification

      return true;
    },
    jwt: async ({ token }) => {
      if (!token.sub) return token;

      const existingUser = await db.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      if (!existingUser) return token;

      token.role = existingUser.role as UserRole;

      return token;
    },
    session: async ({ token, session }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
