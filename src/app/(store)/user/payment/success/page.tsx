'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/configs/routes';
import { PaymentStatus, OrderStatus } from '@/types';
import { useUnifiedCart, useOrder } from '@/hooks';

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
	const { clearCart, removePromotion } = useUnifiedCart();

	// Extract query parameters
	const orderCode = searchParams.get('orderCode');

	// Extract orderId from orderCode
	const orderId = orderCode ? parseInt(orderCode.slice(13), 10) : 0;

	// Use React Query hook to fetch order
	const { data: order, isLoading, error } = useOrder(orderId);

	useEffect(() => {
		const verifyPayment = async () => {
			// Validate orderCode
			if (!orderCode) {
				setStatus(PageStatus.ERROR);
				setErrorMessage('Thiếu thông tin đơn hàng');
				return;
			}

			if (isNaN(orderId) || orderId <= 0) {
				setStatus(PageStatus.ERROR);
				setErrorMessage('Mã đơn hàng không hợp lệ');
				return;
			}

			// Wait for order data to load
			if (isLoading) {
				setStatus(PageStatus.LOADING);
				return;
			}

			// Handle error from React Query
			if (error) {
				setStatus(PageStatus.ERROR);
				setErrorMessage(
					(error as any)?.response?.data?.message ||
						'Không thể xác minh trạng thái thanh toán',
				);
				return;
			}

			// Verify payment status
			if (order) {
				// Check payment status
				if (order.payment) {
					if (order.payment.status === PaymentStatus.PAID) {
						setStatus(PageStatus.SUCCESS);
						// Clear cart after successful PayOS payment
						await clearCart();
						removePromotion();
					} else if (order.payment.status === PaymentStatus.PENDING) {
						setStatus(PageStatus.PENDING);
					} else {
						setStatus(PageStatus.FAILED);
					}
				} else {
					// Cash payment - check order status
					if (order.status === OrderStatus.CONFIRMED) {
						setStatus(PageStatus.SUCCESS);
						// Cart already cleared for cash payments
					} else {
						setStatus(PageStatus.PENDING);
					}
				}
			}
		};

		verifyPayment();
	}, [orderCode, orderId, isLoading, error, order, clearCart, removePromotion]);

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
