'use client'
import { app } from '@/configs/app'
import axios from 'axios'

export const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000/api',
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: app.AXIOS_TIMEOUT,
})

// Add a request interceptor to include the access token in headers
axiosInstance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('accessToken')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => Promise.reject(error),
)

// Add a response interceptor to handle errors globally
// axiosInstance.interceptors.response.use(
//     response => response,
//     error => {

//     }
// );
