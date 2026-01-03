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
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
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
			toast.success('Review updated successfully');
			setIsEditing(false);
			onSuccess?.();
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast.error('Failed to update review');
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
			<SheetContent className='sm:max-w-[540px] overflow-y-auto'>
				<SheetHeader>
					<SheetTitle>Review Details</SheetTitle>
					<SheetDescription>View and edit review information</SheetDescription>
				</SheetHeader>

				{isLoading ? (
					<div className='flex items-center justify-center py-8'>
						Loading review details...
					</div>
				) : review ? (
					<div className='space-y-6 py-6'>
						{/* Review ID */}
						<div className='space-y-2'>
							<Label className='text-muted-foreground'>Review ID</Label>
							<div className='font-medium'>#{review.id}</div>
						</div>

						{/* Product */}
						<div className='space-y-2'>
							<Label className='text-muted-foreground'>Product</Label>
							<div>
								<Link
									href={routes.products.detail(review.productId)}
									className='text-primary hover:underline font-medium'
									target='_blank'
								>
									Product #{review.productId}
								</Link>
							</div>
						</div>

						{/* User */}
						<div className='space-y-2'>
							<Label className='text-muted-foreground'>User</Label>
							<div>
								<div className='font-medium'>
									{review.user?.fullName || 'N/A'}
								</div>
								<div className='text-sm text-muted-foreground'>
									User ID: #{review.userId}
								</div>
							</div>
						</div>

						{/* Rating */}
						<div className='space-y-2'>
							<Label className='text-muted-foreground'>Rating</Label>
							<div>{renderStars(review.rating)}</div>
						</div>

						{/* Comment */}
						<div className='space-y-2'>
							<Label className='text-muted-foreground'>Comment</Label>
							{isEditing ? (
								<Textarea
									value={comment}
									onChange={e => setComment(e.target.value)}
									placeholder='No comment provided'
									rows={6}
									className='resize-none'
								/>
							) : (
								<div className='rounded-md border p-3 bg-muted/50 min-h-[100px]'>
									{review.comment ? (
										<p className='text-sm whitespace-pre-wrap'>
											{review.comment}
										</p>
									) : (
										<p className='text-sm text-muted-foreground italic'>
											No comment provided
										</p>
									)}
								</div>
							)}
						</div>

						{/* Dates */}
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label className='text-muted-foreground'>Created At</Label>
								<div className='text-sm'>{formatDate(review.createdAt)}</div>
							</div>
							<div className='space-y-2'>
								<Label className='text-muted-foreground'>Updated At</Label>
								<div className='text-sm'>{formatDate(review.updatedAt)}</div>
							</div>
						</div>

						{/* Actions */}
						<div className='flex gap-2 pt-4'>
							{isEditing ? (
								<>
									<Button
										onClick={handleSave}
										disabled={isUpdating}
										className='flex-1'
									>
										{isUpdating ? 'Saving...' : 'Save Changes'}
									</Button>
									<Button
										variant='outline'
										onClick={() => {
											setComment(review.comment || '');
											setIsEditing(false);
										}}
										disabled={isUpdating}
									>
										Cancel
									</Button>
								</>
							) : (
								<>
									<Button onClick={() => setIsEditing(true)} className='flex-1'>
										Edit Comment
									</Button>
									<Button variant='outline' onClick={() => onOpenChange(false)}>
										Close
									</Button>
								</>
							)}
						</div>
					</div>
				) : (
					<div className='flex items-center justify-center py-8 text-muted-foreground'>
						Review not found
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
