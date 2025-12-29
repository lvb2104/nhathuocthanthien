import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuantity } from '@/services';
import { handleAxiosError } from '@/lib/utils';

/**
 * Hook to update the quantity of an item in the cart
 */
export function useUpdateCartItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			quantity,
		}: {
			productId: number;
			quantity: number;
		}) => updateQuantity(productId, { quantity }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
