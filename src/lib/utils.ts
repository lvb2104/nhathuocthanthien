import { AxiosError } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from './types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function handleAxiosError(error: any) {
	if (!error || typeof error !== 'object') {
		toast.error('Đã xảy ra lỗi không xác định.');
		return;
	}

	const axiosError = error as AxiosError;
	if (!axiosError.response) {
		toast.error(
			'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.',
		);
	} else {
		const message =
			(axiosError.response.data as any)?.message ||
			axiosError.message ||
			'Đã xảy ra lỗi.';
		toast.error(message);
	}
}

export function getDecodedPayloadFromJwt(token: string) {
	const decodedPayload = jwtDecode<JwtPayload>(token);
	return decodedPayload;
}
