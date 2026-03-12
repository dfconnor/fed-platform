/**
 * NextAuth.js API Route Handler
 *
 * Handles all authentication flows including OAuth (Google),
 * magic link email sign-in, session management, and CSRF protection.
 *
 * @see https://next-auth.js.org/configuration/initialization#route-handlers-app
 */
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
