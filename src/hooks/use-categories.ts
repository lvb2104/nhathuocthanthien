import { getCategories } from '@/services';
import { GetCategoriesResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useCategories(initialData?: GetCategoriesResponse) {
	return useQuery({
		queryKey: ['categories'],
		queryFn: () => getCategories(),
		initialData,
	});
}
