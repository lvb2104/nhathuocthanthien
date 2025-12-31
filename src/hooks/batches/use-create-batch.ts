import { handleAxiosError } from '@/lib/utils';
import { createBatch } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateBatch() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createBatch,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['batches'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
