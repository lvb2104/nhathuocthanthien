import { getCustomerProducts } from '@/services';
import { GetProductsResponse, ProductFilterParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useCustomerProducts(
	params?: ProductFilterParams,
	placeholderData?: GetProductsResponse,
) {
	return useQuery({
		queryKey: ['customerProducts', params],
		queryFn: () => getCustomerProducts(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		placeholderData,
	});
}
