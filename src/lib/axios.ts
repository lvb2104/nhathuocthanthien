'use client';
import { app } from '@/configs/app';
import axios from 'axios';
import { getSession } from 'next-auth/react';

export const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000/api',
	timeout: app.AXIOS_TIMEOUT,
	withCredentials: true,
});

// Cache the token to avoid calling getSession() on every request
let cachedToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

async function getAccessToken(): Promise<string | null> {
	// If we're already fetching the token, wait for that promise
	if (tokenPromise) {
		return tokenPromise;
	}

	// If we have a cached token, return it
	if (cachedToken) {
		return cachedToken;
	}

	// Fetch the token (only once if multiple requests happen simultaneously)
	tokenPromise = getSession()
		.then(session => {
			// Check if session has error (e.g., RefreshAccessTokenError)
			if (session?.error) {
				throw new Error(session.error as string);
			}

			cachedToken = session?.accessToken ?? null;
			return cachedToken;
		})
		.catch(() => {
			// Clear cache on error
			cachedToken = null;
			return null;
		})
		.finally(() => {
			tokenPromise = null;
		});

	return tokenPromise;
}

// Export function to clear cached token (useful after logout)
export function clearCachedToken() {
	cachedToken = null;
	tokenPromise = null;
}

// request interceptor adds access token to the request before sending
axiosInstance.interceptors.request.use(
	async config => {
		const token = await getAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => Promise.reject(error),
);

// response interceptor handles auth errors before receiving
axiosInstance.interceptors.response.use(
	response => response,
	async error => {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			const originalRequest = error.config;
			const url = (originalRequest?.url || '').toString();
			const isAuthEndpoint = url.includes('/auth/') || url.includes('nextauth');

			if (!isAuthEndpoint && originalRequest && !originalRequest._retry) {
				originalRequest._retry = true;

				// Clear cached token before trying to refresh
				clearCachedToken();

				try {
					// This will call your NextAuth session endpoint.
					// If the JWT is expired, jwt() -> refreshAccessToken() -> serverRefreshToken() will run.
					const session = await getSession();
					const accessToken = session?.accessToken;

					// If session has error, don't retry - let SessionErrorHandler handle it
					if (session?.error) {
						return Promise.reject(error);
					}

					if (accessToken) {
						// Cache the new token
						cachedToken = accessToken;
						originalRequest.headers = originalRequest.headers || {};
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
						return axiosInstance(originalRequest);
					}
				} catch {
					// Let SessionErrorHandler handle logout
					return Promise.reject(error);
				}
			}
		}
		return Promise.reject(error);
	},
);
