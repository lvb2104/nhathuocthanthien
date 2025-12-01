import { handleAxiosError } from '@/lib/utils';
import { deleteProduct } from '@/services';
import { useMutation } from '@tanstack/react-query';

export function useDeleteProduct() {
	return useMutation({
		mutationFn: deleteProduct,
		onError: (error: any) => handleAxiosError(error),
	});
}
