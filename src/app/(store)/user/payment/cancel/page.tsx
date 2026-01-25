'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/configs/routes';
import { PaymentStatus, Order } from '@/types';
import { useOrders } from '@/hooks';

enum PageStatus {
	LOADING = 'loading',
	CANCELLED = 'cancelled',
	PENDING = 'pending',
	ERROR = 'error',
}

function PaymentCancelPage() {
	const searchParams = useSearchParams();
	const [status, setStatus] = useState<PageStatus>(PageStatus.LOADING);
	const [errorMessage, setErrorMessage] = useState('');
	const [order, setOrder] = useState<Order | null>(null);

	// Extract query parameters
	const orderCode = searchParams.get('orderCode');
	const paymentCode = searchParams.get('code');
	const cancelFlag = searchParams.get('cancel');

	// Debug logging
	useEffect(() => {
		console.log('[Payment Cancel] Query params:', {
			orderCode,
			paymentCode,
			cancelFlag,
		});
	}, [orderCode, paymentCode, cancelFlag]);

	// Fetch all orders for the current user to find the matching one
	const { data: ordersData, isLoading, error } = useOrders();

	useEffect(() => {
		const verifyCancel = () => {
			// Validate orderCode
			if (!orderCode) {
				console.error('[Payment Cancel] Missing orderCode');
				setStatus(PageStatus.ERROR);
				setErrorMessage(
					'Thiếu thông tin đơn hàng. Vui lòng kiểm tra lại đơn hàng trong mục "Đơn hàng của tôi".',
				);
				return;
			}

			// Wait for orders data to load
			if (isLoading) {
				console.log('[Payment Cancel] Loading orders...');
				setStatus(PageStatus.LOADING);
				return;
			}

			// Handle error from React Query
			if (error) {
				console.error('[Payment Cancel] Error fetching orders:', error);
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
					'[Payment Cancel] Searching for order with payosOrderCode:',
					orderCode,
				);
				const matchingOrder = ordersData.data.find(
					o => o.payment?.payosOrderCode === orderCode,
				);

				if (!matchingOrder) {
					console.error(
						'[Payment Cancel] No order found with payosOrderCode:',
						orderCode,
					);
					setStatus(PageStatus.ERROR);
					setErrorMessage(
						'Không tìm thấy đơn hàng tương ứng. Vui lòng kiểm tra lại trong mục "Đơn hàng của tôi".',
					);
					return;
				}

				console.log('[Payment Cancel] Found order:', {
					orderId: matchingOrder.id,
					orderStatus: matchingOrder.status,
					paymentStatus: matchingOrder.payment?.status,
					paymentMethod: matchingOrder.payment?.method,
				});

				setOrder(matchingOrder);

				// Verify cancellation status
				//Check if payment was cancelled or is still pending
				if (matchingOrder.payment) {
					if (matchingOrder.payment.status === PaymentStatus.FAILED) {
						console.log('[Payment Cancel] Payment cancelled/failed');
						setStatus(PageStatus.CANCELLED);
					} else {
						console.log(
							'[Payment Cancel] Payment still in other status:',
							matchingOrder.payment.status,
						);
						setStatus(PageStatus.PENDING);
					}
				} else {
					console.log('[Payment Cancel] No payment info');
					setStatus(PageStatus.PENDING);
				}
			}
		};

		verifyCancel();
	}, [orderCode, isLoading, error, ordersData]);

	if (status === PageStatus.LOADING) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
				<div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full'>
					<div className='flex flex-col items-center gap-4'>
						<Loader2 className='w-12 h-12 text-orange-600 animate-spin' />
						<p className='text-gray-700 text-center'>
							Đang kiểm tra trạng thái đơn hàng...
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

	if (status === PageStatus.CANCELLED) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
				<div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full'>
					<div className='flex flex-col items-center gap-4'>
						<div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center'>
							<XCircle className='w-10 h-10 text-orange-600' />
						</div>
						<h1 className='text-2xl font-bold text-gray-900 text-center'>
							Thanh toán đã bị hủy
						</h1>
						{order && (
							<div className='w-full bg-orange-50 border border-orange-200 rounded-lg p-4'>
								<div className='space-y-2 text-sm'>
									<div className='flex justify-between'>
										<span className='text-orange-700'>Mã đơn hàng:</span>
										<span className='font-semibold text-orange-900'>
											#{order.id}
										</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-orange-700'>Tổng tiền:</span>
										<span className='font-semibold text-orange-900'>
											{new Intl.NumberFormat('vi-VN', {
												style: 'currency',
												currency: 'VND',
											}).format(Number(order.finalAmount))}
										</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-orange-700'>Trạng thái:</span>
										<span className='font-semibold text-orange-900'>
											Đã hủy thanh toán
										</span>
									</div>
								</div>
							</div>
						)}
						<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 w-full'>
							<div className='flex gap-3'>
								<AlertCircle className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
								<div className='text-sm text-blue-800'>
									<p className='font-semibold mb-1'>Lưu ý:</p>
									<ul className='list-disc list-inside space-y-1'>
										<li>Đơn hàng của bạn vẫn được lưu trong hệ thống</li>
										<li>
											Bạn có thể xem lại đơn hàng và thử thanh toán lại sau
										</li>
										<li>Hoặc liên hệ với chúng tôi để được hỗ trợ</li>
									</ul>
								</div>
							</div>
						</div>
						<div className='w-full space-y-3 pt-4'>
							<Link
								href={routes.user.orders}
								className='block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors text-center'
							>
								Xem đơn hàng
							</Link>
							<Link
								href={routes.user.cart}
								className='block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors text-center'
							>
								Xem giỏ hàng
							</Link>
							<Link
								href={routes.home}
								className='block w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-colors text-center'
							>
								Tiếp tục mua sắm
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Pending state - payment not yet cancelled in system
	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
			<div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full'>
				<div className='flex flex-col items-center gap-4'>
					<div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center'>
						<AlertCircle className='w-10 h-10 text-yellow-600' />
					</div>
					<h1 className='text-2xl font-bold text-gray-900 text-center'>
						Đơn hàng đang chờ xử lý
					</h1>
					{order && (
						<div className='w-full bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
							<div className='space-y-2 text-sm'>
								<div className='flex justify-between'>
									<span className='text-yellow-700'>Mã đơn hàng:</span>
									<span className='font-semibold text-yellow-900'>
										#{order.id}
									</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-yellow-700'>Tổng tiền:</span>
									<span className='font-semibold text-yellow-900'>
										{new Intl.NumberFormat('vi-VN', {
											style: 'currency',
											currency: 'VND',
										}).format(Number(order.finalAmount))}
									</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-yellow-700'>Trạng thái:</span>
									<span className='font-semibold text-yellow-900'>
										Đang chờ thanh toán
									</span>
								</div>
							</div>
						</div>
					)}
					<p className='text-gray-600 text-center'>
						Bạn đã thoát khỏi trang thanh toán, nhưng đơn hàng vẫn ở trạng thái
						chờ thanh toán. Bạn có thể quay lại thanh toán bất kỳ lúc nào.
					</p>
					<div className='w-full space-y-3 pt-4'>
						<Link
							href={routes.user.orders}
							className='block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors text-center'
						>
							Xem đơn hàng
						</Link>
						<Link
							href={routes.user.cart}
							className='block w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-lg transition-colors text-center'
						>
							Xem giỏ hàng
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

export default PaymentCancelPage;
