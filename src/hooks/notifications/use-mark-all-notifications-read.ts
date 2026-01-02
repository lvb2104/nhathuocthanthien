import { handleAxiosError } from '@/lib/utils';
import { markAllNotificationsAsRead } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useMarkAllNotificationsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => markAllNotificationsAsRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
