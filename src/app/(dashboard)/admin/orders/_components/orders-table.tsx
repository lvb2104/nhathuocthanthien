'use client';

import * as React from 'react';
import {
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconDotsVertical,
	IconLayoutColumns,
} from '@tabler/icons-react';
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { toast } from 'react-toastify';
import {
	GetAllOrdersResponse,
	Order,
	OrderFilterParams,
	OrderStatus,
	PaymentStatus,
	DeliveryStatus,
} from '@/types';
import { useEffect } from 'react';
import { useOrders, useDeliveries } from '@/hooks';
import { RefreshCcw, Search, X, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { OrderDetailWrapper } from './order-detail-wrapper';
import { UpdateStatusDialog } from './update-status-dialog';
import { AssignDeliveryDialog } from './assign-delivery-dialog';

// Main DataTable component
export function OrdersTable({
	initialOrders,
}: {
	initialOrders?: GetAllOrdersResponse;
}) {
	// API Filter params state
	const [apiParams, setApiParams] = React.useState<OrderFilterParams>({
		page: 1,
		limit: 10,
		keyword: '',
		status: undefined as OrderStatus | undefined,
		paymentStatus: undefined as PaymentStatus | undefined,
		fromDate: undefined as string | undefined,
		toDate: undefined as string | undefined,
	});

	// Local filter inputs (for debouncing)
	const [searchInput, setSearchInput] = React.useState('');
	const [fromDateInput, setFromDateInput] = React.useState('');
	const [toDateInput, setToDateInput] = React.useState('');

	const [data, setData] = React.useState<Order[]>([]);
	const {
		data: response,
		isError: isOrdersError,
		refetch: refreshOrders,
		isPending: isOrdersPending,
	} = useOrders(apiParams, initialOrders);

	// Fetch deliveries to show delivery status in orders
	const { data: deliveriesResponse } = useDeliveries({ limit: 1000 }); // Get all deliveries

	// Update status dialog state
	const [isUpdateStatusOpen, setIsUpdateStatusOpen] = React.useState(false);
	const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

	// View details sheet state
	const [isDetailOpen, setIsDetailOpen] = React.useState(false);
	const [detailOrderId, setDetailOrderId] = React.useState<number | null>(null);

	const handleViewDetails = (order: Order) => {
		setDetailOrderId(order.id);
		setIsDetailOpen(true);
	};

	const handleUpdateStatus = (order: Order) => {
		setSelectedOrder(order);
		setIsUpdateStatusOpen(true);
	};

	// Assign delivery dialog state
	const [isAssignDeliveryOpen, setIsAssignDeliveryOpen] = React.useState(false);
	const [assignDeliveryOrderId, setAssignDeliveryOrderId] = React.useState<
		number | null
	>(null);

	const handleAssignDelivery = (order: Order) => {
		setAssignDeliveryOrderId(order.id);
		setIsAssignDeliveryOpen(true);
	};

	// Debounced search
	useEffect(() => {
		const timeout = setTimeout(() => {
			setApiParams(prev => ({ ...prev, keyword: searchInput, page: 1 }));
		}, 500);
		return () => clearTimeout(timeout);
	}, [searchInput]);

	// Debounced date filters
	useEffect(() => {
		const timeout = setTimeout(() => {
			setApiParams(prev => ({
				...prev,
				fromDate: fromDateInput || undefined,
				toDate: toDateInput || undefined,
				page: 1,
			}));
		}, 500);
		return () => clearTimeout(timeout);
	}, [fromDateInput, toDateInput]);

	useEffect(() => {
		if (isOrdersError) {
			toast.error('Lỗi khi tải đơn hàng');
		}
	}, [isOrdersError]);

	useEffect(() => {
		if (response?.data) {
			// Merge deliveries with orders
			const deliveriesMap = new Map();
			deliveriesResponse?.data?.forEach(delivery => {
				deliveriesMap.set(delivery.orderId, delivery);
			});

			const ordersWithDeliveries = response.data.map(order => ({
				...order,
				delivery: deliveriesMap.get(order.id),
			}));

			setData(ordersWithDeliveries as any);
		}
	}, [response, deliveriesResponse]);

	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const clearFilters = () => {
		setSearchInput('');
		setFromDateInput('');
		setToDateInput('');
		setApiParams({
			page: 1,
			limit: 10,
			keyword: '',
			status: undefined,
			paymentStatus: undefined,
			fromDate: undefined,
			toDate: undefined,
		});
	};

	// Format date for display
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// Format currency
	const formatCurrency = (amount: string) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(Number(amount));
	};

	// Get status label in Vietnamese
	const getStatusLabel = (status: OrderStatus) => {
		switch (status) {
			case OrderStatus.PENDING:
				return 'Chờ xử lý';
			case OrderStatus.CONFIRMED:
				return 'Đã xác nhận';
			case OrderStatus.SHIPPED:
				return 'Đang giao';
			case OrderStatus.DELIVERED:
				return 'Đã giao';
			case OrderStatus.CANCELLED:
				return 'Đã hủy';
			default:
				return status;
		}
	};

	// Get payment status label in Vietnamese
	const getPaymentStatusLabel = (status: PaymentStatus) => {
		switch (status) {
			case PaymentStatus.PENDING:
				return 'Chờ thanh toán';
			case PaymentStatus.PAID:
				return 'Đã thanh toán';
			case PaymentStatus.FAILED:
				return 'Thất bại';
			case PaymentStatus.REFUNDED:
				return 'Đã hoàn tiền';
			default:
				return status;
		}
	};

	// Get delivery status label in Vietnamese
	const getDeliveryStatusLabel = (status: DeliveryStatus) => {
		switch (status) {
			case DeliveryStatus.ASSIGNED:
				return 'Đã gán';
			case DeliveryStatus.SHIPPING:
				return 'Đang giao';
			case DeliveryStatus.DELIVERED:
				return 'Đã giao';
			case DeliveryStatus.CANCELLED:
				return 'Đã hủy';
			default:
				return status;
		}
	};

	// Get status badge variant
	const getStatusBadgeVariant = (status: OrderStatus) => {
		switch (status) {
			case OrderStatus.PENDING:
				return 'secondary';
			case OrderStatus.CONFIRMED:
				return 'default';
			case OrderStatus.SHIPPED:
				return 'default';
			case OrderStatus.DELIVERED:
				return 'default';
			case OrderStatus.CANCELLED:
				return 'destructive';
			default:
				return 'secondary';
		}
	};

	// Get payment status badge variant
	const getPaymentBadgeVariant = (status: PaymentStatus) => {
		switch (status) {
			case PaymentStatus.PENDING:
				return 'secondary';
			case PaymentStatus.PAID:
				return 'default';
			case PaymentStatus.FAILED:
				return 'destructive';
			case PaymentStatus.REFUNDED:
				return 'secondary';
			default:
				return 'secondary';
		}
	};

	// Define the columns for the table
	const columns: ColumnDef<Order>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<div className='flex items-center justify-center'>
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && 'indeterminate')
						}
						onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
						aria-label='Select all'
					/>
				</div>
			),
			cell: ({ row }) => (
				<div className='flex items-center justify-center'>
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={value => row.toggleSelected(!!value)}
						aria-label='Select row'
					/>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'id',
			header: 'Mã đơn',
			cell: ({ row }) => {
				return <div className='font-medium'>#{row.getValue('id')}</div>;
			},
			enableHiding: false,
		},
		{
			accessorKey: 'user.fullName',
			header: 'Khách hàng',
			cell: ({ row }) => {
				const user = row.original.user;
				return (
					<div className='max-w-[200px]'>
						<div className='font-medium truncate'>
							{user?.fullName || 'N/A'}
						</div>
						<div className='text-xs text-muted-foreground truncate'>
							{user?.email || ''}
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'orderDate',
			header: 'Ngày đặt',
			cell: ({ row }) => {
				const date = row.getValue('orderDate') as string;
				return <div className='text-sm'>{formatDate(date)}</div>;
			},
		},
		{
			accessorKey: 'status',
			header: 'Trạng thái',
			cell: ({ row }) => {
				const status = row.getValue('status') as OrderStatus;
				return (
					<Badge variant={getStatusBadgeVariant(status)} className='w-fit'>
						{getStatusLabel(status)}
					</Badge>
				);
			},
		},
		{
			accessorKey: 'payment.status',
			header: 'Thanh toán',
			// Add filter function for payment status
			filterFn: (row, columnId, filterValue) => {
				const payment = row.original.payment;
				const status = payment?.status || PaymentStatus.PENDING;
				return status === filterValue;
			},
			cell: ({ row }) => {
				const payment = row.original.payment;
				const status = payment?.status || PaymentStatus.PENDING;
				return (
					<Badge variant={getPaymentBadgeVariant(status)} className='w-fit'>
						{getPaymentStatusLabel(status)}
					</Badge>
				);
			},
		},
		{
			accessorKey: 'finalAmount',
			header: 'Tổng cộng',
			cell: ({ row }) => {
				const amount = row.getValue('finalAmount') as string;
				return (
					<div className='text-right font-medium'>{formatCurrency(amount)}</div>
				);
			},
		},
		{
			id: 'delivery',
			header: 'Giao hàng',
			cell: ({ row }) => {
				const delivery = (row.original as any).delivery;
				if (!delivery) {
					return (
						<Badge variant='secondary' className='w-fit'>
							Chưa giao
						</Badge>
					);
				}
				return (
					<div className='flex flex-col gap-1'>
						<Badge
							variant={
								delivery.status === DeliveryStatus.DELIVERED
									? 'default'
									: delivery.status === DeliveryStatus.CANCELLED
										? 'destructive'
										: 'secondary'
							}
							className='w-fit'
						>
							{getDeliveryStatusLabel(delivery.status)}
						</Badge>
						{delivery.employee && (
							<div className='text-xs text-muted-foreground'>
								{delivery.employee.fullName}
							</div>
						)}
					</div>
				);
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
							size='icon'
						>
							<IconDotsVertical />
							<span className='sr-only'>Mở menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-40'>
						<DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
							<Eye className='mr-2 size-4' />
							Xem chi tiết
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleUpdateStatus(row.original)}>
							Cập nhật trạng thái
						</DropdownMenuItem>
						{row.original.status === OrderStatus.CONFIRMED &&
							!(row.original as any).delivery && (
								<DropdownMenuItem
									onClick={() => handleAssignDelivery(row.original)}
								>
									Gán giao hàng
								</DropdownMenuItem>
							)}
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		getRowId: row => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		manualPagination: true, // Server-side pagination
		pageCount: response?.pagination?.totalPages ?? 0,
	});

	if (isOrdersPending) {
		return (
			<div className='flex h-48 w-full items-center justify-center'>
				Đang tải đơn hàng...
			</div>
		);
	}

	return (
		<div className='w-full flex-col justify-start gap-6 flex'>
			{/* Filter Bar */}
			<div className='space-y-4 px-4 lg:px-6'>
				{/* Search - Full width */}
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Tìm kiếm đơn hàng...'
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
						className='pl-9'
					/>
				</div>

				{/* Filters - All in one row */}
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
					{/* Status Filter */}
					<Select
						value={apiParams.status || 'all'}
						onValueChange={value => {
							setApiParams(prev => ({
								...prev,
								status: value === 'all' ? undefined : (value as OrderStatus),
								page: 1,
							}));
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder='Tất cả trạng thái' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Tất cả trạng thái</SelectItem>
							<SelectItem value={OrderStatus.PENDING}>Chờ xử lý</SelectItem>
							<SelectItem value={OrderStatus.CONFIRMED}>Đã xác nhận</SelectItem>
							<SelectItem value={OrderStatus.SHIPPED}>Đang giao</SelectItem>
							<SelectItem value={OrderStatus.DELIVERED}>Đã giao</SelectItem>
							<SelectItem value={OrderStatus.CANCELLED}>Đã hủy</SelectItem>
						</SelectContent>
					</Select>

					{/* Payment Status Filter */}
					<Select
						value={apiParams.paymentStatus || 'all'}
						onValueChange={value => {
							setApiParams(prev => ({
								...prev,
								paymentStatus:
									value === 'all' ? undefined : (value as PaymentStatus),
								page: 1,
							}));
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder='Tất cả thanh toán' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Tất cả thanh toán</SelectItem>
							<SelectItem value={PaymentStatus.PENDING}>
								Chờ thanh toán
							</SelectItem>
							<SelectItem value={PaymentStatus.PAID}>Đã thanh toán</SelectItem>
							<SelectItem value={PaymentStatus.FAILED}>Thất bại</SelectItem>
							<SelectItem value={PaymentStatus.REFUNDED}>
								Đã hoàn tiền
							</SelectItem>
						</SelectContent>
					</Select>

					{/* Date Range - From */}
					<Input
						type='date'
						placeholder='Từ ngày'
						value={fromDateInput}
						onChange={e => setFromDateInput(e.target.value)}
					/>

					{/* Date Range - To */}
					<Input
						type='date'
						placeholder='Đến ngày'
						value={toDateInput}
						onChange={e => setToDateInput(e.target.value)}
					/>
				</div>
			</div>

			{/* Toolbar */}
			<div className='flex items-center justify-between px-4 lg:px-6'>
				<div className='flex items-center gap-2'></div>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='sm' onClick={clearFilters}>
						<X className='size-4' />
						<span className='hidden lg:inline'>Xóa bộ lọc</span>
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' size='sm'>
								<IconLayoutColumns />
								<span className='hidden lg:inline'>Tùy chỉnh cột</span>
								<span className='lg:hidden'>Cột</span>
								<IconChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-56'>
							{table
								.getAllColumns()
								.filter(
									column =>
										typeof column.accessorFn !== 'undefined' &&
										column.getCanHide(),
								)
								.map(column => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className='capitalize'
											checked={column.getIsVisible()}
											onCheckedChange={value =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						variant='outline'
						size='sm'
						className='cursor-pointer'
						onClick={() => {
							toast.promise(
								async () => {
									return await refreshOrders();
								},
								{
									pending: 'Đang làm mới...',
									success: 'Đã làm mới đơn hàng',
									error: 'Lỗi khi làm mới đơn hàng',
								},
							);
						}}
					>
						<RefreshCcw />
						<span className='hidden lg:inline'>Làm mới</span>
					</Button>
				</div>
			</div>

			<div className='overflow-hidden rounded-lg border px-4 lg:px-6'>
				<Table>
					<TableHeader className='bg-muted sticky top-0 z-10'>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									Không có kết quả.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className='flex items-center justify-between px-4 lg:px-6'>
				<div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{response?.pagination?.totalItems ?? 0} hàng đã chọn.
				</div>
				<div className='flex w-full items-center gap-8 lg:w-fit'>
					{/* Page size selector */}
					<div className='hidden items-center gap-2 lg:flex'>
						<Label htmlFor='rows-per-page' className='text-sm font-medium'>
							Hàng mỗi trang
						</Label>
						<Select
							value={`${apiParams.limit}`}
							onValueChange={value => {
								setApiParams(prev => ({
									...prev,
									limit: Number(value),
									page: 1,
								}));
							}}
						>
							<SelectTrigger size='sm' className='w-20' id='rows-per-page'>
								<SelectValue placeholder={apiParams.limit} />
							</SelectTrigger>
							<SelectContent side='top'>
								{[10, 20, 30, 40, 50].map(pageSize => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Page info */}
					<div className='flex w-fit items-center justify-center text-sm font-medium'>
						Page {response?.pagination?.page ?? 1} of{' '}
						{response?.pagination?.totalPages ?? 1} • Total:{' '}
						{response?.pagination?.totalItems ?? 0}
					</div>

					{/* Navigation buttons */}
					<div className='ml-auto flex items-center gap-2 lg:ml-0'>
						<Button
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => setApiParams(prev => ({ ...prev, page: 1 }))}
							disabled={apiParams.page === 1}
						>
							<span className='sr-only'>Go to first page</span>
							<IconChevronsLeft />
						</Button>
						<Button
							variant='outline'
							className='size-8'
							size='icon'
							onClick={() =>
								setApiParams(prev => ({
									...prev,
									page: Math.max(1, (prev.page ?? 1) - 1),
								}))
							}
							disabled={(apiParams.page ?? 1) === 1}
						>
							<span className='sr-only'>Go to previous page</span>
							<IconChevronLeft />
						</Button>
						<Button
							variant='outline'
							className='size-8'
							size='icon'
							onClick={() =>
								setApiParams(prev => ({ ...prev, page: (prev.page ?? 1) + 1 }))
							}
							disabled={
								(apiParams.page ?? 1) >= (response?.pagination?.totalPages ?? 1)
							}
						>
							<span className='sr-only'>Go to next page</span>
							<IconChevronRight />
						</Button>
						<Button
							variant='outline'
							className='hidden size-8 lg:flex'
							size='icon'
							onClick={() =>
								setApiParams(prev => ({
									...prev,
									page: response?.pagination?.totalPages ?? 1,
								}))
							}
							disabled={
								(apiParams.page ?? 1) >= (response?.pagination?.totalPages ?? 1)
							}
						>
							<span className='sr-only'>Go to last page</span>
							<IconChevronsRight />
						</Button>
					</div>
				</div>
			</div>

			{/* Update Status Dialog */}
			{selectedOrder && (
				<UpdateStatusDialog
					open={isUpdateStatusOpen}
					onOpenChange={setIsUpdateStatusOpen}
					orderId={selectedOrder.id}
					currentStatus={selectedOrder.status}
					onSuccess={() => {
						refreshOrders();
						setIsUpdateStatusOpen(false);
					}}
				/>
			)}

			{/* Order Detail Sheet */}
			{detailOrderId && (
				<OrderDetailWrapper
					orderId={detailOrderId}
					open={isDetailOpen}
					onOpenChange={setIsDetailOpen}
				/>
			)}

			{/* Assign Delivery Dialog */}
			{assignDeliveryOrderId && (
				<AssignDeliveryDialog
					orderId={assignDeliveryOrderId}
					open={isAssignDeliveryOpen}
					onOpenChange={setIsAssignDeliveryOpen}
					onSuccess={() => {
						refreshOrders();
						setIsAssignDeliveryOpen(false);
					}}
				/>
			)}
		</div>
	);
}
