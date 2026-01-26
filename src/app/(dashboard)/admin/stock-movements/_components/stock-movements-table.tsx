'use client';

import * as React from 'react';
import {
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
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
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
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
	StockMovement,
	StockMovementFilterParams,
	MovementType,
} from '@/types';
import { useEffect, useMemo } from 'react';
import { useStockMovements, useProducts } from '@/hooks';
import { RefreshCcw, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

// Helper function to get Vietnamese movement type label
function getMovementTypeLabel(type: string): string {
	switch (type) {
		case 'sale':
			return 'Bán hàng';
		case 'cancel':
			return 'Hủy đơn';
		case 'import':
			return 'Nhập kho';
		case 'adjust_increase':
			return 'Điều chỉnh tăng';
		case 'adjust_decrease':
			return 'Điều chỉnh giảm';
		case 'dispose':
			return 'Hủy bỏ';
		default:
			return type;
	}
}

// Helper function to get badge variant for movement type
function getMovementTypeBadgeVariant(
	type: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
	switch (type) {
		case 'sale':
			return 'secondary';
		case 'cancel':
			return 'outline';
		case 'import':
		case 'adjust_increase':
			return 'default'; // Green for increases
		case 'adjust_decrease':
		case 'dispose':
			return 'destructive'; // Red for decreases
		default:
			return 'secondary';
	}
}

// Main DataTable component
export function StockMovementsTable() {
	// API Filter params state
	const [apiParams, setApiParams] = React.useState<StockMovementFilterParams>({
		page: 1,
		limit: 10,
		productId: undefined,
		batchId: undefined,
		movementType: undefined,
		fromDate: undefined,
		toDate: undefined,
	});

	// Local filter inputs
	const [searchInput, setSearchInput] = React.useState('');
	const [fromDateInput, setFromDateInput] = React.useState('');
	const [toDateInput, setToDateInput] = React.useState('');

	// Fetch products for filter dropdown
	const { data: productsResponse } = useProducts();

	const [data, setData] = React.useState<StockMovement[]>([]);
	const {
		data: response,
		isError,
		refetch: refreshStockMovements,
		isPending,
	} = useStockMovements(apiParams);

	// Client-side search filtered data
	const filteredData = useMemo(() => {
		if (!searchInput) return data;
		const lowerSearch = searchInput.toLowerCase();
		return data.filter(item =>
			item.product?.name?.toLowerCase().includes(lowerSearch),
		);
	}, [data, searchInput]);

	// Date filters
	useEffect(() => {
		setApiParams(prev => ({
			...prev,
			fromDate: fromDateInput || undefined,
			toDate: toDateInput || undefined,
			page: 1,
		}));
	}, [fromDateInput, toDateInput]);

	useEffect(() => {
		if (isError) {
			toast.error('Lỗi khi tải lịch sử kho');
		}
	}, [isError]);

	useEffect(() => {
		if (response?.data) {
			setData(response.data);
		}
	}, [response]);

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
			productId: undefined,
			batchId: undefined,
			movementType: undefined,
			fromDate: undefined,
			toDate: undefined,
		});
	};

	// Define the columns for the table
	const columns: ColumnDef<StockMovement>[] = [
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
			header: 'ID',
			cell: ({ row }) => {
				return <div className='font-medium'>{row.getValue('id')}</div>;
			},
		},
		{
			accessorKey: 'product.name',
			header: 'Sản phẩm',
			cell: ({ row }) => {
				const productName = row.original.product?.name;
				return (
					<div className='max-w-[200px] truncate text-sm'>
						{productName || 'Không rõ'}
					</div>
				);
			},
		},
		{
			accessorKey: 'batch.batchCode',
			header: 'Mã lô',
			cell: ({ row }) => {
				const batchCode = row.original.batch?.batchCode;
				return <div className='text-sm'>{batchCode || 'N/A'}</div>;
			},
		},
		{
			accessorKey: 'movementType',
			header: 'Loại',
			cell: ({ row }) => {
				const type = row.getValue('movementType') as string;
				return (
					<Badge variant={getMovementTypeBadgeVariant(type)} className='w-fit'>
						{getMovementTypeLabel(type)}
					</Badge>
				);
			},
		},
		{
			accessorKey: 'quantity',
			header: 'Số lượng',
			cell: ({ row }) => {
				const quantity = row.getValue('quantity') as number;
				const type = row.original.movementType;
				// Positive: import, cancel, adjust_increase
				// Negative: sale, adjust_decrease, dispose
				const isPositive = ['import', 'cancel', 'adjust_increase'].includes(
					type,
				);
				const sign = isPositive ? '+' : '-';
				const color = isPositive ? 'text-green-600' : 'text-red-600';
				return (
					<div className={`text-right font-medium ${color}`}>
						{sign}
						{Math.abs(quantity)}
					</div>
				);
			},
		},
		{
			accessorKey: 'createdAt',
			header: 'Ngày tạo',
			cell: ({ row }) => {
				const createdAt = row.getValue('createdAt') as string;
				return (
					<div className='text-sm'>
						{format(new Date(createdAt), 'dd/MM/yyyy HH:mm')}
					</div>
				);
			},
		},
		{
			accessorKey: 'note',
			header: 'Ghi chú',
			cell: ({ row }) => {
				const note = row.getValue('note') as string;
				return (
					<div className='max-w-[180px] truncate text-sm text-muted-foreground'>
						{note || '-'}
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: filteredData,
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
		manualPagination: true,
		pageCount: response?.pagination?.totalPages ?? 0,
	});

	if (isPending) {
		return (
			<div className='flex h-48 w-full items-center justify-center'>
				Đang tải lịch sử kho...
			</div>
		);
	}

	return (
		<div className='w-full flex-col justify-start gap-6 flex'>
			{/* Filter Bar */}
			<div className='space-y-4 px-4 lg:px-6'>
				<div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
					{/* Search */}
					<div className='relative xl:col-span-2'>
						<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							placeholder='Tìm kiếm sản phẩm...'
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
							className='pl-9'
						/>
					</div>

					{/* Product Filter */}
					<Select
						value={apiParams.productId?.toString() || 'all'}
						onValueChange={value => {
							setApiParams(prev => ({
								...prev,
								productId: value === 'all' ? undefined : Number(value),
								page: 1,
							}));
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder='Tất cả sản phẩm' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Tất cả sản phẩm</SelectItem>
							{(productsResponse?.data || []).map(product => (
								<SelectItem key={product.id} value={product.id.toString()}>
									{product.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Movement Type Filter */}
					<Select
						value={apiParams.movementType || 'all'}
						onValueChange={value => {
							setApiParams(prev => ({
								...prev,
								movementType:
									value === 'all' ? undefined : (value as MovementType),
								page: 1,
							}));
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder='Tất cả loại' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Tất cả loại</SelectItem>
							<SelectItem value='sale'>Bán hàng</SelectItem>
							<SelectItem value='cancel'>Hủy đơn</SelectItem>
							<SelectItem value='import'>Nhập kho</SelectItem>
							<SelectItem value='adjust_increase'>Điều chỉnh tăng</SelectItem>
							<SelectItem value='adjust_decrease'>Điều chỉnh giảm</SelectItem>
							<SelectItem value='dispose'>Hủy bỏ</SelectItem>
						</SelectContent>
					</Select>

					{/* From Date */}
					<Input
						id='from-date'
						type='date'
						value={fromDateInput}
						onChange={e => setFromDateInput(e.target.value)}
						placeholder='Từ ngày'
					/>

					{/* To Date */}
					<Input
						id='to-date'
						type='date'
						value={toDateInput}
						onChange={e => setToDateInput(e.target.value)}
						placeholder='Đến ngày'
					/>
				</div>

				{/* Clear Filters Button */}
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='sm'
						onClick={clearFilters}
						className='ml-auto'
					>
						<X className='size-4' />
						Xóa bộ lọc
					</Button>
				</div>
			</div>

			{/* Toolbar */}
			<div className='flex items-center justify-between px-4 lg:px-6'>
				<div className='flex items-center gap-2'>
					<h2 className='text-lg font-semibold'>Lịch sử xuất nhập kho</h2>
				</div>
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
									return await refreshStockMovements();
								},
								{
									pending: 'Đang làm mới...',
									success: 'Đã làm mới lịch sử kho',
									error: 'Lỗi khi làm mới',
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
						Trang {response?.pagination?.page ?? 1} /{' '}
						{response?.pagination?.totalPages ?? 1} • Tổng:{' '}
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
							<span className='sr-only'>Đến trang đầu</span>
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
							<span className='sr-only'>Đến trang trước</span>
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
							<span className='sr-only'>Đến trang sau</span>
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
							<span className='sr-only'>Đến trang cuối</span>
							<IconChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
