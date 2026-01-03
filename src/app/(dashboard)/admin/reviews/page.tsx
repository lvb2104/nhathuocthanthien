import { serverGetReviews } from '@/services';
import { ReviewsTable } from './_components/reviews-table';

async function ReviewsPage() {
	const initialReviews = await serverGetReviews({
		page: 1,
		limit: 10,
	});

	return (
		<div className='flex flex-col gap-6 p-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Reviews</h1>
					<p className='text-muted-foreground'>
						Manage and moderate product reviews
					</p>
				</div>
			</div>

			<ReviewsTable initialReviews={initialReviews} />
		</div>
	);
}

export default ReviewsPage;
