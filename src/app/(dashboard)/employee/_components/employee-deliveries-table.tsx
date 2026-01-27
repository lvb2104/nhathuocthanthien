'use client';

import * as React from 'react';
import {
	IconChevronDown,
	IconDotsVertical,
	IconLayoutColumns,
} from '@tabler/icons-react';
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
	Delivery,
	DeliveryStatus,
	GetDeliveriesByEmployeeResponse,
} from '@/types';
import { useEffect, useState } from 'react';
import { useEmployeeDeliveries } from '@/hooks';
import { RefreshCcw } from 'lucide-react';
import { UpdateDeliveryStatusDialog } from './update-delivery-status-dialog';

export function EmployeeDeliveriesTable({
	initialDeliveries,
}: {
	initialDeliveries?: GetDeliveriesByEmployeeResponse;
}) {
	const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'all'>(
		'all',
	);
	const [data, setData] = useState<Delivery[]>([]);
	const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
		null,
	);
	const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

	const {
		data: response,
		isError,
		refetch: refreshDeliveries,
		isPending,
	} = useEmployeeDeliveries(initialDeliveries);

	useEffect(() => {
		if (isError) {
			toast.error('Lỗi khi tải danh sách giao hàng');
		}
	}, [isError]);

	useEffect(() => {
		if (response?.data) {
			// Apply status filter on client side
			const filtered =
				statusFilter === 'all'
					? response.data
					: response.data.filter(d => d.status === statusFilter);
			setData(filtered);
		}
	}, [response, statusFilter]);

	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

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

	const handleUpdateStatus = (delivery: Delivery) => {
		setSelectedDelivery(delivery);
		setIsUpdateDialogOpen(true);
	};

	const columns: ColumnDef<Delivery>[] = [
		{
			accessorKey: 'id',
			header: 'Mã vận đơn',
			cell: ({ row }) => {
				return <div className='font-medium'>#{row.getValue('id')}</div>;
			},
			enableHiding: false,
		},
		{
			accessorKey: 'orderId',
			header: 'Mã đơn hàng',
			cell: ({ row }) => {
				const orderId = row.getValue('orderId') as number;
				return <div className='font-medium text-primary'>#{orderId}</div>;
			},
		},
		{
			accessorKey: 'status',
			header: 'Trạng thái',
			cell: ({ row }) => {
				const status = row.getValue('status') as DeliveryStatus;
				return (
					<Badge
						variant={getDeliveryStatusBadgeVariant(status)}
						className='w-fit capitalize'
					>
						{getDeliveryStatusLabel(status)}
					</Badge>
				);
			},
		},
		{
			accessorKey: 'order.finalAmount',
			header: 'Tổng tiền',
			cell: ({ row }) => {
				const amount = row.original.order?.finalAmount;
				if (!amount) return <div className='text-sm'>N/A</div>;
				return (
					<div className='text-sm font-medium'>
						{parseFloat(amount).toLocaleString('vi-VN')} ₫
					</div>
				);
			},
		},
		{
			id: 'shippingAddress',
			header: 'Địa chỉ giao hàng',
			cell: ({ row }) => {
				const shipping = row.original.order?.shipping;
				if (!shipping) return <div className='text-sm text-muted-foreground'>N/A</div>;
				
				const addressParts = [
					shipping.addressLine,
					shipping.ward,
					shipping.district,
					shipping.province,
				].filter(Boolean);
				
				return (
					<div className='text-sm max-w-xs'>
						<div className='font-medium'>{shipping.fullName}</div>
						<div className='text-muted-foreground'>{shipping.phone}</div>
						<div className='text-muted-foreground text-xs mt-1'>
							{addressParts.join(', ')}
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'updatedAt',
			header: 'Cập nhật cuối',
			cell: ({ row }) => {
				const date = row.getValue('updatedAt') as string;
				return <div className='text-sm'>{formatDate(date)}</div>;
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
						<DropdownMenuItem
							onClick={() => handleUpdateStatus(row.original)}
							disabled={
								row.original.status === DeliveryStatus.DELIVERED ||
								row.original.status === DeliveryStatus.CANCELLED
							}
						>
							Cập nhật trạng thái
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
			columnFilters,
		},
		getRowId: row => row.id.toString(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	if (isPending) {
		return (
			<div className='flex h-48 w-full items-center justify-center'>
				Đang tải danh sách giao hàng...
			</div>
		);
	}

	return (
		<>
			<div className='w-full flex-col justify-start gap-6 flex'>
				{/* Filter Bar */}
				<div className='space-y-4 px-4 lg:px-6'>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						<Select
							value={statusFilter}
							onValueChange={value => {
								setStatusFilter(value as DeliveryStatus | 'all');
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder='Tất cả trạng thái' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>Tất cả trạng thái</SelectItem>
								<SelectItem value={DeliveryStatus.ASSIGNED}>
									Đã phân công
								</SelectItem>
								<SelectItem value={DeliveryStatus.SHIPPING}>
									Đang giao hàng
								</SelectItem>
								<SelectItem value={DeliveryStatus.DELIVERED}>
									Đã giao hàng
								</SelectItem>
								<SelectItem value={DeliveryStatus.CANCELLED}>Đã hủy</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Toolbar */}
				<div className='flex items-center justify-between px-4 lg:px-6'>
					<div />
					<div className='flex items-center gap-2'>
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
										return await refreshDeliveries();
									},
									{
										pending: 'Đang làm mới...',
										success: 'Đã làm mới danh sách',
										error: 'Lỗi khi làm mới danh sách',
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
									<TableRow key={row.id}>
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
										Chưa được phân công giao hàng.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				<div className='flex items-center justify-between px-4 lg:px-6'>
					<div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
						Tổng cộng {data.length} chuyến giao hàng.
					</div>
				</div>
			</div>

			{selectedDelivery && (
				<UpdateDeliveryStatusDialog
					delivery={selectedDelivery}
					open={isUpdateDialogOpen}
					onOpenChange={setIsUpdateDialogOpen}
				/>
			)}
		</>
	);
}
