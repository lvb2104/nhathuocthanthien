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
import { Category, GetCategoriesResponse } from '@/types';
import { useEffect } from 'react';
import { useCategories, useDeleteCategory } from '@/hooks';
import { RefreshCcw, Search, X } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import CreateCategoryForm from './create-category-form';
import EditCategoryForm from './edit-category-form';

export function CategoriesTable({
	initialCategories,
}: {
	initialCategories?: GetCategoriesResponse;
}) {
	// API Filter params state
	const [apiParams, setApiParams] = React.useState({
		page: 1,
		limit: 10,
		keyword: '',
	});

	// Local filter inputs (for debouncing)
	const [searchInput, setSearchInput] = React.useState('');

	const [data, setData] = React.useState<Category[]>([]);
	const {
		data: response,
		isError: isCategoriesError,
		refetch: refreshCategories,
		isPending: isCategoriesPending,
	} = useCategories(apiParams, initialCategories);
	const { mutateAsync } = useDeleteCategory();

	// Edit sheet state
	const [isEditOpen, setIsEditOpen] = React.useState(false);
	const [selectedCategory, setSelectedCategory] =
		React.useState<Category | null>(null);
	const [editFormKey, setEditFormKey] = React.useState(0);

	// Create sheet state
	const [isCreateOpen, setIsCreateOpen] = React.useState(false);
	const [createFormKey, setCreateFormKey] = React.useState(0);

	const handleEdit = (category: Category) => {
		setSelectedCategory(category);
		setEditFormKey(Date.now());
		setIsEditOpen(true);
	};

	const handleEditSheetOpenChange = (open: boolean) => {
		setIsEditOpen(open);
		if (!open) {
			setSelectedCategory(null);
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
		if (isCategoriesError) {
			toast.error('Error loading categories');
		}
	}, [isCategoriesError]);

	useEffect(() => {
		if (response?.data) {
			setData(response.data);
		}
	}, [response]);

	const clearFilters = () => {
		setSearchInput('');
		setApiParams({
			page: 1,
			limit: 10,
			keyword: '',
		});
	};

	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [deletePopoverOpen, setDeletePopoverOpen] = React.useState(false);

	const columns: ColumnDef<Category>[] = [
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
			accessorKey: 'name',
			header: 'Category Name',
			cell: ({ row }) => {
				return <div className='font-medium'>{row.getValue('name')}</div>;
			},
			enableHiding: false,
			size: 1000, // Make this column take up most of the space
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
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant='destructive'
							onClick={() => handleDelete(row.original.id)}
						>
							Delete
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
		manualPagination: true, // Server-side pagination
		pageCount: response?.pagination?.totalPages ?? 0,
	});

	function handleDelete(id: number) {
		mutateAsync(id, {
			onSuccess: () => {
				setData(prevData => prevData.filter(item => item.id !== id));
				toast.success('Category deleted successfully');
			},
			onError: (error: any) => {
				toast.error(
					error?.message || 'Error deleting category. Please try again.',
				);
			},
		});
	}

	function handleDeleteMultiple() {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		if (selectedRows.length === 0) return;

		const selectedIds = selectedRows.map(row => row.original.id);

		Promise.all(
			selectedIds.map(id =>
				mutateAsync(id, {
					onError: (error: any) => {
						toast.error(
							error?.message ||
								`Error deleting category ID ${id}. Please try again.`,
						);
					},
				}),
			),
		)
			.then(() => {
				setData(prevData =>
					prevData.filter(item => !selectedIds.includes(item.id)),
				);
				setRowSelection({});
				setDeletePopoverOpen(false);
				toast.success(`${selectedIds.length} categories deleted successfully`);
			})
			.catch(() => {
				toast.error('Error deleting categories. Please try again.');
			});
	}

	if (isCategoriesPending) {
		return (
			<div className='flex h-48 w-full items-center justify-center'>
				Loading categories...
			</div>
		);
	}

	return (
		<div className='w-full flex-col justify-start gap-6 flex'>
			{/* Filter Bar */}
			<div className='space-y-4 px-4 lg:px-6'>
				<div className='flex items-center gap-4'>
					{/* Search */}
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							placeholder='Search categories...'
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
							className='pl-9'
						/>
					</div>

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
											Delete categories?
										</h4>
										<p className='text-sm text-muted-foreground'>
											You are about to delete{' '}
											{table.getFilteredSelectedRowModel().rows.length}{' '}
											categories. This action cannot be undone.
										</p>
										<div className='max-h-32 overflow-y-auto rounded-md bg-muted p-2 text-xs'>
											{table.getFilteredSelectedRowModel().rows.map(row => (
												<div key={row.original.id} className='truncate py-1'>
													• {row.original.name}
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
											Delete
										</Button>
									</div>
								</div>
							</PopoverContent>
						</Popover>
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
									return await refreshCategories();
								},
								{
									pending: 'Refreshing categories...',
									success: 'Categories refreshed',
									error: 'Error refreshing categories',
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
						<span className='hidden lg:inline'>Add Category</span>
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
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											style={{
												width: header.id === 'name' ? '100%' : undefined,
											}}
										>
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
									page: Math.max(1, prev.page - 1),
								}))
							}
							disabled={apiParams.page === 1}
						>
							<span className='sr-only'>Go to previous page</span>
							<IconChevronLeft />
						</Button>
						<Button
							variant='outline'
							className='size-8'
							size='icon'
							onClick={() =>
								setApiParams(prev => ({ ...prev, page: prev.page + 1 }))
							}
							disabled={
								apiParams.page >= (response?.pagination?.totalPages ?? 1)
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
								apiParams.page >= (response?.pagination?.totalPages ?? 1)
							}
						>
							<span className='sr-only'>Go to last page</span>
							<IconChevronsRight />
						</Button>
					</div>
				</div>
			</div>

			{/* Edit Category Sheet */}
			<Sheet open={isEditOpen} onOpenChange={handleEditSheetOpenChange}>
				<SheetContent className='overflow-y-auto w-full sm:max-w-2xl'>
					<SheetHeader className='px-6'>
						<SheetTitle>Edit Category</SheetTitle>
						<SheetDescription>
							Make changes to the category here. Click update when done.
						</SheetDescription>
					</SheetHeader>
					{selectedCategory && (
						<EditCategoryForm
							key={editFormKey}
							category={selectedCategory}
							onSuccess={() => {
								setIsEditOpen(false);
								refreshCategories();
							}}
						/>
					)}
				</SheetContent>
			</Sheet>

			{/* Create Category Sheet */}
			<Sheet open={isCreateOpen} onOpenChange={handleCreateSheetOpenChange}>
				<SheetContent className='overflow-y-auto w-full sm:max-w-2xl'>
					<SheetHeader className='px-6'>
						<SheetTitle>Create New Category</SheetTitle>
						<SheetDescription>
							Add a new category to the system.
						</SheetDescription>
					</SheetHeader>
					<CreateCategoryForm
						key={createFormKey}
						onSuccess={() => {
							setIsCreateOpen(false);
							refreshCategories();
						}}
					/>
				</SheetContent>
			</Sheet>
		</div>
	);
}
