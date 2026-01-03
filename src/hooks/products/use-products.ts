import { getProducts } from '@/services';
import { GetProductsResponse, ProductFilterParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useProducts(
	params?: ProductFilterParams,
	initialData?: GetProductsResponse,
) {
	return useQuery({
		queryKey: ['products', params],
		queryFn: () => getProducts(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		initialData,
	});
}
