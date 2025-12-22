import { handleAxiosError } from '@/lib/utils';
import { updatePromotion } from '@/services';
import { UpdatePromotionRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdatePromotion() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			request,
		}: {
			id: number;
			request: UpdatePromotionRequest;
		}) => updatePromotion(id, request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['promotions'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
