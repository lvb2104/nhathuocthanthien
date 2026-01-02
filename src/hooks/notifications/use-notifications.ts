import { getNotifications } from '@/services';
import { GetNotificationsResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useNotifications(initialData?: GetNotificationsResponse) {
	return useQuery({
		queryKey: ['notifications'],
		queryFn: () => getNotifications(),
		staleTime: 1000 * 60 * 2, // 2 minutes - notifications should be fresh
		initialData,
	});
}
