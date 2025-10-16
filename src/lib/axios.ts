'use client';
import { app } from '@/configs/app';
import { routes } from '@/configs/routes';
import { refreshToken } from '@/services';
import axios from 'axios';
import { toast } from 'react-toastify';

export const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000/api',
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: app.AXIOS_TIMEOUT,
});

// Add a request interceptor to include the access token in headers of each request
axiosInstance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('access-token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => Promise.reject(error),
);

// Add a response interceptor to call refresh token api and handle errors of each response
axiosInstance.interceptors.response.use(
	response => response,
	async error => {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			const originalRequest = error.config;
			if (originalRequest && !originalRequest._retry) {
				originalRequest._retry = true;
				try {
					const accessToken = localStorage.getItem('access-token');

					if (!accessToken) {
						toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
						localStorage.clear();
						window.location.href = routes.auth.signIn;
						return;
					}

					const data = await refreshToken();
					if (data.accessToken) {
						localStorage.setItem('access-token', data.accessToken);
						originalRequest.headers['Authorization'] =
							'Bearer ' + data.accessToken;
					}

					return axiosInstance(originalRequest);
				} catch (error) {
					toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
					localStorage.clear();
					window.location.href = routes.auth.signIn;
					return Promise.reject(error);
				}
			}
		}
		return Promise.reject(error);
	},
);
