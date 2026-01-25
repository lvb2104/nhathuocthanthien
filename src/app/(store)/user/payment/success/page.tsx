'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/configs/routes';
import { PaymentStatus, OrderStatus, Order } from '@/types';
import { useUnifiedCart, useOrders } from '@/hooks';

enum PageStatus {
	LOADING = 'loading',
	SUCCESS = 'success',
	PENDING = 'pending',
	FAILED = 'failed',
	ERROR = 'error',
}

function PaymentSuccessPage() {
	const searchParams = useSearchParams();
	const [status, setStatus] = useState<PageStatus>(PageStatus.LOADING);
	const [errorMessage, setErrorMessage] = useState('');
	const [order, setOrder] = useState<Order | null>(null);
	const { clearCart, removePromotion } = useUnifiedCart();

	// Extract query parameters
	const orderCode = searchParams.get('orderCode');
	const paymentCode = searchParams.get('code');
	const paymentStatus = searchParams.get('status');

	// Debug logging
	useEffect(() => {
		console.log('[Payment Success] Query params:', {
			orderCode,
			paymentCode,
			paymentStatus,
		});
	}, [orderCode, paymentCode, paymentStatus]);

	// Fetch all orders for the current user to find the matching one
	const { data: ordersData, isLoading, error } = useOrders();

	useEffect(() => {
		const verifyPayment = async () => {
			// Validate orderCode
			if (!orderCode) {
				console.error('[Payment Success] Missing orderCode');
				setStatus(PageStatus.ERROR);
				setErrorMessage(
					'Thiếu thông tin đơn hàng. Vui lòng kiểm tra lại đơn hàng trong mục "Đơn hàng của tôi".',
				);
				return;
			}

			// Wait for orders data to load
			if (isLoading) {
				console.log('[Payment Success] Loading orders...');
				setStatus(PageStatus.LOADING);
				return;
			}

			// Handle error from React Query
			if (error) {
				console.error('[Payment Success] Error fetching orders:', error);
				const errorMsg =
					(error as any)?.response?.data?.message ||
					'Không thể tải thông tin đơn hàng';
				setStatus(PageStatus.ERROR);
				setErrorMessage(
					`${errorMsg}. Đơn hàng của bạn có thể đã được tạo thành công. Vui lòng kiểm tra trong mục "Đơn hàng của tôi".`,
				);
				return;
			}

			// Find the order matching the payosOrderCode
			if (ordersData?.data) {
				console.log(
					'[Payment Success] Searching for order with payosOrderCode:',
					orderCode,
				);
				const matchingOrder = ordersData.data.find(
					o => o.payment?.payosOrderCode === orderCode,
				);

				if (!matchingOrder) {
					console.error(
						'[Payment Success] No order found with payosOrderCode:',
						orderCode,
					);
					setStatus(PageStatus.ERROR);
					setErrorMessage(
						'Không tìm thấy đơn hàng tương ứng. Vui lòng kiểm tra lại trong mục "Đơn hàng của tôi".',
					);
					return;
				}

				console.log('[Payment Success] Found order:', {
					orderId: matchingOrder.id,
					orderStatus: matchingOrder.status,
					paymentStatus: matchingOrder.payment?.status,
					paymentMethod: matchingOrder.payment?.method,
				});

				setOrder(matchingOrder);

				// Verify payment status
				if (matchingOrder.payment) {
					if (matchingOrder.payment.status === PaymentStatus.PAID) {
						console.log('[Payment Success] Payment successful, clearing cart');
						setStatus(PageStatus.SUCCESS);
						// Clear cart after successful PayOS payment
						await clearCart();
						removePromotion();
					} else if (matchingOrder.payment.status === PaymentStatus.PENDING) {
						console.log('[Payment Success] Payment still pending');
						setStatus(PageStatus.PENDING);
					} else {
						console.log('[Payment Success] Payment failed');
						setStatus(PageStatus.FAILED);
					}
				} else {
					// Cash payment - check order status
					if (matchingOrder.status === OrderStatus.CONFIRMED) {
						console.log('[Payment Success] Cash order confirmed');
						setStatus(PageStatus.SUCCESS);
						// Cart already cleared for cash payments
					} else {
						console.log('[Payment Success] Cash order pending');
						setStatus(PageStatus.PENDING);
					}
				}
			} else {
				console.warn('[Payment Success] No order data available yet');
			}
		};

		verifyPayment();
	}, [orderCode, isLoading, error, ordersData, clearCart, removePromotion]);

	if (status === PageStatus.LOADING) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
				<div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full'>
					<div className='flex flex-col items-center gap-4'>
						<Loader2 className='w-12 h-12 text-green-600 animate-spin' />
						<p className='text-gray-700 text-center'>
							Đang xác minh thanh toán...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (status === PageStatus.ERROR) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
				<div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full'>
					<div className='flex flex-col items-center gap-4'>
						<XCircle className='w-16 h-16 text-red-500' />
						<h1 className='text-2xl font-bold text-gray-900 text-center'>
							Có lỗi xảy ra
						</h1>
						<p className='text-gray-600 text-center'>{errorMessage}</p>
						<Link
							href={routes.home}
							className='mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors text-center'
						>
							Về trang chủ
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (status === PageStatus.SUCCESS) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
				<div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full'>
					<div className='flex flex-col items-center gap-4'>
						<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
							<CheckCircle className='w-10 h-10 text-green-600' />
						</div>
						<h1 className='text-2xl font-bold text-gray-900 text-center'>
							Thanh toán thành công! 🎉
						</h1>
						{order && (
							<div className='w-full bg-green-50 border border-green-200 rounded-lg p-4'>
								<div className='space-y-2 text-sm'>
									<div className='flex justify-between'>
										<span className='text-green-700'>Mã đơn hàng:</span>
										<span className='font-semibold text-green-900'>
											#{order.id}
										</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-green-700'>Tổng tiền:</span>
										<span className='font-semibold text-green-900'>
											{new Intl.NumberFormat('vi-VN', {
												style: 'currency',
												currency: 'VND',
											}).format(Number(order.finalAmount))}
										</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-green-700'>Trạng thái:</span>
										<span className='font-semibold text-green-900'>
											{order.payment?.status === PaymentStatus.PAID
												? 'Đã thanh toán'
												: 'Đã xác nhận'}
										</span>
									</div>
								</div>
							</div>
						)}
						<p className='text-gray-600 text-center'>
							Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đang được xử lý.
						</p>
						<div className='w-full space-y-3 pt-4'>
							<Link
								href={routes.user.orders}
								className='block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors text-center'
							>
								Xem đơn hàng
							</Link>
							<Link
								href={routes.home}
								className='block w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-lg transition-colors text-center'
							>
								Tiếp tục mua sắm
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Pending or failed states
	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
			<div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full'>
				<div className='flex flex-col items-center gap-4'>
					<div
						className={`w-16 h-16 rounded-full flex items-center justify-center ${
							status === PageStatus.PENDING ? 'bg-yellow-100' : 'bg-red-100'
						}`}
					>
						<XCircle
							className={`w-10 h-10 ${
								status === PageStatus.PENDING
									? 'text-yellow-600'
									: 'text-red-600'
							}`}
						/>
					</div>
					<h1 className='text-2xl font-bold text-gray-900 text-center'>
						{status === PageStatus.PENDING
							? 'Thanh toán đang chờ xác nhận'
							: 'Thanh toán thất bại'}
					</h1>
					{order && (
						<div
							className={`w-full border rounded-lg p-4 ${
								status === PageStatus.PENDING
									? 'bg-yellow-50 border-yellow-200'
									: 'bg-red-50 border-red-200'
							}`}
						>
							<div className='space-y-2 text-sm'>
								<div className='flex justify-between'>
									<span
										className={
											status === PageStatus.PENDING
												? 'text-yellow-700'
												: 'text-red-700'
										}
									>
										Mã đơn hàng:
									</span>
									<span
										className={`font-semibold ${
											status === PageStatus.PENDING
												? 'text-yellow-900'
												: 'text-red-900'
										}`}
									>
										#{order.id}
									</span>
								</div>
							</div>
						</div>
					)}
					<p className='text-gray-600 text-center'>
						{status === PageStatus.PENDING
							? 'Thanh toán của bạn đang được xác minh. Vui lòng kiểm tra lại sau ít phút.'
							: 'Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}
					</p>
					<div className='w-full space-y-3 pt-4'>
						<Link
							href={routes.user.orders}
							className='block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors text-center'
						>
							Xem đơn hàng
						</Link>
						<Link
							href={routes.home}
							className='block w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-colors text-center'
						>
							Về trang chủ
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PaymentSuccessPage;
