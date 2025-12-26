import { handleAxiosError } from '@/lib/utils';
import { createDelivery } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateDelivery() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			orderId,
			employeeId,
		}: {
			orderId: number;
			employeeId: number;
		}) => createDelivery(orderId, employeeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['deliveries'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
