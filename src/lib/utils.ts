import { AxiosError } from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function handleAxiosError(error: any) {
	if (!error || typeof error !== 'object') {
		toast.error('An unknown error occurred.')
		return
	}

	const axiosError = error as AxiosError
	if (!axiosError.response) {
		toast.error(
			'Unable to connect to the server. Please check your internet connection.',
		)
	} else {
		const message =
			(axiosError.response.data as any)?.message ||
			axiosError.message ||
			'An error occurred.'
		toast.error(message)
	}
}
