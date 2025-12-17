import { apiEndpoints } from '@/configs/apis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Call your backend
		const backendUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${apiEndpoints.auth.signIn}`;
		const backendResponse = await fetch(backendUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			credentials: 'include',
		});

		const data = await backendResponse.json();

		// Create response with the JSON data
		const response = NextResponse.json(data, {
			status: backendResponse.status,
		});

		// Forward Set-Cookie headers from backend to browser (now scoped to Next.js domain!)
		const setCookieHeaders = backendResponse.headers.getSetCookie();
		console.log('Proxy sign-in - cookies to forward:', setCookieHeaders.length);
		if (setCookieHeaders.length > 0) {
			// Parse and set each cookie
			setCookieHeaders.forEach(cookieString => {
				// Parse cookie string: name=value; Path=/; HttpOnly; Secure; SameSite=Strict
				const parts = cookieString.split(';').map(p => p.trim());
				const [nameValue] = parts;
				const [name, ...valueParts] = nameValue.split('=');
				const value = valueParts.join('='); // Handle values with = in them

				const cookieOptions: {
					name: string;
					value: string;
					httpOnly?: boolean;
					secure?: boolean;
					sameSite?: 'strict' | 'lax' | 'none';
					path?: string;
					maxAge?: number;
				} = {
					name,
					value,
				};

				// Parse attributes
				for (const part of parts.slice(1)) {
					const lowerPart = part.toLowerCase();
					if (lowerPart === 'httponly') {
						cookieOptions.httpOnly = true;
					} else if (lowerPart === 'secure') {
						cookieOptions.secure = true;
					} else if (part.startsWith('Path=')) {
						cookieOptions.path = part.substring(5);
					} else if (part.startsWith('Max-Age=')) {
						cookieOptions.maxAge = parseInt(part.substring(8), 10);
					} else if (part.startsWith('SameSite=')) {
						const sameSite = part.substring(9).toLowerCase();
						if (
							sameSite === 'strict' ||
							sameSite === 'lax' ||
							sameSite === 'none'
						) {
							cookieOptions.sameSite = sameSite;
						}
					}
				}

				response.cookies.set(cookieOptions);
			});
		}

		return response;
	} catch (error) {
		console.error('Proxy sign-in error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 },
		);
	}
}
