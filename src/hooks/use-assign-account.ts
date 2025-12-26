import { handleAxiosError } from '@/lib/utils';
import { assignAccount } from '@/services';
import { AssignAccountRequest } from '@/types';
import { useMutation } from '@tanstack/react-query';

export function useAssignAccount() {
	return useMutation({
		mutationFn: (request: AssignAccountRequest) => assignAccount(request),
		onError: (error: any) => handleAxiosError(error),
	});
}
