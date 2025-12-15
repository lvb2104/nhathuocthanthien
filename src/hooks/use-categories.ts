import { getCategories } from '@/services';
import { GetCategoriesResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useCategories(initialData?: GetCategoriesResponse) {
	return useQuery({
		queryKey: ['categories'],
		queryFn: () => getCategories(),
		staleTime: 1000 * 60 * 5, // 5 minutes
		initialData,
	});
}
