'use client';

import { useReview, useUpdateReview } from '@/hooks';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Package, User, MessageSquare, Calendar } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { routes } from '@/configs/routes';

interface ReviewDetailSheetProps {
	reviewId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

export function ReviewDetailSheet({
	reviewId,
	open,
	onOpenChange,
	onSuccess,
}: ReviewDetailSheetProps) {
	const { data: review, isLoading } = useReview(reviewId);
	const { mutateAsync: updateReview, isPending: isUpdating } =
		useUpdateReview();

	const [comment, setComment] = useState('');
	const [isEditing, setIsEditing] = useState(false);

	// Update local state when review data loads
	useState(() => {
		if (review) {
			setComment(review.comment || '');
		}
	});

	const handleSave = async () => {
		if (!review) return;

		try {
			await updateReview({
				id: reviewId,
				request: {
					comment: comment || undefined,
				},
			});
			toast.success('Đã cập nhật đánh giá thành công');
			setIsEditing(false);
			onSuccess?.();
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast.error('Cập nhật đánh giá thất bại');
		}
	};

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
					<SheetDescription>
						Xem và chỉnh sửa thông tin đánh giá
					</SheetDescription>
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
							{isEditing ? (
								<Textarea
									value={comment}
									onChange={e => setComment(e.target.value)}
									placeholder='Không có nhận xét'
									rows={6}
									className='resize-none'
								/>
							) : (
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
							)}
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
							{isEditing ? (
								<div className='flex gap-2'>
									<Button
										onClick={handleSave}
										disabled={isUpdating}
										className='flex-1 h-10 text-sm bg-green-600 hover:bg-green-700'
									>
										{isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
									</Button>
									<Button
										variant='outline'
										onClick={() => {
											setComment(review.comment || '');
											setIsEditing(false);
										}}
										disabled={isUpdating}
										className='h-10 text-sm'
									>
										Hủy
									</Button>
								</div>
							) : (
								<div className='flex gap-2'>
									<Button
										onClick={() => setIsEditing(true)}
										className='flex-1 h-10 text-sm bg-green-600 hover:bg-green-700'
									>
										Chỉnh sửa nhận xét
									</Button>
									<Button
										variant='outline'
										onClick={() => onOpenChange(false)}
										className='h-10 text-sm'
									>
										Đóng
									</Button>
								</div>
							)}
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
