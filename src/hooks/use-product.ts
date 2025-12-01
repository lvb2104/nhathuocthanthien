import { getProductById } from '@/services';
import { CreateProductResponse, GetProductByIdResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useProduct(id: number, initialData?: GetProductByIdResponse) {
	return useQuery<CreateProductResponse>({
		queryKey: ['product', id],
		queryFn: () => getProductById(id),
		enabled: typeof id === 'number' && !Number.isNaN(id),
		initialData,
	});
}
