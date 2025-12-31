import { handleAxiosError } from '@/lib/utils';
import { updateProduct } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, request }: { id: number; request: FormData }) =>
			updateProduct(id, request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
