import { GetProductById } from '@/services';
import { CreateProductResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useProduct(id: number) {
	return useQuery<CreateProductResponse>({
		queryKey: ['product', id],
		queryFn: () => GetProductById(id),
		enabled: typeof id === 'number' && !Number.isNaN(id),
	});
}
