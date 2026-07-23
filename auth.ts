import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const adminUser = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (!adminUser) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          adminUser.passwordHash
        );

        if (!passwordMatches) {
          return null;
        }

        return { id: adminUser.id, email: adminUser.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
  },
});
