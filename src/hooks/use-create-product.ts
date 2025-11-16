import { handleAxiosError } from '@/lib/utils';
import { CreateProduct } from '@/services';
import { useMutation } from '@tanstack/react-query';

export function useCreateProduct() {
	return useMutation({
		mutationFn: CreateProduct,
		onError: (error: any) => handleAxiosError(error),
	});
}
