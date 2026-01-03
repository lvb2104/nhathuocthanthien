import { handleAxiosError } from '@/lib/utils';
import { lockUser } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useLockUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: lockUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
