import { handleAxiosError } from '@/lib/utils';
import { DeleteProduct } from '@/services';
import { useMutation } from '@tanstack/react-query';

export function useDeleteProduct() {
	return useMutation({
		mutationFn: DeleteProduct,
		onError: (error: any) => handleAxiosError(error),
	});
}
