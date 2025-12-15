import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addItemToCart } from '@/services/cart';
import { handleAxiosError } from '@/lib/utils';

/**
 * Hook to add an item to the cart (or increment if exists)
 */
export function useAddToCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			quantity,
		}: {
			productId: number;
			quantity: number;
		}) => addItemToCart(productId, { quantity }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
