import { handleAxiosError } from '@/lib/utils';
import { signUp } from '@/services';
import { useAuthStore } from '@/store';
import { SignUpRequest, SignUpResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';

export function useSignUp() {
	const { setEmailPendingVerification } = useAuthStore();

	return useMutation({
		mutationFn: signUp,
		onSuccess: (
			signUpResponse: SignUpResponse,
			signUpRequest: SignUpRequest,
		) => {
			setEmailPendingVerification(signUpRequest.email); // Set email to be verified
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
