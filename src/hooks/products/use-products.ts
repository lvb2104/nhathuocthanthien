import { getProducts } from '@/services';
import { GetProductsResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useProducts(
	params?: {
		page?: number;
		limit?: number;
		categoryId?: number;
		onlyDeleted?: boolean;
		keyword?: string;
		priceFrom?: number;
		priceTo?: number;
	},
	initialData?: GetProductsResponse,
) {
	return useQuery({
		queryKey: ['products', params],
		queryFn: () => getProducts(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		initialData,
	});
}
