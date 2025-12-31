import { handleAxiosError } from '@/lib/utils';
import { changePassword } from '@/services';
import { ChangePasswordRequest } from '@/types';
import { useMutation } from '@tanstack/react-query';

export function useChangePassword() {
	return useMutation({
		mutationFn: (request: ChangePasswordRequest) => changePassword(request),
		onError: (error: any) => handleAxiosError(error),
	});
}
