import { getOverviewStatistics } from '@/services/statistics';
import { GetOverviewStatisticsResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useOverviewStatistics(
	placeholderData?: GetOverviewStatisticsResponse,
) {
	return useQuery({
		queryKey: ['statistics', 'overview'],
		queryFn: getOverviewStatistics,
		staleTime: 1000 * 60 * 5, // 5 minutes
		placeholderData,
	});
}
