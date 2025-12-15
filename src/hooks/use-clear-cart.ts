import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCart } from '@/services/cart';

/**
 * Hook to clear the entire cart
 */
export function useClearCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCart,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		},
	});
}
