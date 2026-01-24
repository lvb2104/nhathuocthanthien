import { getTopSellingProducts } from '@/services/statistics';
import {
	GetTopSellingProductsResponse,
	TopSellingProductsParams,
} from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useTopSellingProducts(
	params?: TopSellingProductsParams,
	placeholderData?: GetTopSellingProductsResponse,
) {
	return useQuery({
		queryKey: ['statistics', 'top-products', params],
		queryFn: () => getTopSellingProducts(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		placeholderData,
	});
}
