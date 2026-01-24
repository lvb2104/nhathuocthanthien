import { handleAxiosError } from '@/lib/utils';
import { markAllNotificationsAsRead } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetNotificationsResponse } from '@/types';

export function useMarkAllNotificationsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => markAllNotificationsAsRead(),
		onMutate: async () => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['notifications'] });

			// Snapshot the previous value
			const previousNotifications =
				queryClient.getQueryData<GetNotificationsResponse>(['notifications']);

			// Optimistically update to mark all as read
			queryClient.setQueryData<GetNotificationsResponse>(
				['notifications'],
				old => {
					if (!old) return old;
					return old.map(notification => ({ ...notification, isRead: true }));
				},
			);

			// Return context with snapshot
			return { previousNotifications };
		},
		onError: (error: any, variables, context) => {
			// Rollback on error
			if (context?.previousNotifications) {
				queryClient.setQueryData(
					['notifications'],
					context.previousNotifications,
				);
			}
			handleAxiosError(error);
		},
		onSettled: () => {
			// Refetch to sync with server
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
	});
}
