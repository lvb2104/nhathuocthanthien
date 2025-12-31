import { getBatchById } from '@/services';
import { GetBatchByIdResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useBatch(id: number, initialData?: GetBatchByIdResponse) {
	return useQuery({
		queryKey: ['batches', id],
		queryFn: () => getBatchById(id),
		staleTime: 1000 * 60 * 5,
		initialData,
		enabled: !!id,
	});
}
