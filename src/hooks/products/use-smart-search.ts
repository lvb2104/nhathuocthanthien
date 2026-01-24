import { smartSearch } from '@/services';
import { SmartSearchParams, SmartSearchResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useSmartSearch(
	params?: SmartSearchParams,
	placeholderData?: SmartSearchResponse,
) {
	return useQuery({
		queryKey: ['smart-search', params],
		queryFn: () => smartSearch(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		placeholderData,
	});
}
