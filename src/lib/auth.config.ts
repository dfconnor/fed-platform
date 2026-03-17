import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no Prisma, no bcrypt, no Node.js modules).
 * Used by middleware for JWT session validation only.
 * The full config with Prisma adapter + credentials provider is in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [], // Providers are added in the full auth.ts config
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      // This callback is used by the middleware to check auth.
      // Returning true allows the request to proceed.
      // The middleware handler in middleware.ts does the fine-grained checks.
      return true;
    },
  },
};
