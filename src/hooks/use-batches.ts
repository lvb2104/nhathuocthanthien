import { getAllBatches } from '@/services';
import { GetAllBatchesResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useBatches(
	params?: {
		page?: number;
		limit?: number;
		productId?: number;
		status?: string;
		expired?: boolean;
		keyword?: string;
	},
	initialData?: GetAllBatchesResponse,
) {
	return useQuery({
		queryKey: ['batches', params],
		queryFn: () => getAllBatches(params),
		staleTime: 1000 * 60 * 5,
		initialData,
	});
}
