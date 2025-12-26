import { getAllReviews } from '@/services';
import { GetAllReviewsResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useReviews(initialData?: GetAllReviewsResponse) {
	return useQuery({
		queryKey: ['reviews'],
		queryFn: () => getAllReviews(),
		staleTime: 1000 * 60 * 5,
		initialData,
	});
}
