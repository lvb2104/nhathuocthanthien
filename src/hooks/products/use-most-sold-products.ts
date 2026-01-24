import { getMostSoldProducts } from '@/services';
import {
	GetMostSoldProductsResponse,
	MostSoldProductsFilterParams,
} from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useMostSoldProducts(
	params?: MostSoldProductsFilterParams,
	placeholderData?: GetMostSoldProductsResponse,
) {
	return useQuery({
		queryKey: ['mostSoldProducts', params],
		queryFn: () => getMostSoldProducts(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		placeholderData,
	});
}
