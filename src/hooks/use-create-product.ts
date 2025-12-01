import { handleAxiosError } from '@/lib/utils';
import { createProduct } from '@/services';
import { useMutation } from '@tanstack/react-query';

export function useCreateProduct() {
	return useMutation({
		mutationFn: createProduct,
		onError: (error: any) => handleAxiosError(error),
	});
}
