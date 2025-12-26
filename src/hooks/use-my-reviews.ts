import { getMyReviews } from '@/services';
import { GetMyReviewsResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useMyReviews(initialData?: GetMyReviewsResponse) {
	return useQuery({
		queryKey: ['reviews', 'my'],
		queryFn: () => getMyReviews(),
		staleTime: 1000 * 60 * 5,
		initialData,
	});
}
