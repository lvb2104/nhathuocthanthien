import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { UserRole } from '@/types';
import { routes } from './configs/routes';
import { getDecodedPayloadFromJwt } from './lib/utils';

export default withAuth(
	// Call middleware
	function middleware(req) {
		const token = req.nextauth.token;
		const pathname = req.nextUrl.pathname;
		const role = getDecodedPayloadFromJwt(token?.accessToken || '')?.role;

		if (!role) {
			// Redirect to sign-in with callback URL preserved
			const signInUrl = new URL(routes.auth.signIn, req.url);
			signInUrl.searchParams.set('callbackUrl', req.url);
			return NextResponse.redirect(signInUrl);
		}

		if (pathname.startsWith('/admin') && role !== UserRole.ADMIN) {
			return NextResponse.redirect(new URL(routes.home, req.url));
		}

		if (pathname.startsWith('/pharmacist') && role !== UserRole.PHARMACIST) {
			return NextResponse.redirect(new URL(routes.home, req.url));
		}

		if (pathname.startsWith('/user') && role !== UserRole.CUSTOMER) {
			// Redirect to sign-in with callback URL preserved
			const signInUrl = new URL(routes.auth.signIn, req.url);
			signInUrl.searchParams.set('callbackUrl', req.url);
			return NextResponse.redirect(signInUrl);
		}

		return NextResponse.next();
	},
	// When calling middleware, provide auth options
	{
		callbacks: {
			authorized: ({ token }) => !!token, // require auth on matched routes
		},
	},
);

// On these paths, the middleware will be invoked
export const config = {
	matcher: ['/admin/:path*', '/pharmacist/:path*', '/user/:path*'],
};
