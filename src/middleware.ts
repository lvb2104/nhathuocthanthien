import { NextRequest, NextResponse } from 'next/server';

// This middleware adds a custom header 'x-url' to the response containing the request URL
export function middleware(request: NextRequest) {
	const response = NextResponse.next();
	response.headers.set('x-url', request.url);
	return response;
}
