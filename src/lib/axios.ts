'use client';
import { app } from '@/configs/app';
import { routes } from '@/configs/routes';
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

export const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000/api',
	timeout: app.AXIOS_TIMEOUT,
	withCredentials: true,
});

// Add a request interceptor to include the access token in headers of each request
axiosInstance.interceptors.request.use(
	// still need access token for backend APIs
	async config => {
		const session = await getSession();
		const token = session?.accessToken;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => Promise.reject(error),
);

// Add a response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
	response => response,
	async error => {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			const originalRequest = error.config;
			if (originalRequest && !originalRequest._retry) {
				originalRequest._retry = true;
				toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
				await signOut({ callbackUrl: routes.auth.signIn });
			}
		}
		return Promise.reject(error);
	},
);
