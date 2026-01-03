'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks';
import { GetAllOrdersResponse, OrderStatus, Order } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
	getOrderStatusConfig,
	formatOrderDate,
	formatCurrency,
} from './order-utils';
import { Package, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/configs/routes';
import OrderDetailSheet from './order-detail-sheet';

type OrdersListProps = {
	initialData?: GetAllOrdersResponse;
};

const STATUS_FILTERS = [
	{ value: null, label: 'Tất cả' },
	{ value: OrderStatus.PENDING, label: 'Chờ xác nhận' },
	{ value: OrderStatus.CONFIRMED, label: 'Đã xác nhận' },
	{ value: OrderStatus.SHIPPED, label: 'Đang giao' },
	{ value: OrderStatus.DELIVERED, label: 'Hoàn thành' },
	{ value: OrderStatus.CANCELLED, label: 'Đã hủy' },
] as const;

export default function OrdersList({ initialData }: OrdersListProps) {
	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
		null,
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	// Fetch orders with filters and pagination
	const { data, isLoading, error } = useOrders(
		{
			status: selectedStatus || undefined,
			page: currentPage,
			limit: 10,
		},
		initialData, // Used as placeholderData - will still refetch on filter changes
	);

	const orders = data?.data || [];
	const pagination = data?.pagination;

	const handleStatusFilter = (status: OrderStatus | null) => {
		setSelectedStatus(status);
		setCurrentPage(1); // Reset to first page when filtering
	};

	const handleNextPage = () => {
		if (pagination && currentPage < pagination.totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	if (error) {
		return (
			<div className='min-h-screen flex items-center justify-center p-4'>
				<div className='w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8'>
					<p className='text-red-500 text-lg text-center'>
						Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4'>
			<div className='w-full max-w-6xl mx-auto'>
				{/* Header */}
				<div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-6'>
					<div className='flex items-center justify-between mb-6'>
						<div className='flex items-center gap-3'>
							<Package className='text-green-600' size={32} />
							<div>
								<h1 className='text-2xl font-bold text-gray-900'>
									Đơn hàng của bạn
								</h1>
								{pagination && (
									<p className='text-sm text-gray-600 mt-1'>
										{pagination.totalItems} đơn hàng
									</p>
								)}
							</div>
						</div>
						<Link href={routes.home}>
							<Button variant='outline' className='gap-2'>
								<ShoppingBag size={18} />
								<span className='hidden sm:inline'>Tiếp tục mua sắm</span>
							</Button>
						</Link>
					</div>

					{/* Status Filter Tabs */}
					<div className='flex flex-wrap gap-2'>
						{STATUS_FILTERS.map(filter => {
							const isActive = selectedStatus === filter.value;
							return (
								<button
									key={filter.label}
									onClick={() => handleStatusFilter(filter.value)}
									className={`px-4 py-2 rounded-lg font-medium transition-colors ${
										isActive
											? 'bg-green-600 text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									{filter.label}
								</button>
							);
						})}
					</div>
				</div>

				{/* Orders List */}
				<div className='space-y-4'>
					{isLoading ? (
						// Loading skeleton
						Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className='bg-white rounded-xl shadow border border-gray-200 p-6'
							>
								<Skeleton className='h-6 w-32 mb-4' />
								<Skeleton className='h-20 w-full' />
							</div>
						))
					) : orders.length === 0 ? (
						// Empty state
						<div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center'>
							<Package className='mx-auto text-gray-400 mb-4' size={64} />
							<p className='text-gray-500 text-lg mb-2'>
								{selectedStatus
									? 'Không tìm thấy đơn hàng nào'
									: 'Bạn chưa có đơn hàng nào'}
							</p>
							<p className='text-gray-400 text-sm mb-6'>
								{selectedStatus
									? 'Thử thay đổi bộ lọc để xem đơn hàng khác'
									: 'Hãy bắt đầu mua sắm ngay!'}
							</p>
							<Link href={routes.home}>
								<Button className='bg-green-600 hover:bg-green-700'>
									Khám phá sản phẩm
								</Button>
							</Link>
						</div>
					) : (
						// Order cards
						orders.map(order => {
							const statusConfig = getOrderStatusConfig(order.status);
							const firstProduct = order.items[0]?.product;

							return (
								<div
									key={order.id}
									onClick={() => {
										setSelectedOrder(order);
										setIsDetailOpen(true);
									}}
									className='bg-white rounded-xl shadow hover:shadow-md transition-shadow border border-gray-200 p-6 cursor-pointer'
								>
									<div className='flex items-start justify-between mb-4'>
										<div className='flex-1'>
											<div className='flex items-center gap-3 mb-2'>
												<h3 className='font-semibold text-gray-900'>
													Đơn hàng #{order.id}
												</h3>
												<Badge
													variant={statusConfig.variant}
													className={statusConfig.className}
												>
													{statusConfig.label}
												</Badge>
											</div>
											<p className='text-sm text-gray-600'>
												{formatOrderDate(order.orderDate)}
											</p>
										</div>
									</div>

									<div className='flex items-center gap-4 mb-4 pb-4 border-b border-gray-200'>
										{/* Product placeholder - will fetch details when viewing order */}
										<div className='relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center'>
											<Package size={32} className='text-gray-400' />
										</div>

										<div className='flex-1 min-w-0'>
											<p className='text-sm font-medium text-gray-900 truncate'>
												{firstProduct?.name || 'Sản phẩm'}
											</p>
											<p className='text-sm text-gray-600'>
												{order.items.length > 1
													? `và ${order.items.length - 1} sản phẩm khác`
													: `${order.items[0]?.quantity || 0} sản phẩm`}
											</p>
										</div>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<p className='text-sm text-gray-600 mb-1'>Tổng tiền</p>
											<p className='text-xl font-bold text-green-600'>
												{formatCurrency(order.finalAmount)}
											</p>
										</div>
										<Button
											variant='outline'
											className='gap-2'
											onClick={e => {
												e.stopPropagation();
												setSelectedOrder(order);
												setIsDetailOpen(true);
											}}
										>
											Xem chi tiết
											<ChevronRight size={16} />
										</Button>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Pagination */}
				{pagination && pagination.totalPages > 1 && (
					<div className='bg-white rounded-xl shadow border border-gray-200 p-4 mt-6'>
						<div className='flex items-center justify-between'>
							<p className='text-sm text-gray-600'>
								Trang {pagination.page} / {pagination.totalPages}
							</p>
							<div className='flex gap-2'>
								<Button
									variant='outline'
									size='sm'
									onClick={handlePrevPage}
									disabled={currentPage === 1}
									className='gap-2'
								>
									<ChevronLeft size={16} />
									Trước
								</Button>
								<Button
									variant='outline'
									size='sm'
									onClick={handleNextPage}
									disabled={currentPage >= pagination.totalPages}
									className='gap-2'
								>
									Sau
									<ChevronRight size={16} />
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Order Detail Sheet */}
			<OrderDetailSheet
				order={selectedOrder}
				open={isDetailOpen}
				onOpenChange={setIsDetailOpen}
			/>
		</div>
	);
}
