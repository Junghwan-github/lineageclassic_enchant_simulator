import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/entities/user/api/get-user-by-email";
import { UserType } from "@/shared/types/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");
        
        if (!email || !password) {
          return null;
        }

        const user = await getUserByEmail(email);
        if (!user) {
          return null;
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          point: user.point,
          type: user.user_type,
          membership: user.membership,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.point = user.point;
        token.type = user.type;
        token.membership = user.membership;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.point = token.point as number;
        session.user.type = token.type as UserType;
        session.user.membership = token.membership as string | null;
      }
      return session;
    },
  },
});
