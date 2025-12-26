import { handleAxiosError } from '@/lib/utils';
import { updateBatch } from '@/services';
import { UpdateBatchRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateBatch() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			request,
		}: {
			id: number;
			request: UpdateBatchRequest;
		}) => updateBatch(id, request),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['batches'] });
			queryClient.invalidateQueries({ queryKey: ['batches', variables.id] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
