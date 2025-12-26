import { handleAxiosError } from '@/lib/utils';
import { deleteBatch } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteBatch() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBatch,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['batches'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
