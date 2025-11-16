import { GetCategories } from '@/services';
import { useQuery } from '@tanstack/react-query';

export function useCategories() {
	return useQuery({
		queryKey: ['categories'],
		queryFn: () => GetCategories(),
	});
}
