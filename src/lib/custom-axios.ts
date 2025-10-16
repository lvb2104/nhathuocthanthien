import 'axios';

declare module 'axios' {
	interface InternalAxiosRequestConfig {
		_retry?: boolean;
	}

	interface AxiosRequestConfig {
		_retry?: boolean;
	}
}
