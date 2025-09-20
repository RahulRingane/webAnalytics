 import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string; // Add accessToken to Session
  }

  interface User extends DefaultUser {
    accessToken?: string; // Optional if needed
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string; // Add accessToken to JWT token
  }
}
