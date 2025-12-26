import { getReviewsByProduct } from '@/services';
import { GetReviewsByProductResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useProductReviews(
	productId: number,
	initialData?: GetReviewsByProductResponse,
) {
	return useQuery({
		queryKey: ['reviews', 'product', productId],
		queryFn: () => getReviewsByProduct(productId),
		staleTime: 1000 * 60 * 5,
		initialData,
		enabled: !!productId,
	});
}
