import { handleAxiosError } from '@/lib/utils';
import { deleteProduct } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
