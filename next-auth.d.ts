// next-auth.d.ts (placed at the root of the project)
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string;
    };
  }

  interface User {
    id: string;
    role: string;
  }

  interface JWT {
    userId: string;
    email: string;
    role: string;
  }
}
