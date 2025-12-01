import axios from 'axios';
import { app } from '@/configs/app';

// Server-safe axios instance (no client-only APIs). Use in server/NextAuth code.
export const serverAxios = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000/api',
	timeout: app.AXIOS_TIMEOUT,
	withCredentials: true,
});
