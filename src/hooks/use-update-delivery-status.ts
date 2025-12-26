import { handleAxiosError } from '@/lib/utils';
import { updateDeliveryStatus } from '@/services';
import { UpdateDeliveryStatusRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateDeliveryStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			request,
		}: {
			id: number;
			request: UpdateDeliveryStatusRequest;
		}) => updateDeliveryStatus(id, request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['deliveries'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
