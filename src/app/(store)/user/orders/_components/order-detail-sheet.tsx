'use client';

import { useState } from 'react';
import { Order } from '@/types';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	getOrderStatusConfig,
	getPaymentStatusConfig,
	formatOrderDate,
	formatCurrency,
} from './order-utils';
import { Package, MapPin, CreditCard, X, Tag, Banknote } from 'lucide-react';
import { useCancelOrder, useProduct } from '@/hooks';
import { toast } from 'react-toastify';
import { OrderStatus, PaymentMethod } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { app } from '@/configs/app';

type OrderDetailSheetProps = {
	order: Order | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function OrderItemRow({
	productId,
	quantity,
	price,
}: {
	productId: number;
	quantity: number;
	price: string;
}) {
	const { data: product, isLoading } = useProduct(productId);

	return (
		<Link
			href={`/products/${product?.id}`}
			className='flex items-start gap-3 pb-3 last:pb-0 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors cursor-pointer'
		>
			<div className='relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200'>
				{isLoading ? (
					<div className='flex items-center justify-center h-full'>
						<Package size={24} className='text-gray-400 animate-pulse' />
					</div>
				) : (
					<Image
						src={product?.images?.[0]?.imageUrl || app.DEFAULT_IMAGE_URL}
						alt={product?.name || 'Product'}
						fill
						className='object-contain p-2'
					/>
				)}
			</div>
			<div className='flex-1 min-w-0'>
				<p className='text-sm font-medium text-gray-900 line-clamp-2 mb-0.5 hover:text-green-600 transition-colors'>
					{isLoading ? 'Đang tải...' : product?.name || 'Sản phẩm'}
				</p>
				<p className='text-xs text-gray-500'>Số lượng: {quantity}</p>
			</div>
			<div className='text-right flex-shrink-0'>
				<p className='text-sm font-semibold text-gray-900'>
					{formatCurrency(price)}
				</p>
			</div>
		</Link>
	);
}

export default function OrderDetailSheet({
	order,
	open,
	onOpenChange,
}: OrderDetailSheetProps) {
	const cancelOrderMutation = useCancelOrder();
	const [showCancelDialog, setShowCancelDialog] = useState(false);

	if (!order) return null;

	const statusConfig = getOrderStatusConfig(order.status);
	const paymentStatusConfig = order.payment
		? getPaymentStatusConfig(order.payment.status)
		: null;

	const handleCancelOrder = async () => {
		try {
			await toast.promise(cancelOrderMutation.mutateAsync(order.id), {
				pending: 'Đang hủy đơn hàng...',
				success: 'Đã hủy đơn hàng thành công! 🎉',
				error: {
					render({ data }: any) {
						return (
							data?.response?.data?.message ||
							'Không thể hủy đơn hàng. Vui lòng thử lại.'
						);
					},
				},
			});
			setShowCancelDialog(false);
			onOpenChange(false);
		} catch (error) {
			console.error('Cancel order error:', error);
		}
	};

	const canCancel = order.status === OrderStatus.PENDING;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='w-full overflow-y-auto sm:max-w-2xl p-6'>
				<SheetHeader className='mb-6'>
					<SheetTitle className='flex items-center gap-2'>
						<Package className='text-green-600' size={20} />
						<span className='text-base'>Đơn hàng #{order.id}</span>
					</SheetTitle>
				</SheetHeader>

				<div className='space-y-6'>
					{/* Status */}
					<div className='flex items-center gap-2 pb-5 border-b'>
						<Badge
							variant={statusConfig.variant}
							className={statusConfig.className}
						>
							{statusConfig.label}
						</Badge>
						<span className='text-xs text-gray-500'>
							{formatOrderDate(order.orderDate)}
						</span>
					</div>

					{/* Products */}
					<div className='pb-5 border-b'>
						<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
							<Package size={16} className='text-green-600' />
							Sản phẩm ({order.items.length})
						</h3>
						<div className='space-y-4'>
							{order.items.map(item => (
								<OrderItemRow
									key={item.id}
									productId={item.productId}
									quantity={item.quantity}
									price={item.price}
								/>
							))}
						</div>
					</div>

					{/* Shipping */}
					{order.shipping && (
						<div className='pb-5 border-b'>
							<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
								<MapPin size={16} className='text-green-600' />
								Thông tin giao hàng
							</h3>
							<div className='bg-gray-50 rounded-lg p-4 space-y-2.5 text-xs'>
								<div className='flex gap-2'>
									<span className='font-medium text-gray-600 w-28 flex-shrink-0'>
										Người nhận:
									</span>
									<span className='text-gray-900'>
										{order.shipping.fullName}
									</span>
								</div>
								<div className='flex gap-2'>
									<span className='font-medium text-gray-600 w-28 flex-shrink-0'>
										Số điện thoại:
									</span>
									<span className='text-gray-900'>{order.shipping.phone}</span>
								</div>
								<div className='flex gap-2'>
									<span className='font-medium text-gray-600 w-28 flex-shrink-0'>
										Địa chỉ:
									</span>
									<span className='text-gray-900'>
										{order.shipping.addressLine}, {order.shipping.ward},{' '}
										{order.shipping.district}, {order.shipping.province}
									</span>
								</div>
								{order.shipping.note && (
									<div className='flex gap-2'>
										<span className='font-medium text-gray-600 w-28 flex-shrink-0'>
											Ghi chú:
										</span>
										<span className='text-gray-900'>{order.shipping.note}</span>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Payment */}
					<div className='pb-5'>
						<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
							<CreditCard size={16} className='text-green-600' />
							Thông tin thanh toán
						</h3>
						<div className='bg-gray-50 rounded-lg p-4 space-y-4'>
							{/* Price Summary */}
							<div className='space-y-2.5 text-xs'>
								<div className='flex justify-between items-center'>
									<span className='text-gray-600'>Tạm tính</span>
									<span className='text-gray-900'>
										{formatCurrency(order.totalAmount)}
									</span>
								</div>
								{order.promotion && (
									<>
										<div className='flex justify-between items-center text-green-600'>
											<div className='flex items-center gap-1.5'>
												<Tag size={12} />
												<span className='font-medium'>
													{order.promotion.code}
												</span>
												<span className='text-gray-500'>
													(-{order.promotion.discountPercent}%)
												</span>
											</div>
										</div>
										<div className='flex justify-between items-center text-green-600'>
											<span>Giảm giá</span>
											<span>
												-{formatCurrency(order.discountAmount || '0')}
											</span>
										</div>
									</>
								)}
								<div className='flex justify-between items-center text-sm font-bold pt-2 border-t'>
									<span className='text-gray-900'>Tổng tiền</span>
									<span className='text-green-600'>
										{formatCurrency(order.finalAmount)}
									</span>
								</div>
							</div>

							{/* Payment Method & Status */}
							<div className='pt-3 border-t space-y-2.5 text-xs'>
								<div className='flex justify-between items-center'>
									<span className='text-gray-600'>Phương thức</span>
									<div className='flex items-center gap-1.5'>
										{order.payment?.method === PaymentMethod.PAYOS ? (
											<>
												<CreditCard size={14} className='text-gray-500' />
												<span className='text-gray-900'>PayOS</span>
											</>
										) : (
											<>
												<Banknote size={14} className='text-gray-500' />
												<span className='text-gray-900'>Tiền mặt</span>
											</>
										)}
									</div>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-gray-600'>Trạng thái</span>
									{paymentStatusConfig ? (
										<Badge
											variant={paymentStatusConfig.variant}
											className={`${paymentStatusConfig.className} text-xs py-0.5 px-2`}
										>
											{paymentStatusConfig.label}
										</Badge>
									) : (
										<Badge
											variant='outline'
											className='bg-yellow-50 text-yellow-700 border-yellow-300 text-xs py-0.5 px-2'
										>
											Chờ thanh toán
										</Badge>
									)}
								</div>
								{order.payment?.payosCheckoutUrl &&
									order.payment?.status === 'pending' && (
										<a
											href={order.payment.payosCheckoutUrl}
											target='_blank'
											rel='noopener noreferrer'
											className='block mt-2'
										>
											<Button
												size='sm'
												className='w-full bg-green-600 hover:bg-green-700 h-9 text-xs'
											>
												Thanh toán ngay
											</Button>
										</a>
									)}
							</div>
						</div>
					</div>

					{/* Cancel */}
					{canCancel && (
						<div className='pt-3 border-t'>
							<Button
								onClick={() => setShowCancelDialog(true)}
								variant='destructive'
								className='w-full h-10 text-sm gap-2'
							>
								<X size={16} />
								Hủy đơn hàng
							</Button>
						</div>
					)}
				</div>
			</SheetContent>

			{/* Cancel Confirmation Dialog */}
			<AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể
							hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Không</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleCancelOrder}
							disabled={cancelOrderMutation.isPending}
							className='bg-red-600 hover:bg-red-700'
						>
							{cancelOrderMutation.isPending ? 'Đang hủy...' : 'Hủy đơn hàng'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Sheet>
	);
}
