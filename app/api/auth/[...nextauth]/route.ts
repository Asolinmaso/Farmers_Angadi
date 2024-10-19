import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import clientPromise from "./clientPromise";
import connectToDB from "@/utils/Database";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt" as const,  // Explicitly typing the strategy as 'jwt'
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        emailAddress: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailAddress || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials.emailAddress }).lean();
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Return user object, which is encoded in the JWT
        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.userId,
        email: token.email,
        role: token.role,
        username:token.username
      };
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
