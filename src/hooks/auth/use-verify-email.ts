import { handleAxiosError } from '@/lib/utils';
import { verifyEmail } from '@/services';
import { useAuthStore } from '@/store';
import { useMutation } from '@tanstack/react-query';

export function useVerifyEmail() {
	const { setEmailPendingVerification } = useAuthStore();

	return useMutation({
		mutationFn: verifyEmail,
		onSuccess: () => {
			setEmailPendingVerification(undefined); // Clear email pending verification on success
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
