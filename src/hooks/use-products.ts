import { getProducts } from '@/services';
import { GetProductsResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useProducts(initialData?: GetProductsResponse) {
	return useQuery({
		queryKey: ['products'],
		queryFn: () => getProducts(),
		initialData,
	});
}
