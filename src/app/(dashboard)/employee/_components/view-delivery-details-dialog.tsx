'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Delivery, DeliveryStatus } from '@/types';
import {
	PackageIcon,
	MapPinIcon,
	PhoneIcon,
	UserIcon,
	StickyNoteIcon,
} from 'lucide-react';
import { useOrder } from '@/hooks';

type ViewDeliveryDetailsDialogProps = {
	delivery: Delivery | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function ViewDeliveryDetailsDialog({
	delivery,
	open,
	onOpenChange,
}: ViewDeliveryDetailsDialogProps) {
	const { data: orderDetails } = useOrder(delivery?.orderId || 0);

	if (!delivery) return null;

	const getDeliveryStatusBadgeVariant = (status: DeliveryStatus) => {
		switch (status) {
			case DeliveryStatus.ASSIGNED:
				return 'secondary';
			case DeliveryStatus.SHIPPING:
				return 'default';
			case DeliveryStatus.DELIVERED:
				return 'default';
			case DeliveryStatus.CANCELLED:
				return 'destructive';
			default:
				return 'secondary';
		}
	};

	const getDeliveryStatusLabel = (status: DeliveryStatus) => {
		switch (status) {
			case DeliveryStatus.ASSIGNED:
				return 'Đã phân công';
			case DeliveryStatus.SHIPPING:
				return 'Đang giao hàng';
			case DeliveryStatus.DELIVERED:
				return 'Đã giao hàng';
			case DeliveryStatus.CANCELLED:
				return 'Đã hủy';
			default:
				return status;
		}
	};

	const shipping = delivery.order?.shipping;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Chi tiết vận đơn #{delivery.id}</DialogTitle>
					<DialogDescription>
						Thông tin chi tiết về đơn giao hàng
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-6'>
					{/* Status */}
					<div>
						<h3 className='text-sm font-medium mb-2'>Trạng thái</h3>
						<Badge
							variant={getDeliveryStatusBadgeVariant(delivery.status)}
							className='capitalize'
						>
							{getDeliveryStatusLabel(delivery.status)}
						</Badge>
					</div>

					{/* Order Info */}
					<div>
						<h3 className='text-sm font-medium mb-2 flex items-center gap-2'>
							<PackageIcon className='h-4 w-4' />
							Thông tin đơn hàng
						</h3>
						<div className='bg-muted rounded-lg p-4 space-y-2'>
							<div className='flex justify-between'>
								<span className='text-sm text-muted-foreground'>
									Mã đơn hàng:
								</span>
								<span className='text-sm font-medium'>#{delivery.orderId}</span>
							</div>
							{orderDetails?.orderDate && (
								<div className='flex justify-between'>
									<span className='text-sm text-muted-foreground'>
										Ngày đặt hàng:
									</span>
									<span className='text-sm font-medium'>
										{new Date(orderDetails.orderDate).toLocaleDateString(
											'vi-VN',
											{
												year: 'numeric',
												month: '2-digit',
												day: '2-digit',
												hour: '2-digit',
												minute: '2-digit',
											},
										)}
									</span>
								</div>
							)}
							{orderDetails?.totalAmount && (
								<div className='flex justify-between'>
									<span className='text-sm text-muted-foreground'>
										Tổng tiền hàng:
									</span>
									<span className='text-sm font-medium'>
										{parseFloat(orderDetails.totalAmount).toLocaleString(
											'vi-VN',
										)}{' '}
										₫
									</span>
								</div>
							)}
							{orderDetails?.discountAmount &&
								parseFloat(orderDetails.discountAmount) > 0 && (
									<div className='flex justify-between'>
										<span className='text-sm text-muted-foreground'>
											Giảm giá:
										</span>
										<span className='text-sm font-medium text-green-600'>
											-
											{parseFloat(orderDetails.discountAmount).toLocaleString(
												'vi-VN',
											)}{' '}
											₫
										</span>
									</div>
								)}
							<div className='flex justify-between pt-2 border-t'>
								<span className='text-sm font-semibold'>Tổng thanh toán:</span>
								<span className='text-sm font-semibold text-primary'>
									{delivery.order?.finalAmount
										? `${parseFloat(delivery.order.finalAmount).toLocaleString('vi-VN')} ₫`
										: 'N/A'}
								</span>
							</div>
						</div>
					</div>

					{/* Products List */}
					{orderDetails?.items && orderDetails.items.length > 0 && (
						<div>
							<h3 className='text-sm font-medium mb-2'>
								Danh sách sản phẩm ({orderDetails.items.length})
							</h3>
							<div className='bg-muted rounded-lg p-4 space-y-3'>
								{orderDetails.items.map((item, index) => (
									<div
										key={item.id || index}
										className='flex justify-between items-start pb-3 border-b last:border-b-0 last:pb-0'
									>
										<div className='flex-1'>
											<div className='text-sm font-medium'>
												{item.product?.name || `Sản phẩm #${item.productId}`}
											</div>
											{item.product?.manufacturer && (
												<div className='text-xs text-muted-foreground'>
													NSX: {item.product.manufacturer}
												</div>
											)}
											<div className='text-xs text-muted-foreground mt-1'>
												Số lượng: {item.quantity} ×{' '}
												{parseFloat(item.price).toLocaleString('vi-VN')} ₫
											</div>
										</div>
										<div className='text-sm font-medium whitespace-nowrap ml-4'>
											{(item.quantity * parseFloat(item.price)).toLocaleString(
												'vi-VN',
											)}{' '}
											₫
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Shipping Address */}
					{shipping ? (
						<div>
							<h3 className='text-sm font-medium mb-2 flex items-center gap-2'>
								<MapPinIcon className='h-4 w-4' />
								Địa chỉ giao hàng
							</h3>
							<div className='bg-muted rounded-lg p-4 space-y-3'>
								<div className='flex items-start gap-2'>
									<UserIcon className='h-4 w-4 mt-0.5 text-muted-foreground' />
									<div>
										<div className='text-sm font-medium'>
											{shipping.fullName}
										</div>
									</div>
								</div>
								<div className='flex items-start gap-2'>
									<PhoneIcon className='h-4 w-4 mt-0.5 text-muted-foreground' />
									<div className='text-sm'>{shipping.phone}</div>
								</div>
								<div className='flex items-start gap-2'>
									<MapPinIcon className='h-4 w-4 mt-0.5 text-muted-foreground' />
									<div className='text-sm'>
										{[
											shipping.addressLine,
											shipping.ward,
											shipping.district,
											shipping.province,
										]
											.filter(Boolean)
											.join(', ')}
									</div>
								</div>
								{shipping.note && (
									<div className='flex items-start gap-2'>
										<StickyNoteIcon className='h-4 w-4 mt-0.5 text-muted-foreground' />
										<div className='text-sm italic text-muted-foreground'>
											Ghi chú: {shipping.note}
										</div>
									</div>
								)}
							</div>
						</div>
					) : (
						<div>
							<h3 className='text-sm font-medium mb-2 flex items-center gap-2'>
								<MapPinIcon className='h-4 w-4' />
								Địa chỉ giao hàng
							</h3>
							<div className='bg-muted rounded-lg p-4'>
								<p className='text-sm text-muted-foreground'>
									Chưa có thông tin địa chỉ giao hàng
								</p>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
