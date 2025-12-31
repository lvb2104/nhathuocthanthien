import { handleAxiosError } from '@/lib/utils';
import { deletePromotion } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeletePromotion() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deletePromotion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['promotions'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
