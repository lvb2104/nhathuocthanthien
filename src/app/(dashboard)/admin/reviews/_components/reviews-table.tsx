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
import { GetAllReviewsResponse, Review, ReviewFilterParams } from '@/types';
import { useEffect } from 'react';
import { useReviews, useDeleteReview } from '@/hooks';
import { RefreshCcw, Search, X, Eye, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { routes } from '@/configs/routes';
import { ReviewDetailSheet } from './review-detail-sheet';

// Main DataTable component
export function ReviewsTable({
	initialReviews,
}: {
	initialReviews?: GetAllReviewsResponse;
}) {
	// API Filter params state
	const [apiParams, setApiParams] = React.useState<ReviewFilterParams>({
		page: 1,
		limit: 10,
		keyword: '',
		rating: undefined as number | undefined,
		productId: undefined as number | undefined,
		userId: undefined as number | undefined,
	});

	// Local filter inputs (for debouncing)
	const [searchInput, setSearchInput] = React.useState('');
	const [productIdInput, setProductIdInput] = React.useState('');
	const [userIdInput, setUserIdInput] = React.useState('');

	const [data, setData] = React.useState<Review[]>([]);
	const {
		data: response,
		isError: isReviewsError,
		refetch: refreshReviews,
		isPending: isReviewsPending,
	} = useReviews(apiParams, initialReviews);
	const { mutateAsync: deleteMutate } = useDeleteReview();

	// View/Edit details sheet state
	const [isDetailOpen, setIsDetailOpen] = React.useState(false);
	const [detailReviewId, setDetailReviewId] = React.useState<number | null>(
		null,
	);

	const handleViewDetails = (review: Review) => {
		setDetailReviewId(review.id);
		setIsDetailOpen(true);
	};

	// Debounced search
	useEffect(() => {
		const timeout = setTimeout(() => {
			setApiParams(prev => ({ ...prev, keyword: searchInput, page: 1 }));
		}, 500);
		return () => clearTimeout(timeout);
	}, [searchInput]);

	// Debounced productId filter
	useEffect(() => {
		const timeout = setTimeout(() => {
			setApiParams(prev => ({
				...prev,
				productId: productIdInput ? Number(productIdInput) : undefined,
				page: 1,
			}));
		}, 500);
		return () => clearTimeout(timeout);
	}, [productIdInput]);

	// Debounced userId filter
	useEffect(() => {
		const timeout = setTimeout(() => {
			setApiParams(prev => ({
				...prev,
				userId: userIdInput ? Number(userIdInput) : undefined,
				page: 1,
			}));
		}, 500);
		return () => clearTimeout(timeout);
	}, [userIdInput]);

	useEffect(() => {
		if (isReviewsError) {
			toast.error('Error loading reviews');
		}
	}, [isReviewsError]);

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
	const [deletePopoverOpen, setDeletePopoverOpen] = React.useState(false);

	const clearFilters = () => {
		setSearchInput('');
		setProductIdInput('');
		setUserIdInput('');
		setApiParams({
			page: 1,
			limit: 10,
			keyword: '',
			rating: undefined,
			productId: undefined,
			userId: undefined,
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

	// Render star rating
	const renderStars = (rating: number) => {
		return (
			<div className='flex items-center gap-1'>
				{Array.from({ length: 5 }).map((_, index) => (
					<Star
						key={index}
						className={`size-4 ${
							index < rating
								? 'fill-yellow-400 text-yellow-400'
								: 'text-gray-300'
						}`}
					/>
				))}
				<span className='ml-1 text-sm font-medium'>{rating}</span>
			</div>
		);
	};

	// Define the columns for the table
	const columns: ColumnDef<Review>[] = [
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
				return <div className='font-medium'>#{row.getValue('id')}</div>;
			},
			enableHiding: false,
		},
		{
			accessorKey: 'productId',
			header: 'Product',
			cell: ({ row }) => {
				const productId = row.getValue('productId') as number;
				return (
					<Link
						href={routes.products.detail(productId)}
						className='text-primary hover:underline font-medium'
						target='_blank'
					>
						Product #{productId}
					</Link>
				);
			},
		},
		{
			accessorKey: 'user.fullName',
			header: 'User',
			cell: ({ row }) => {
				const user = row.original.user;
				return (
					<div className='max-w-[150px]'>
						<div className='font-medium truncate'>
							{user?.fullName || 'N/A'}
						</div>
						<div className='text-xs text-muted-foreground'>
							User #{row.original.userId}
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'rating',
			header: 'Rating',
			cell: ({ row }) => {
				const rating = row.getValue('rating') as number;
				return <div>{renderStars(rating)}</div>;
			},
		},
		{
			accessorKey: 'comment',
			header: 'Comment',
			cell: ({ row }) => {
				const comment = row.getValue('comment') as string | undefined;
				return (
					<div className='max-w-[300px]'>
						{comment ? (
							<p className='truncate text-sm'>{comment}</p>
						) : (
							<span className='text-muted-foreground text-sm italic'>
								No comment
							</span>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: 'createdAt',
			header: 'Created',
			cell: ({ row }) => {
				const date = row.getValue('createdAt') as string;
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
						<DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
							<Eye className='mr-2 size-4' />
							View Details
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant='destructive'
							onClick={() => handleDelete(row.original.id)}
						>
							Delete Review
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

	function handleDelete(id: number) {
		toast.promise(
			deleteMutate(id).then(() => {
				setData(prevData => prevData.filter(item => item.id !== id));
			}),
			{
				pending: 'Deleting review...',
				success: 'Review deleted successfully',
				error: 'Error deleting review. Please try again.',
			},
		);
	}

	function handleDeleteMultiple() {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		if (selectedRows.length === 0) return;

		const selectedIds = selectedRows.map(row => row.original.id);

		toast.promise(
			Promise.all(selectedIds.map(id => deleteMutate(id))).then(() => {
				setData(prevData =>
					prevData.filter(item => !selectedIds.includes(item.id)),
				);
				setRowSelection({});
				setDeletePopoverOpen(false);
			}),
			{
				pending: `Deleting ${selectedIds.length} review(s)...`,
				success: `${selectedIds.length} review(s) deleted successfully`,
				error: 'Error deleting reviews. Please try again.',
			},
		);
	}

	if (isReviewsPending) {
		return (
			<div className='flex h-48 w-full items-center justify-center'>
				Loading reviews...
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
							placeholder='Search comments...'
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
							className='pl-9'
						/>
					</div>

					{/* Rating Filter */}
					<Select
						value={apiParams.rating?.toString() || 'all'}
						onValueChange={value => {
							setApiParams(prev => ({
								...prev,
								rating: value === 'all' ? undefined : Number(value),
								page: 1,
							}));
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder='All Ratings' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Ratings</SelectItem>
							<SelectItem value='5'>5 Stars</SelectItem>
							<SelectItem value='4'>4 Stars</SelectItem>
							<SelectItem value='3'>3 Stars</SelectItem>
							<SelectItem value='2'>2 Stars</SelectItem>
							<SelectItem value='1'>1 Star</SelectItem>
						</SelectContent>
					</Select>

					{/* Product ID Filter */}
					<Input
						type='number'
						placeholder='Filter by Product ID'
						value={productIdInput}
						onChange={e => setProductIdInput(e.target.value)}
					/>

					{/* User ID Filter */}
					<Input
						type='number'
						placeholder='Filter by User ID'
						value={userIdInput}
						onChange={e => setUserIdInput(e.target.value)}
					/>
				</div>

				{/* Clear filters button */}
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
				<div className='flex items-center gap-2'>
					{table.getFilteredSelectedRowModel().rows.length > 0 && (
						<>
							<Popover
								open={deletePopoverOpen}
								onOpenChange={setDeletePopoverOpen}
							>
								<PopoverTrigger asChild>
									<Button
										variant='destructive'
										size='sm'
										className='cursor-pointer'
									>
										<span>
											Delete ({table.getFilteredSelectedRowModel().rows.length})
										</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-80'>
									<div className='space-y-4'>
										<div className='space-y-2'>
											<h4 className='font-medium leading-none'>
												Delete reviews?
											</h4>
											<p className='text-sm text-muted-foreground'>
												You are about to delete{' '}
												{table.getFilteredSelectedRowModel().rows.length}{' '}
												review(s). This action cannot be undone.
											</p>
											<div className='max-h-32 overflow-y-auto rounded-md bg-muted p-2 text-xs'>
												{table.getFilteredSelectedRowModel().rows.map(row => (
													<div key={row.original.id} className='truncate py-1'>
														• Review #{row.original.id}
													</div>
												))}
											</div>
										</div>
										<div className='flex gap-2 justify-end'>
											<Button
												variant='outline'
												size='sm'
												onClick={() => setDeletePopoverOpen(false)}
											>
												Cancel
											</Button>
											<Button
												variant='destructive'
												size='sm'
												onClick={handleDeleteMultiple}
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
									return await refreshReviews();
								},
								{
									pending: 'Refreshing reviews...',
									success: 'Reviews refreshed',
									error: 'Error refreshing reviews',
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

			{/* Review Detail Sheet */}
			{detailReviewId && (
				<ReviewDetailSheet
					reviewId={detailReviewId}
					open={isDetailOpen}
					onOpenChange={setIsDetailOpen}
					onSuccess={() => {
						refreshReviews();
					}}
				/>
			)}
		</div>
	);
}
