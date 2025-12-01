import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// This special file sets up the NextAuth.js route handler using the configuration defined in authOptions
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
