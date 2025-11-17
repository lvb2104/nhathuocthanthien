import { handleAxiosError } from '@/lib/utils';
import { UpdateProduct } from '@/services';
import { useMutation } from '@tanstack/react-query';

export function useUpdateProduct() {
	return useMutation({
		mutationFn: UpdateProduct,
		onError: (error: any) => handleAxiosError(error),
	});
}
