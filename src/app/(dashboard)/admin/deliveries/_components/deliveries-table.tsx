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
	DeliveryFilterParams,
	Delivery,
	DeliveryStatus,
	GetAllDeliveriesResponse,
} from '@/types';
import { useEffect } from 'react';
import { useDeliveries } from '@/hooks';
import { RefreshCcw, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { routes } from '@/configs/routes';

export function DeliveriesTable({
	initialDeliveries,
}: {
	initialDeliveries?: GetAllDeliveriesResponse;
}) {
	const [apiParams, setApiParams] = React.useState<DeliveryFilterParams>({
		page: 1,
		limit: 10,
		keyword: '',
		status: undefined as DeliveryStatus | undefined,
	});

	const [searchInput, setSearchInput] = React.useState('');
	const [data, setData] = React.useState<Delivery[]>([]);

	const {
		data: response,
		isError,
		refetch: refreshDeliveries,
		isPending,
	} = useDeliveries(apiParams, initialDeliveries);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setApiParams(prev => ({ ...prev, keyword: searchInput, page: 1 }));
		}, 500);
		return () => clearTimeout(timeout);
	}, [searchInput]);

	useEffect(() => {
		if (isError) {
			toast.error('Error loading deliveries');
		}
	}, [isError]);

	useEffect(() => {
		if (response?.data) {
			setData(response.data);
		}
	}, [response]);

	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const clearFilters = () => {
		setSearchInput('');
		setApiParams({
			page: 1,
			limit: 10,
			keyword: '',
			status: undefined,
		});
	};

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

	const columns: ColumnDef<Delivery>[] = [
		{
			accessorKey: 'id',
			header: 'Delivery ID',
			cell: ({ row }) => {
				return <div className='font-medium'>#{row.getValue('id')}</div>;
			},
			enableHiding: false,
		},
		{
			accessorKey: 'orderId',
			header: 'Order ID',
			cell: ({ row }) => {
				const orderId = row.getValue('orderId') as number;
				return (
					<Link
						href={`${routes.admin.orders.main}?orderId=${orderId}`}
						className='font-medium text-primary hover:underline'
					>
						#{orderId}
					</Link>
				);
			},
		},
		{
			accessorKey: 'employee.fullName',
			header: 'Employee',
			cell: ({ row }) => {
				const employee = row.original.employee;
				return (
					<div className='max-w-[200px]'>
						<div className='font-medium truncate'>
							{employee?.fullName || 'N/A'}
						</div>
						{employee?.email && (
							<div className='text-xs text-muted-foreground truncate'>
								{employee.email}
							</div>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const status = row.getValue('status') as DeliveryStatus;
				return (
					<Badge
						variant={getDeliveryStatusBadgeVariant(status)}
						className='w-fit capitalize'
					>
						{status}
					</Badge>
				);
			},
		},
		{
			accessorKey: 'updatedAt',
			header: 'Last Updated',
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
							<span className='sr-only'>Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-40'>
						<DropdownMenuItem asChild>
							<Link
								href={`${routes.admin.orders.main}?orderId=${row.original.orderId}`}
							>
								View Order
							</Link>
						</DropdownMenuItem>
						{/* TODO: Add update status and reassign employee actions */}
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
		manualPagination: true,
		pageCount: response?.pagination?.totalPages ?? 0,
	});

	if (isPending) {
		return (
			<div className='flex h-48 w-full items-center justify-center'>
				Loading deliveries...
			</div>
		);
	}

	return (
		<div className='w-full flex-col justify-start gap-6 flex'>
			{/* Filter Bar */}
			<div className='space-y-4 px-4 lg:px-6'>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							placeholder='Search by employee...'
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
							className='pl-9'
						/>
					</div>

					<Select
						value={apiParams.status || 'all'}
						onValueChange={value => {
							setApiParams(prev => ({
								...prev,
								status: value === 'all' ? undefined : (value as DeliveryStatus),
								page: 1,
							}));
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder='All Status' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Status</SelectItem>
							<SelectItem value={DeliveryStatus.ASSIGNED}>Assigned</SelectItem>
							<SelectItem value={DeliveryStatus.SHIPPING}>Shipping</SelectItem>
							<SelectItem value={DeliveryStatus.DELIVERED}>
								Delivered
							</SelectItem>
							<SelectItem value={DeliveryStatus.CANCELLED}>
								Cancelled
							</SelectItem>
						</SelectContent>
					</Select>

					<Button variant='outline' size='sm' onClick={clearFilters}>
						<X className='size-4' />
						Clear Filters
					</Button>
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
									return await refreshDeliveries();
								},
								{
									pending: 'Refreshing deliveries...',
									success: 'Deliveries refreshed',
									error: 'Error refreshing deliveries',
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
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className='flex items-center justify-between px-4 lg:px-6'>
				<div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
					{response?.pagination?.totalItems ?? 0} delivery(ies) total.
				</div>
				<div className='flex w-full items-center gap-8 lg:w-fit'>
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

					<div className='flex w-fit items-center justify-center text-sm font-medium'>
						Page {response?.pagination?.page ?? 1} of{' '}
						{response?.pagination?.totalPages ?? 1} • Total:{' '}
						{response?.pagination?.totalItems ?? 0}
					</div>

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
		</div>
	);
}
