import { getCategories } from '@/services';
import { GetCategoriesResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useCategories(
	params?: {
		page?: number;
		limit?: number;
		keyword?: string;
	},
	initialData?: GetCategoriesResponse,
) {
	return useQuery({
		queryKey: ['categories', params],
		queryFn: () => getCategories(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		initialData,
	});
}
