import { handleAxiosError } from '@/lib/utils';
import { restoreUser } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRestoreUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: restoreUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
