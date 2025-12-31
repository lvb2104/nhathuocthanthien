import { handleAxiosError } from '@/lib/utils';
import { disposeBatch } from '@/services';
import { DisposeBatchRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDisposeBatch() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			request,
		}: {
			id: number;
			request: DisposeBatchRequest;
		}) => disposeBatch(id, request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['batches'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
