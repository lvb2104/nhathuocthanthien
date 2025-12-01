import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { UserRole } from '@/types';
import { routes } from './configs/routes';

export default withAuth(
	// Call middleware
	function middleware(req) {
		const token = req.nextauth.token;
		const pathname = req.nextUrl.pathname;

		if (pathname.startsWith('/admin') && token?.role !== UserRole.ADMIN) {
			return NextResponse.redirect(new URL(routes.home, req.url));
		}

		if (
			pathname.startsWith('/pharmacist') &&
			token?.role !== UserRole.PHARMACIST
		) {
			return NextResponse.redirect(new URL(routes.home, req.url));
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
