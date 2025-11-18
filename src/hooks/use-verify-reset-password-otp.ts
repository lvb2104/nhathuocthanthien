import { handleAxiosError } from '@/lib/utils';
import { verifyResetPasswordOtp } from '@/services';
import { useMutation } from '@tanstack/react-query';

export function useVerifyResetPasswordOtp() {
	return useMutation({
		mutationFn: verifyResetPasswordOtp,
		onError: (error: any) => handleAxiosError(error),
	});
}
