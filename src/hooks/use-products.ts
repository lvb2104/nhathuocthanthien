import { GetProducts } from '@/services';
import { useQuery } from '@tanstack/react-query';

export function useProducts() {
	return useQuery({
		queryKey: ['products'],
		queryFn: () => GetProducts(),
	});
}
