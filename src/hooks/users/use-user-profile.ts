import { getUserProfile } from '@/services';
import { GetUserProfileResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useUserProfile(initialData?: GetUserProfileResponse) {
	return useQuery({
		queryKey: ['user', 'profile'],
		queryFn: () => getUserProfile(),
		staleTime: 1000 * 60 * 5, // 5 minutes
		initialData,
	});
}
