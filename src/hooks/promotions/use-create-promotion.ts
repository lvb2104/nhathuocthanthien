import { handleAxiosError } from '@/lib/utils';
import { createPromotion } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreatePromotion() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPromotion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['promotions'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
