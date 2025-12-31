import { handleAxiosError } from '@/lib/utils';
import { createProduct } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
