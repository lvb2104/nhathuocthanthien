import { getMyReviews } from '@/services';
import { GetMyReviewsResponse, MyReviewsFilterParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useMyReviews(
	params?: MyReviewsFilterParams,
	initialData?: GetMyReviewsResponse,
) {
	return useQuery({
		queryKey: ['reviews', 'my', params],
		queryFn: () => getMyReviews(params),
		staleTime: 1000 * 60 * 5,
		initialData,
	});
}
