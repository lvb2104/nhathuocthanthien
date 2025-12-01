import { handleAxiosError } from '@/lib/utils';
import { updateProduct } from '@/services';
import { useMutation } from '@tanstack/react-query';

export function useUpdateProduct() {
	return useMutation({
		mutationFn: updateProduct,
		onError: (error: any) => handleAxiosError(error),
	});
}
