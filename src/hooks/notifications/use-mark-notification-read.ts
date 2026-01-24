import { handleAxiosError } from '@/lib/utils';
import { markNotificationAsRead } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetNotificationsResponse } from '@/types';

export function useMarkNotificationRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => markNotificationAsRead(id),
		onMutate: async (id: number) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['notifications'] });

			// Snapshot the previous value
			const previousNotifications =
				queryClient.getQueryData<GetNotificationsResponse>(['notifications']);

			// Optimistically update to mark as read
			queryClient.setQueryData<GetNotificationsResponse>(
				['notifications'],
				old => {
					if (!old) return old;
					return old.map(notification =>
						notification.id === id
							? { ...notification, isRead: true }
							: notification,
					);
				},
			);

			// Return context with snapshot
			return { previousNotifications };
		},
		onError: (error: any, id, context) => {
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
