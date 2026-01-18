import { serverGetReviews } from '@/services';
import { ReviewsTable } from './_components/reviews-table';

async function ReviewsPage() {
	const initialReviews = await serverGetReviews({
		page: 1,
		limit: 10,
	});

	return <ReviewsTable initialReviews={initialReviews} />;
}

export default ReviewsPage;
