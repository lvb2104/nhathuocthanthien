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
	getPaginationRowModel,
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
import Link from 'next/link';
import { routes } from '@/configs/routes';
import { toast } from 'react-toastify';
import { GetCategoriesResponse, GetProductsResponse, Product } from '@/types';
import { useEffect } from 'react';
import { useDeleteProduct, useProducts } from '@/hooks';
import { RefreshCcw } from 'lucide-react';

// Main DataTable component
export function ProductsTable({
	initialProducts,
}: {
	initialCategories?: GetCategoriesResponse;
	initialProducts?: GetProductsResponse;
}) {
	const [data, setData] = React.useState<Product[]>([]);
	const {
		data: products,
		isError: isProductsError,
		refetch: refreshProducts,
		isPending: isProductsPending,
	} = useProducts(initialProducts);
	const { mutateAsync } = useDeleteProduct();

	useEffect(() => {
		if (isProductsError) {
			toast.error('Error loading products');
		}
	}, [isProductsError]);

	useEffect(() => {
		if (products) {
			setData(products);
		}
	}, [products]);

	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [deletePopoverOpen, setDeletePopoverOpen] = React.useState(false);

	// Define the columns for the table with header (what to show at the top of the column) and cell (how to render each cell in that column)
	const columns: ColumnDef<Product>[] = [
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
			), // handle for selecting only for this cell
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'name',
			header: 'Name',
			cell: ({ row }) => {
				return <div className='font-medium'>{row.getValue('name')}</div>;
			},
			enableHiding: false,
		},
		{
			accessorKey: 'description',
			header: 'Description',
			cell: ({ row }) => {
				const description = row.getValue('description') as string;
				return (
					<div className='max-w-[300px] truncate text-sm text-muted-foreground'>
						{description}
					</div>
				);
			},
		},
		{
			accessorKey: 'price',
			header: 'Price',
			cell: ({ row }) => {
				const price = row.getValue('price') as number;
				return <div className='text-right'>{price}</div>;
			},
		},
		{
			accessorKey: 'manufacturer',
			header: 'Manufacturer',
			cell: ({ row }) => {
				const manufacturer = row.getValue('manufacturer') as string;
				return <div className='text-sm'>{manufacturer}</div>;
			},
		},
		{
			accessorKey: 'category.name',
			header: 'Category',
			cell: ({ row }) => {
				const category = (row.original as any).category?.name;
				return (
					<Badge variant='secondary' className='w-fit'>
						{category || 'Uncategorized'}
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
						<Link href={routes.admin.products.edit(row.original.id)}>
							<DropdownMenuItem>Edit</DropdownMenuItem>
						</Link>
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
			pagination,
		},
		getRowId: row => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	function handleDelete(id: number) {
		toast.promise(
			mutateAsync(id, {
				onError: (error: any) => {
					toast.error(
						error?.message || 'Error deleting product. Please try again.',
					);
				},
			}).then(() => {
				setData(prevData => prevData.filter(item => item.id !== id));
			}),
			{
				pending: 'Deleting product...',
				success: 'Product deleted successfully',
			},
		);
	}

	function handleDeleteMultiple() {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		if (selectedRows.length === 0) return;

		const selectedIds = selectedRows.map(row => (row.original as any).id);

		toast.promise(
			Promise.all(
				selectedIds.map(id =>
					mutateAsync(id, {
						onError: (error: any) => {
							toast.error(
								error?.message ||
									`Error deleting product with ID ${id}. Please try again.`,
							);
						},
					}),
				),
			).then(() => {
				setData(prevData =>
					prevData.filter(item => !selectedIds.includes(item.id)),
				);
				setRowSelection({});
				setDeletePopoverOpen(false);
			}),
			{
				pending: `Deleting ${selectedIds.length} product(s)...`,
				success: `${selectedIds.length} product(s) deleted successfully`,
				error: 'Error deleting products. Please try again.',
			},
		);
	}

	if (isProductsPending) {
		return (
			<div className='flex h-48 w-full items-center justify-center'>
				Loading products...
			</div>
		);
	}

	return (
		<div className='w-full flex-col justify-start gap-6 flex'>
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
											Delete products?
										</h4>
										<p className='text-sm text-muted-foreground'>
											You are about to delete{' '}
											{table.getFilteredSelectedRowModel().rows.length}{' '}
											product(s). This action cannot be undone.
										</p>
										<div className='max-h-32 overflow-y-auto rounded-md bg-muted p-2 text-xs'>
											{table.getFilteredSelectedRowModel().rows.map(row => (
												<div
													key={(row.original as any).id}
													className='truncate py-1'
												>
													• {(row.original as any).name}
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
									return await refreshProducts();
								},
								{
									pending: 'Refreshing products...',
									success: 'Products refreshed',
									error: 'Error refreshing products',
								},
							);
						}}
					>
						<RefreshCcw />
						<span className='hidden lg:inline'>Refresh</span>
					</Button>
					<Link href={routes.admin.products.create}>
						<Button variant='outline' size='sm' className='cursor-pointer'>
							<IconPlus />
							<span className='hidden lg:inline'>Add Product</span>
						</Button>
					</Link>
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
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className='flex w-full items-center gap-8 lg:w-fit'>
					<div className='hidden items-center gap-2 lg:flex'>
						<Label htmlFor='rows-per-page' className='text-sm font-medium'>
							Rows per page
						</Label>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={value => {
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger size='sm' className='w-20' id='rows-per-page'>
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
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
						Page {table.getState().pagination.pageIndex + 1} of{' '}
						{table.getPageCount()}
					</div>
					<div className='ml-auto flex items-center gap-2 lg:ml-0'>
						<Button
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Go to first page</span>
							<IconChevronsLeft />
						</Button>
						<Button
							variant='outline'
							className='size-8'
							size='icon'
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Go to previous page</span>
							<IconChevronLeft />
						</Button>
						<Button
							variant='outline'
							className='size-8'
							size='icon'
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className='sr-only'>Go to next page</span>
							<IconChevronRight />
						</Button>
						<Button
							variant='outline'
							className='hidden size-8 lg:flex'
							size='icon'
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
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
