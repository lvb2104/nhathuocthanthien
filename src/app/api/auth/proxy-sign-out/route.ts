import { apiEndpoints } from '@/configs/apis';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'set-cookie-parser';

export async function POST(request: NextRequest) {
	try {
		// Call your backend to revoke the token
		const backendUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${apiEndpoints.auth.signOut}`;
		const backendResponse = await fetch(backendUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Forward the cookies (including refreshToken) from the browser to the backend
				Cookie: request.headers.get('cookie') || '',
			},
			credentials: 'include',
		});

		const data = await backendResponse.json();

		// Create response
		const response = NextResponse.json(data, {
			status: backendResponse.status,
		});

		// Forward those specialized "clear-cookie" headers from backend to browser
		const setCookieHeaders = backendResponse.headers.getSetCookie();
		if (setCookieHeaders.length > 0) {
			const parsedCookies = parse(setCookieHeaders);

			parsedCookies.forEach(cookie => {
				response.cookies.set({
					...cookie,
					domain: undefined, // Strip backend domain to clear it from Next.js domain
					sameSite: cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
				});
			});
		}

		return response;
	} catch {
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 },
		);
	}
}
