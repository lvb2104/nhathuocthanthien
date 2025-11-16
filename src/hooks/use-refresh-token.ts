import { handleAxiosError } from '@/lib/utils';
import { refreshToken } from '@/services';
import { useMutation } from '@tanstack/react-query';

export function useRefreshToken() {
	return useMutation({
		mutationFn: refreshToken,
		onSuccess: () => {
			console.log(`Refresh token at ${Date.now()}`);
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
