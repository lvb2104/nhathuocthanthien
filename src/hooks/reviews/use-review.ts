import { getReviewById } from '@/services';
import { GetReviewByIdResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useReview(id: number, initialData?: GetReviewByIdResponse) {
	return useQuery({
		queryKey: ['reviews', id],
		queryFn: () => getReviewById(id),
		staleTime: 1000 * 60 * 5,
		initialData,
		enabled: !!id,
	});
}
