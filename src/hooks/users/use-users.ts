import { getUsers } from '@/services';
import { GetAllUsersResponse, UserFilterParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useUsers(
	params?: UserFilterParams,
	placeholderData?: GetAllUsersResponse,
) {
	return useQuery({
		queryKey: ['users', params],
		queryFn: () => getUsers(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		placeholderData,
	});
}
