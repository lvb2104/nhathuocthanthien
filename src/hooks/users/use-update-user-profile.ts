import { handleAxiosError } from '@/lib/utils';
import { updateUserProfile } from '@/services';
import { UpdateUserProfileRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateUserProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (request: UpdateUserProfileRequest) =>
			updateUserProfile(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
