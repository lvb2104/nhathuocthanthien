import { handleAxiosError } from '@/lib/utils';
import { markNotificationAsRead } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useMarkNotificationRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => markNotificationAsRead(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
