import { handleAxiosError } from '@/lib/utils';
import { forgotPassword } from '@/services';
import { useAuthStore } from '@/store';
import { ForgotPasswordRequest, ForgotPasswordResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';

export function useForgotPassword() {
	const { setEmailPendingVerification } = useAuthStore();

	return useMutation({
		mutationFn: forgotPassword,
		onSuccess: (
			forgotPasswordResponse: ForgotPasswordResponse,
			forgotPasswordRequest: ForgotPasswordRequest,
		) => {
			setEmailPendingVerification(forgotPasswordRequest.email);
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
