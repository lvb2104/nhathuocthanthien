import { getAllBatches } from '@/services';
import { GetAllBatchesResponse, BatchFilterParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useBatches(
	params?: BatchFilterParams,
	initialData?: GetAllBatchesResponse,
) {
	return useQuery({
		queryKey: ['batches', params],
		queryFn: () => getAllBatches(params),
		staleTime: 1000 * 60 * 5,
		initialData,
	});
}
