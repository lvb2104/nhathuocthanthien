import { getAllReviews } from '@/services';
import { GetAllReviewsResponse, ReviewFilterParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useReviews(
	params?: ReviewFilterParams,
	placeholderData?: GetAllReviewsResponse,
) {
	return useQuery({
		queryKey: ['reviews', params],
		queryFn: () => getAllReviews(params),
		staleTime: 1000 * 60 * 5,
		placeholderData,
	});
}
