import { getReviewsByProduct } from '@/services';
import {
	GetReviewsByProductResponse,
	ProductReviewFilterParams,
} from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useProductReviews(
	productId: number,
	params?: ProductReviewFilterParams,
	initialData?: GetReviewsByProductResponse,
) {
	return useQuery({
		queryKey: ['reviews', 'product', productId, params],
		queryFn: () => getReviewsByProduct(productId, params),
		staleTime: 1000 * 60 * 5,
		initialData,
		enabled: !!productId,
	});
}
