import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username },
        });

        if (!admin) return null;

        // ✅ Case-sensitive username check
        if (admin.username !== credentials.username) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          admin.password,
        );

        if (!isValid) return null;

        // ✅ Add role
        return { id: String(admin.id), name: admin.username, role: "admin" };
      },
    }),
  ],

  // ✅ Add these callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/admin",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
