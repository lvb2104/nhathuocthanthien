import { handleAxiosError } from '@/lib/utils';
import { updateDeliveryPartial } from '@/services';
import { UpdateDeliveryStatusRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateDelivery() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			request,
		}: {
			id: number;
			request: UpdateDeliveryStatusRequest;
		}) => updateDeliveryPartial(id, request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['deliveries'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
