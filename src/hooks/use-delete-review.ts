import { handleAxiosError } from '@/lib/utils';
import { deleteReview } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteReview,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
