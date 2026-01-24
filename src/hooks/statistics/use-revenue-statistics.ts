import { getRevenueStatistics } from '@/services/statistics';
import { GetRevenueStatisticsResponse, RevenueStatisticsParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useRevenueStatistics(
	params?: RevenueStatisticsParams,
	placeholderData?: GetRevenueStatisticsResponse,
) {
	return useQuery({
		queryKey: ['statistics', 'revenue', params],
		queryFn: () => getRevenueStatistics(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		placeholderData,
	});
}
