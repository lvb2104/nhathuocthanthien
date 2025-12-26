import { getAllBatches } from '@/services';
import { GetAllBatchesResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useBatches(initialData?: GetAllBatchesResponse) {
	return useQuery({
		queryKey: ['batches'],
		queryFn: () => getAllBatches(),
		staleTime: 1000 * 60 * 5,
		initialData,
	});
}
