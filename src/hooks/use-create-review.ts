import { handleAxiosError } from '@/lib/utils';
import { createReview } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ productId, request }: { productId: number; request: any }) =>
			createReview(productId, request),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
			queryClient.invalidateQueries({
				queryKey: ['reviews', 'product', variables.productId],
			});
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
