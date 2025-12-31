'use client';
import { useState } from 'react';
import { useProductReviews, useCreateReview } from '@/hooks';
import { GetReviewsByProductResponse } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

interface ProductReviewsSectionProps {
	productId: number;
	initialReviews?: GetReviewsByProductResponse;
}

export function ProductReviewsSection({
	productId,
	initialReviews,
}: ProductReviewsSectionProps) {
	const [selectedRating, setSelectedRating] = useState<number | undefined>();
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 5;

	// Review creation dialog state
	const [dialogOpen, setDialogOpen] = useState(false);
	const [newReviewRating, setNewReviewRating] = useState<number>(5);
	const [newReviewComment, setNewReviewComment] = useState('');

	const { mutate: createReview, isPending: isCreating } = useCreateReview();

	const handleSubmitReview = () => {
		createReview(
			{
				productId,
				request: { rating: newReviewRating, comment: newReviewComment },
			},
			{
				onSuccess: () => {
					toast.success('Cảm ơn bạn đã đánh giá sản phẩm!');
					setDialogOpen(false);
					setNewReviewRating(5);
					setNewReviewComment('');
				},
				onError: () => {
					// Error already handled by handleAxiosError in the hook
				},
			},
		);
	};

	const { data: reviewsResponse, isLoading } = useProductReviews(
		productId,
		{
			page: currentPage,
			limit: ITEMS_PER_PAGE,
			rating: selectedRating,
		},
		initialReviews,
	);

	const reviews = reviewsResponse?.data || [];
	const pagination = reviewsResponse?.pagination;

	// Calculate rating statistics
	const calculateRatingStats = () => {
		const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
		let totalRating = 0;
		const totalReviews = reviews.length;

		reviews.forEach(review => {
			stats[review.rating as keyof typeof stats]++;
			totalRating += review.rating;
		});

		const averageRating =
			totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0.0';

		return { stats, averageRating, totalReviews };
	};

	const { stats, averageRating, totalReviews } = calculateRatingStats();

	// Render stars
	const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
		const sizeClasses = {
			sm: 'text-xs',
			md: 'text-base',
			lg: 'text-2xl',
		};

		return (
			<span className={`text-yellow-400 ${sizeClasses[size]}`}>
				{'★'.repeat(rating)}
				{'☆'.repeat(5 - rating)}
			</span>
		);
	};

	// Render rating bar
	const renderRatingBar = (star: number) => {
		const count = stats[star as keyof typeof stats];
		const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

		return (
			<div className='flex items-center gap-2 text-sm'>
				<span className='w-8 text-right font-medium text-neutral-700'>
					{star} ★
				</span>
				<div className='h-2 flex-1 overflow-hidden rounded-full bg-neutral-200'>
					<div
						className='h-full bg-yellow-400 transition-all duration-300'
						style={{ width: `${percentage}%` }}
					/>
				</div>
				<span className='w-16 text-xs text-neutral-500'>
					{percentage.toFixed(0)}% | {count} đánh giá
				</span>
			</div>
		);
	};

	return (
		<section className='mt-8 rounded-xl border border-neutral-200 bg-white shadow-sm'>
			{/* Header */}
			<div className='border-b border-neutral-200 bg-neutral-50 px-6 py-4'>
				<h2 className='text-lg font-bold text-neutral-900'>
					Đánh giá Phong Tễ Thấp Bà Giằng, Điều trị đau do thoát vị đĩa đệm, đau
					nhức xương, đau thần kinh tọa, liên sườn
				</h2>
			</div>

			{/* Rating Summary */}
			<div className='grid gap-6 border-b border-neutral-200 p-6 md:grid-cols-[200px_1fr]'>
				{/* Left: Average Rating */}
				<div className='flex flex-col items-center justify-center rounded-lg bg-green-50 p-6'>
					<div className='mb-2 text-5xl font-bold text-green-600'>
						{averageRating}
					</div>
					<div className='mb-1 text-sm font-semibold uppercase tracking-wide text-neutral-600'>
						ĐÁNH GIÁ TRUNG BÌNH
					</div>
					{renderStars(Math.round(Number(averageRating)), 'lg')}
					<div className='mt-2 text-xs text-neutral-500'>
						{totalReviews} đánh giá
					</div>
				</div>

				{/* Right: Rating Distribution + Review Button */}
				<div className='flex flex-col justify-between gap-4'>
					<div className='space-y-2'>
						{[5, 4, 3, 2, 1].map(star => (
							<div key={star}>{renderRatingBar(star)}</div>
						))}
					</div>

					<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<AlertDialogTrigger asChild>
							<button className='self-end rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-95'>
								ĐÁNH GIÁ NGAY
							</button>
						</AlertDialogTrigger>
						<AlertDialogContent className='max-w-2xl'>
							<AlertDialogHeader>
								<AlertDialogTitle className='text-lg'>
									Đánh giá sản phẩm
								</AlertDialogTitle>
							</AlertDialogHeader>

							<div className='space-y-6 py-4'>
								{/* Star Rating Selector */}
								<div className='space-y-3'>
									<label className='text-sm font-semibold text-neutral-900'>
										Bạn đánh thế nào về sản phẩm? (Chọn sao)
										<span className='text-red-600'>*</span>
									</label>
									<div className='flex items-center justify-center gap-2'>
										{[1, 2, 3, 4, 5].map(star => {
											const labels = [
												'Rất tệ',
												'Tệ',
												'Trung bình',
												'Tốt',
												'Tuyệt vời',
											];
											const isSelected = star <= newReviewRating;
											return (
												<button
													key={star}
													type='button'
													onClick={() => setNewReviewRating(star)}
													className='group flex flex-col items-center gap-1 transition-transform hover:scale-110'
												>
													<span
														className={`text-4xl transition-colors ${
															isSelected
																? 'text-yellow-400'
																: 'text-neutral-300 group-hover:text-yellow-200'
														}`}
													>
														{isSelected ? '★' : '☆'}
													</span>
													<span
														className={`text-xs font-medium transition-colors ${
															isSelected
																? 'text-yellow-600'
																: 'text-neutral-400'
														}`}
													>
														{labels[star - 1]}
													</span>
												</button>
											);
										})}
									</div>
								</div>

								{/* Quick Review Templates */}
								<div className='space-y-2'>
									<label className='text-sm font-medium text-neutral-700'>
										Hoặc chọn nhanh:
									</label>
									<div className='flex flex-wrap gap-2'>
										{[
											'Chất lượng sản phẩm tuyệt vời!',
											'Hàng 100% chính hãng',
											'Shop phục vụ tốt',
											'Thời gian giao hàng rất nhanh',
											'Mời bạn chọn sẽ thêm một số cảm nhận...',
											'Sản phẩm đóng gói cẩn thận',
										].map(template => (
											<button
												key={template}
												type='button'
												onClick={() => setNewReviewComment(template)}
												className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 ${
													newReviewComment === template
														? 'border-green-600 bg-green-50 text-green-700'
														: 'border-neutral-300 bg-white text-neutral-700 hover:border-green-400 hover:bg-green-50'
												}`}
											>
												{template}
											</button>
										))}
									</div>
								</div>

								{/* Comment Textarea */}
								<div className='space-y-2'>
									<label className='text-sm font-semibold text-neutral-900'>
										Mời bạn chia sẻ thêm một số cảm nhận...
									</label>
									<Textarea
										value={newReviewComment}
										onChange={e => setNewReviewComment(e.target.value)}
										placeholder='Hãy chia sẻ cảm nhận của bạn về sản phẩm này...'
										className='min-h-[120px] resize-none'
									/>
								</div>
							</div>

							{/* Action Buttons */}
							<div className='flex justify-end gap-3'>
								<AlertDialogCancel asChild>
									<Button variant='outline' disabled={isCreating}>
										Hủy
									</Button>
								</AlertDialogCancel>
								<Button
									onClick={handleSubmitReview}
									disabled={isCreating}
									className='bg-green-600 hover:bg-green-700'
								>
									{isCreating ? 'Đang gửi...' : 'GỬI ĐÁNH GIÁ'}
								</Button>
							</div>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className='border-b border-neutral-200 px-6 py-3'>
				<div className='flex flex-wrap items-center gap-2'>
					{/* All Tab */}
					<button
						onClick={() => setSelectedRating(undefined)}
						className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
							selectedRating === undefined
								? 'border-blue-600 bg-blue-600 text-white'
								: 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
						}`}
					>
						Tất cả
					</button>

					{/* Rating Filter Tabs */}
					{[5, 4, 3, 2, 1].map(rating => (
						<button
							key={rating}
							onClick={() => setSelectedRating(rating)}
							className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
								selectedRating === rating
									? 'border-blue-600 bg-blue-600 text-white'
									: 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
							}`}
						>
							{rating} ★
						</button>
					))}
				</div>
			</div>

			{/* Reviews List */}
			<div className='divide-y divide-neutral-100 p-6'>
				{isLoading ? (
					<div className='py-12 text-center text-neutral-500'>
						Đang tải đánh giá...
					</div>
				) : reviews.length > 0 ? (
					<>
						{reviews.map(review => (
							<div key={review.id} className='py-6 first:pt-0 last:pb-0'>
								{/* Review Header */}
								<div className='mb-3 flex items-start justify-between'>
									<div className='flex items-start gap-3'>
										{/* Avatar */}
										<div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700'>
											{review.user?.fullName?.charAt(0).toUpperCase() || 'U'}
										</div>

										{/* User Info */}
										<div>
											<div className='font-semibold text-neutral-900'>
												{review.user?.fullName || 'Người dùng'}
											</div>
											<div className='mt-0.5 flex items-center gap-2'>
												{renderStars(review.rating, 'sm')}
												<span className='text-xs text-neutral-500'>
													{formatDistanceToNow(new Date(review.createdAt), {
														addSuffix: true,
														locale: vi,
													})}
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Review Comment */}
								{review.comment && (
									<p className='text-sm leading-relaxed text-neutral-700'>
										{review.comment}
									</p>
								)}
							</div>
						))}

						{/* Pagination */}
						{pagination && pagination.totalPages > 1 && (
							<div className='mt-6 flex items-center justify-center gap-2'>
								<button
									onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
									disabled={currentPage === 1}
									className='rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed'
								>
									← Trước
								</button>

								<span className='text-sm text-neutral-600'>
									Trang {currentPage} / {pagination.totalPages}
								</span>

								<button
									onClick={() =>
										setCurrentPage(p => Math.min(pagination.totalPages, p + 1))
									}
									disabled={currentPage === pagination.totalPages}
									className='rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed'
								>
									Sau →
								</button>
							</div>
						)}
					</>
				) : (
					<div className='py-12 text-center'>
						<p className='mb-2 text-neutral-600'>Chưa có đánh giá nào.</p>
						<p className='text-sm text-neutral-500'>
							Hãy là người đầu tiên đánh giá sản phẩm này!
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
