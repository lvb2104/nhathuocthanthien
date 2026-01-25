'use client';

import { useReview } from '@/hooks';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { Star, Package, User, MessageSquare, Calendar } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/configs/routes';

interface ReviewDetailSheetProps {
	reviewId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ReviewDetailSheet({
	reviewId,
	open,
	onOpenChange,
}: ReviewDetailSheetProps) {
	const { data: review, isLoading } = useReview(reviewId);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const renderStars = (rating: number) => {
		return (
			<div className='flex items-center gap-1'>
				{Array.from({ length: 5 }).map((_, index) => (
					<Star
						key={index}
						className={`size-5 ${
							index < rating
								? 'fill-yellow-400 text-yellow-400'
								: 'text-gray-300'
						}`}
					/>
				))}
				<span className='ml-2 text-lg font-semibold'>{rating}/5</span>
			</div>
		);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='w-full overflow-y-auto sm:max-w-2xl p-6'>
				<SheetHeader className='mb-6'>
					<SheetTitle>Chi tiết đánh giá</SheetTitle>
					<SheetDescription>Xem thông tin đánh giá</SheetDescription>
				</SheetHeader>

				{isLoading ? (
					<div className='flex items-center justify-center py-8'>
						Đang tải chi tiết đánh giá...
					</div>
				) : review ? (
					<div className='space-y-6'>
						{/* Review ID */}
						<div className='pb-5 border-b'>
							<h3 className='font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2'>
								<Star size={16} className='text-green-600' />
								Mã đánh giá
							</h3>
							<div className='font-medium'>#{review.id}</div>
						</div>

						{/* Product */}
						<div className='pb-5 border-b'>
							<h3 className='font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2'>
								<Package size={16} className='text-green-600' />
								Sản phẩm
							</h3>
							<Link
								href={routes.products.detail(review.productId)}
								className='text-primary hover:underline font-medium'
								target='_blank'
							>
								Sản phẩm #{review.productId}
							</Link>
						</div>

						{/* User */}
						<div className='pb-5 border-b'>
							<h3 className='font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2'>
								<User size={16} className='text-green-600' />
								Người dùng
							</h3>
							<div className='bg-gray-50 rounded-lg p-4 space-y-2.5 text-xs'>
								<div className='flex gap-2'>
									<span className='font-medium text-gray-600 w-28 flex-shrink-0'>
										Tên:
									</span>
									<span className='text-gray-900'>
										{review.user?.fullName || 'N/A'}
									</span>
								</div>
								<div className='flex gap-2'>
									<span className='font-medium text-gray-600 w-28 flex-shrink-0'>
										Mã người dùng:
									</span>
									<span className='text-gray-900'>#{review.userId}</span>
								</div>
							</div>
						</div>

						{/* Rating */}
						<div className='pb-5 border-b'>
							<h3 className='font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2'>
								<Star size={16} className='text-green-600' />
								Đánh giá
							</h3>
							<div>{renderStars(review.rating)}</div>
						</div>

						{/* Comment */}
						<div className='pb-5 border-b'>
							<h3 className='font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2'>
								<MessageSquare size={16} className='text-green-600' />
								Nhận xét
							</h3>
							<div className='rounded-md bg-gray-50 p-4 min-h-[100px]'>
								{review.comment ? (
									<p className='text-sm whitespace-pre-wrap text-gray-900'>
										{review.comment}
									</p>
								) : (
									<p className='text-sm text-muted-foreground italic'>
										Không có nhận xét
									</p>
								)}
							</div>
						</div>

						{/* Dates */}
						<div className='pb-5 border-b'>
							<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
								<Calendar size={16} className='text-green-600' />
								Thông tin thời gian
							</h3>
							<div className='bg-gray-50 rounded-lg p-4 space-y-2.5 text-xs'>
								<div className='flex gap-2'>
									<span className='font-medium text-gray-600 w-28 flex-shrink-0'>
										Ngày tạo:
									</span>
									<span className='text-gray-900'>
										{formatDate(review.createdAt)}
									</span>
								</div>
								<div className='flex gap-2'>
									<span className='font-medium text-gray-600 w-28 flex-shrink-0'>
										Ngày cập nhật:
									</span>
									<span className='text-gray-900'>
										{formatDate(review.updatedAt)}
									</span>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className='pt-3'>
							<Button
								variant='outline'
								onClick={() => onOpenChange(false)}
								className='w-full h-10 text-sm'
							>
								Đóng
							</Button>
						</div>
					</div>
				) : (
					<div className='flex items-center justify-center py-8 text-muted-foreground'>
						Đánh giá không tìm thấy
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
