import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItemFromCart } from '@/services';
import { handleAxiosError } from '@/lib/utils';

/**
 * Hook to remove a specific item from the cart
 */
export function useRemoveFromCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (productId: number) => deleteItemFromCart(productId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
