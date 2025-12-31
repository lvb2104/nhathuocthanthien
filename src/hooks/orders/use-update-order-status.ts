import { handleAxiosError } from '@/lib/utils';
import { updateOrderStatus } from '@/services';
import { OrderStatus } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateOrderStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			request,
		}: {
			id: number;
			request: { status: OrderStatus };
		}) => updateOrderStatus(id, request),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
