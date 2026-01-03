import { getCategories } from '@/services';
import { CategoryFilterParams, GetCategoriesResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useCategories(
	params?: CategoryFilterParams,
	initialData?: GetCategoriesResponse,
) {
	return useQuery({
		queryKey: ['categories', params],
		queryFn: () => getCategories(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		initialData,
	});
}
