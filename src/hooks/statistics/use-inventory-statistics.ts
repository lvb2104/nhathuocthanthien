import { getInventoryStatistics } from '@/services/statistics';
import { GetInventoryStatisticsResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useInventoryStatistics(
	placeholderData?: GetInventoryStatisticsResponse,
) {
	return useQuery({
		queryKey: ['statistics', 'inventory'],
		queryFn: getInventoryStatistics,
		staleTime: 1000 * 60 * 5, // 5 minutes
		placeholderData,
	});
}
