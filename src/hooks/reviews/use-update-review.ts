import { handleAxiosError } from '@/lib/utils';
import { updateReview } from '@/services';
import { UpdateReviewRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			request,
		}: {
			id: number;
			request: UpdateReviewRequest;
		}) => updateReview(id, request),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
			queryClient.invalidateQueries({ queryKey: ['reviews', variables.id] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
