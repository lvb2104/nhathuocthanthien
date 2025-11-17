import { handleAxiosError } from '@/lib/utils';
import { forgotPassword } from '@/services';
import { useAuthStore } from '@/store';
import { ForgotPasswordRequest } from '@/types';
import { useMutation } from '@tanstack/react-query';

export function useForgotPassword() {
	const { setEmailPendingVerification } = useAuthStore();

	return useMutation({
		mutationFn: forgotPassword,
		onSuccess: (_, forgotPasswordRequest: ForgotPasswordRequest) => {
			setEmailPendingVerification(forgotPasswordRequest.email);
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
