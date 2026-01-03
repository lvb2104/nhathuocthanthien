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
	DropdownMenuSeparator,
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
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
import { useOrders, useCancelOrder, useDeliveries } from '@/hooks';
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
	const { mutateAsync: cancelMutate } = useCancelOrder();

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
			toast.error('Error loading orders');
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
	const [cancelPopoverOpen, setCancelPopoverOpen] = React.useState(false);

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
			header: 'Order ID',
			cell: ({ row }) => {
				return <div className='font-medium'>#{row.getValue('id')}</div>;
			},
			enableHiding: false,
		},
		{
			accessorKey: 'user.fullName',
			header: 'Customer',
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
			header: 'Order Date',
			cell: ({ row }) => {
				const date = row.getValue('orderDate') as string;
				return <div className='text-sm'>{formatDate(date)}</div>;
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const status = row.getValue('status') as OrderStatus;
				return (
					<Badge
						variant={getStatusBadgeVariant(status)}
						className='w-fit capitalize'
					>
						{status}
					</Badge>
				);
			},
		},
		{
			accessorKey: 'payment.status',
			header: 'Payment',
			cell: ({ row }) => {
				const payment = row.original.payment;
				const status = payment?.status || PaymentStatus.PENDING;
				return (
					<Badge
						variant={getPaymentBadgeVariant(status)}
						className='w-fit capitalize'
					>
						{status}
					</Badge>
				);
			},
		},
		{
			accessorKey: 'finalAmount',
			header: 'Total',
			cell: ({ row }) => {
				const amount = row.getValue('finalAmount') as string;
				return (
					<div className='text-right font-medium'>{formatCurrency(amount)}</div>
				);
			},
		},
		{
			id: 'delivery',
			header: 'Delivery',
			cell: ({ row }) => {
				const delivery = (row.original as any).delivery;
				if (!delivery) {
					return (
						<Badge variant='secondary' className='w-fit'>
							Not Assigned
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
							className='w-fit capitalize'
						>
							{delivery.status}
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
							<span className='sr-only'>Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-40'>
						<DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
							<Eye className='mr-2 size-4' />
							View Details
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleUpdateStatus(row.original)}>
							Update Status
						</DropdownMenuItem>
						{row.original.status === OrderStatus.CONFIRMED &&
							!(row.original as any).delivery && (
								<DropdownMenuItem
									onClick={() => handleAssignDelivery(row.original)}
								>
									Assign Delivery
								</DropdownMenuItem>
							)}
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant='destructive'
							onClick={() => handleCancel(row.original.id)}
							disabled={row.original.status === OrderStatus.CANCELLED}
						>
							Cancel Order
						</DropdownMenuItem>
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

	function handleCancel(id: number) {
		toast.promise(
			cancelMutate(id).then(() => {
				setData(prevData => prevData.filter(item => item.id !== id));
			}),
			{
				pending: 'Cancelling order...',
				success: 'Order cancelled successfully',
				error: 'Error cancelling order. Please try again.',
			},
		);
	}

	function handleCancelMultiple() {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		if (selectedRows.length === 0) return;

		const selectedIds = selectedRows.map(row => row.original.id);

		toast.promise(
			Promise.all(selectedIds.map(id => cancelMutate(id))).then(() => {
				setData(prevData =>
					prevData.filter(item => !selectedIds.includes(item.id)),
				);
				setRowSelection({});
				setCancelPopoverOpen(false);
			}),
			{
				pending: `Cancelling ${selectedIds.length} order(s)...`,
				success: `${selectedIds.length} order(s) cancelled successfully`,
				error: 'Error cancelling orders. Please try again.',
			},
		);
	}

	if (isOrdersPending) {
		return (
			<div className='flex h-48 w-full items-center justify-center'>
				Loading orders...
			</div>
		);
	}

	return (
		<div className='w-full flex-col justify-start gap-6 flex'>
			{/* Filter Bar */}
			<div className='space-y-4 px-4 lg:px-6'>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
					{/* Search */}
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							placeholder='Search orders...'
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
							className='pl-9'
						/>
					</div>

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
							<SelectValue placeholder='All Status' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Status</SelectItem>
							<SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
							<SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
							<SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
							<SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
							<SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
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
							<SelectValue placeholder='All Payment Status' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Payment Status</SelectItem>
							<SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
							<SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
							<SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
							<SelectItem value={PaymentStatus.REFUNDED}>Refunded</SelectItem>
						</SelectContent>
					</Select>

					{/* Date Range - From */}
					<Input
						type='date'
						placeholder='From date'
						value={fromDateInput}
						onChange={e => setFromDateInput(e.target.value)}
					/>
				</div>

				{/* Second row - To Date and clear button */}
				<div className='flex items-center gap-4'>
					<Input
						type='date'
						placeholder='To date'
						value={toDateInput}
						onChange={e => setToDateInput(e.target.value)}
						className='max-w-xs'
					/>

					<Button
						variant='outline'
						size='sm'
						onClick={clearFilters}
						className='ml-auto'
					>
						<X className='size-4' />
						Clear Filters
					</Button>
				</div>
			</div>

			{/* Toolbar */}
			<div className='flex items-center justify-between px-4 lg:px-6'>
				<div className='flex items-center gap-2'>
					{table.getFilteredSelectedRowModel().rows.length > 0 && (
						<>
							<Popover
								open={cancelPopoverOpen}
								onOpenChange={setCancelPopoverOpen}
							>
								<PopoverTrigger asChild>
									<Button
										variant='destructive'
										size='sm'
										className='cursor-pointer'
									>
										<span>
											Cancel ({table.getFilteredSelectedRowModel().rows.length})
										</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-80'>
									<div className='space-y-4'>
										<div className='space-y-2'>
											<h4 className='font-medium leading-none'>
												Cancel orders?
											</h4>
											<p className='text-sm text-muted-foreground'>
												You are about to cancel{' '}
												{table.getFilteredSelectedRowModel().rows.length}{' '}
												order(s). This action cannot be undone.
											</p>
											<div className='max-h-32 overflow-y-auto rounded-md bg-muted p-2 text-xs'>
												{table.getFilteredSelectedRowModel().rows.map(row => (
													<div key={row.original.id} className='truncate py-1'>
														• Order #{row.original.id}
													</div>
												))}
											</div>
										</div>
										<div className='flex gap-2 justify-end'>
											<Button
												variant='outline'
												size='sm'
												onClick={() => setCancelPopoverOpen(false)}
											>
												Cancel
											</Button>
											<Button
												variant='destructive'
												size='sm'
												onClick={handleCancelMultiple}
											>
												Confirm
											</Button>
										</div>
									</div>
								</PopoverContent>
							</Popover>
						</>
					)}
				</div>
				<div className='flex items-center gap-2'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' size='sm'>
								<IconLayoutColumns />
								<span className='hidden lg:inline'>Customize Columns</span>
								<span className='lg:hidden'>Columns</span>
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
									pending: 'Refreshing orders...',
									success: 'Orders refreshed',
									error: 'Error refreshing orders',
								},
							);
						}}
					>
						<RefreshCcw />
						<span className='hidden lg:inline'>Refresh</span>
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
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className='flex items-center justify-between px-4 lg:px-6'>
				<div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{response?.pagination?.totalItems ?? 0} row(s) selected.
				</div>
				<div className='flex w-full items-center gap-8 lg:w-fit'>
					{/* Page size selector */}
					<div className='hidden items-center gap-2 lg:flex'>
						<Label htmlFor='rows-per-page' className='text-sm font-medium'>
							Rows per page
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
