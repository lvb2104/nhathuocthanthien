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
	IconPlus,
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
import { toast } from 'react-toastify';
import {
	GetAllBatchesResponse,
	Batch,
	GetProductsResponse,
	BatchStatus,
	BatchFilterParams,
} from '@/types';
import { useEffect } from 'react';
import { useBatches, useDisposeBatch } from '@/hooks';
import { RefreshCcw, Search, X } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { format, isPast } from 'date-fns';
import CreateBatchForm from './create-batch-form';
import EditBatchForm from './edit-batch-form';

// Main DataTable component
export function BatchesTable({
	initialBatches,
	initialProducts,
}: {
	initialBatches?: GetAllBatchesResponse;
	initialProducts?: GetProductsResponse;
}) {
	// API Filter params state
	const [apiParams, setApiParams] = React.useState<BatchFilterParams>({
		page: 1,
		limit: 10,
		productId: undefined as number | undefined,
		status: undefined as BatchStatus | undefined,
		expired: undefined as boolean | undefined,
		keyword: '',
	});

	// Local filter inputs (for debouncing)
	const [searchInput, setSearchInput] = React.useState('');

	const [data, setData] = React.useState<Batch[]>([]);
	const {
		data: response,
		isError: isBatchesError,
		refetch: refreshBatches,
		isPending: isBatchesPending,
	} = useBatches(apiParams, initialBatches);
	const { mutateAsync: disposeAsync } = useDisposeBatch();

	const [formKey, setFormKey] = React.useState(0);

	// Edit sheet state
	const [isEditOpen, setIsEditOpen] = React.useState(false);
	const [selectedBatch, setSelectedBatch] = React.useState<Batch | null>(null);

	// Create sheet state
	const [isCreateOpen, setIsCreateOpen] = React.useState(false);
	const [createFormKey, setCreateFormKey] = React.useState(0);

	// Dispose dialog state
	const [disposeDialogOpen, setDisposeDialogOpen] = React.useState(false);
	const [batchToDispose, setBatchToDispose] = React.useState<number | null>(
		null,
	);

	const handleEdit = (batch: Batch) => {
		setSelectedBatch(batch);
		setFormKey(Date.now());
		setIsEditOpen(true);
	};

	const handleEditSheetOpenChange = (open: boolean) => {
		setIsEditOpen(open);
		if (!open) {
			setSelectedBatch(null);
		}
	};

	const handleCreate = () => {
		setCreateFormKey(Date.now());
		setIsCreateOpen(true);
	};

	const handleCreateSheetOpenChange = (open: boolean) => {
		setIsCreateOpen(open);
	};

	// Debounced search
	useEffect(() => {
		const timeout = setTimeout(() => {
			setApiParams(prev => ({ ...prev, keyword: searchInput, page: 1 }));
		}, 500);
		return () => clearTimeout(timeout);
	}, [searchInput]);

	useEffect(() => {
		if (isBatchesError) {
			toast.error('Error loading batches');
		}
	}, [isBatchesError]);

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
		setApiParams({
			page: 1,
			limit: 10,
			productId: undefined,
			status: undefined,
			expired: undefined,
			keyword: '',
		});
	};

	// Define the columns for the table
	const columns: ColumnDef<Batch>[] = [
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
			accessorKey: 'batchCode',
			header: 'Batch Code',
			cell: ({ row }) => {
				return (
					<div className='font-medium'>
						{row.getValue('batchCode') || 'N/A'}
					</div>
				);
			},
			enableHiding: false,
		},
		{
			accessorKey: 'product.name',
			header: 'Product',
			cell: ({ row }) => {
				const productName = row.original.product?.name;
				return (
					<div className='max-w-[200px] truncate text-sm'>
						{productName || 'Unknown'}
					</div>
				);
			},
		},
		{
			accessorKey: 'quantity',
			header: 'Quantity',
			cell: ({ row }) => {
				const quantity = row.getValue('quantity') as number;
				return <div className='text-right'>{quantity}</div>;
			},
		},
		{
			accessorKey: 'expiryDate',
			header: 'Expiry Date',
			cell: ({ row }) => {
				const expiryDate = row.getValue('expiryDate') as string;
				const isExpired = isPast(new Date(expiryDate));
				return (
					<div className='flex items-center gap-2'>
						<span className={isExpired ? 'text-destructive' : ''}>
							{format(new Date(expiryDate), 'MMM dd, yyyy')}
						</span>
						{isExpired && (
							<Badge variant='destructive' className='text-xs'>
								Expired
							</Badge>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: 'receivedDate',
			header: 'Received Date',
			cell: ({ row }) => {
				const receivedDate = row.getValue('receivedDate') as string;
				if (!receivedDate) return <div className='text-sm'>-</div>;
				return (
					<div className='text-sm'>
						{format(new Date(receivedDate), 'MMM dd, yyyy')}
					</div>
				);
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const status = row.getValue('status') as string;
				return (
					<Badge
						variant={status === 'disposed' ? 'destructive' : 'secondary'}
						className='w-fit'
					>
						{status || 'active'}
					</Badge>
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
					<DropdownMenuContent align='end' className='w-32'>
						<DropdownMenuItem onClick={() => handleEdit(row.original)}>
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleDispose(row.original.id)}>
							Dispose
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
		manualPagination: true,
		pageCount: response?.pagination?.totalPages ?? 0,
	});

	function handleDispose(id: number) {
		setBatchToDispose(id);
		setDisposeDialogOpen(true);
	}

	function confirmDispose() {
		if (!batchToDispose) return;

		toast.promise(
			disposeAsync(
				{ id: batchToDispose, request: { note: 'Disposed via admin panel' } },
				{
					onError: (error: any) => {
						toast.error(
							error?.message || 'Error disposing batch. Please try again.',
						);
					},
				},
			).then(() => {
				refreshBatches();
				setDisposeDialogOpen(false);
				setBatchToDispose(null);
			}),
			{
				pending: 'Disposing batch...',
				success: 'Batch disposed successfully',
			},
		);
	}

	if (isBatchesPending) {
		return (
			<div className='flex h-48 w-full items-center justify-center'>
				Loading batches...
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
							placeholder='Search by batch code...'
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
							<SelectValue placeholder='All Products' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Products</SelectItem>
							{(initialProducts?.data || []).map(product => (
								<SelectItem key={product.id} value={product.id.toString()}>
									{product.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Status Filter */}
					<Select
						value={apiParams.status || 'all'}
						onValueChange={value => {
							setApiParams(prev => ({
								...prev,
								status: value === 'all' ? undefined : (value as BatchStatus),
								page: 1,
							}));
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder='All Statuses' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Statuses</SelectItem>
							<SelectItem value='active'>Active</SelectItem>
							<SelectItem value='disposed'>Disposed</SelectItem>
						</SelectContent>
					</Select>

					{/* Expired Filter (Checkbox) */}
					<div className='flex items-center gap-2'>
						<Checkbox
							id='show-expired'
							checked={apiParams.expired === true}
							onCheckedChange={checked => {
								setApiParams(prev => ({
									...prev,
									expired: checked ? true : undefined,
									page: 1,
								}));
							}}
						/>
						<Label
							htmlFor='show-expired'
							className='text-sm font-medium cursor-pointer'
						>
							Show expired only
						</Label>
					</div>
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
						Clear Filters
					</Button>
				</div>
			</div>

			{/* Toolbar */}
			<div className='flex items-center justify-between px-4 lg:px-6'>
				<div className='flex items-center gap-2' />
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
									return await refreshBatches();
								},
								{
									pending: 'Refreshing batches...',
									success: 'Batches refreshed',
									error: 'Error refreshing batches',
								},
							);
						}}
					>
						<RefreshCcw />
						<span className='hidden lg:inline'>Refresh</span>
					</Button>
					<Button
						variant='outline'
						size='sm'
						className='cursor-pointer'
						onClick={handleCreate}
					>
						<IconPlus />
						<span className='hidden lg:inline'>Add Batch</span>
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

			{/* Edit Batch Sheet */}
			<Sheet open={isEditOpen} onOpenChange={handleEditSheetOpenChange}>
				<SheetContent className='overflow-y-auto w-full sm:max-w-2xl'>
					<SheetHeader className='px-6'>
						<SheetTitle>Edit Batch</SheetTitle>
						<SheetDescription>
							Make changes to the batch here. Click save when you&apos;re done.
						</SheetDescription>
					</SheetHeader>
					{selectedBatch && (
						<EditBatchForm
							key={formKey}
							id={selectedBatch.id.toString()}
							initialBatch={selectedBatch}
							onSuccess={() => {
								setIsEditOpen(false);
								refreshBatches();
							}}
						/>
					)}
				</SheetContent>
			</Sheet>

			{/* Create Batch Sheet */}
			<Sheet open={isCreateOpen} onOpenChange={handleCreateSheetOpenChange}>
				<SheetContent className='overflow-y-auto w-full sm:max-w-2xl'>
					<SheetHeader className='px-6'>
						<SheetTitle>Create Batch</SheetTitle>
						<SheetDescription>
							Add a new batch to the inventory.
						</SheetDescription>
					</SheetHeader>
					<CreateBatchForm
						key={createFormKey}
						onSuccess={() => {
							setIsCreateOpen(false);
							refreshBatches();
						}}
					/>
				</SheetContent>
			</Sheet>

			{/* Dispose Batch Dialog */}
			<AlertDialog open={disposeDialogOpen} onOpenChange={setDisposeDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Dispose batch?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to mark this batch as disposed? This will
							update the batch status and create a stock movement record.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => {
								setDisposeDialogOpen(false);
								setBatchToDispose(null);
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDispose}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						>
							Dispose
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
