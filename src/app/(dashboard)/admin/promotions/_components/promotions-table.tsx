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
import { toast } from 'react-toastify';
import { Promotion, GetPromotionsResponse } from '@/types';
import { useEffect } from 'react';
import { usePromotions, useDeletePromotion } from '@/hooks';
import { RefreshCcw } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import CreatePromotionForm from './create-promotion-form';
import EditPromotionForm from './edit-promotion-form';

export function PromotionsTable({
	initialPromotions,
}: {
	initialPromotions?: GetPromotionsResponse;
}) {
	const [data, setData] = React.useState<Promotion[]>([]);
	const {
		data: promotions,
		isError: isPromotionsError,
		refetch: refreshPromotions,
		isPending: isPromotionsPending,
	} = usePromotions(initialPromotions);
	const { mutateAsync } = useDeletePromotion();

	// Edit sheet state
	const [isEditOpen, setIsEditOpen] = React.useState(false);
	const [selectedPromotion, setSelectedPromotion] =
		React.useState<Promotion | null>(null);
	const [editFormKey, setEditFormKey] = React.useState(0);

	// Create sheet state
	const [isCreateOpen, setIsCreateOpen] = React.useState(false);
	const [createFormKey, setCreateFormKey] = React.useState(0);

	const handleEdit = (promotion: Promotion) => {
		setSelectedPromotion(promotion);
		setEditFormKey(Date.now());
		setIsEditOpen(true);
	};

	const handleEditSheetOpenChange = (open: boolean) => {
		setIsEditOpen(open);
		if (!open) {
			setSelectedPromotion(null);
		}
	};

	const handleCreate = () => {
		setCreateFormKey(Date.now());
		setIsCreateOpen(true);
	};

	const handleCreateSheetOpenChange = (open: boolean) => {
		setIsCreateOpen(open);
	};

	useEffect(() => {
		if (isPromotionsError) {
			toast.error('Lỗi khi tải khuyến mãi');
		}
	}, [isPromotionsError]);

	useEffect(() => {
		if (promotions) {
			setData(promotions);
		}
	}, [promotions]);

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

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const getStatusBadge = (promotion: Promotion) => {
		const now = new Date();
		const start = new Date(promotion.startDate);
		const end = new Date(promotion.endDate);

		if (now < start) {
			return <Badge variant='secondary'>Sắp diễn ra</Badge>;
		}
		if (now > end) {
			return <Badge variant='outline'>Hết hạn</Badge>;
		}
		return <Badge variant='default'>Đang hoạt động</Badge>;
	};

	const columns: ColumnDef<Promotion>[] = [
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
			accessorKey: 'code',
			header: 'Mã',
			cell: ({ row }) => {
				return (
					<div className='font-medium font-mono'>{row.getValue('code')}</div>
				);
			},
			enableHiding: false,
		},
		{
			accessorKey: 'description',
			header: 'Mô tả',
			cell: ({ row }) => {
				const description = row.getValue('description') as string;
				return (
					<div className='max-w-md truncate text-sm' title={description}>
						{description}
					</div>
				);
			},
		},
		{
			accessorKey: 'discountPercent',
			header: 'Giảm giá',
			cell: ({ row }) => {
				const discount = row.getValue('discountPercent') as number;
				return <div className='text-right font-semibold'>{discount}%</div>;
			},
		},
		{
			accessorKey: 'startDate',
			header: 'Ngày bắt đầu',
			cell: ({ row }) => {
				return (
					<div className='text-sm'>{formatDate(row.getValue('startDate'))}</div>
				);
			},
		},
		{
			accessorKey: 'endDate',
			header: 'Ngày kết thúc',
			cell: ({ row }) => {
				return (
					<div className='text-sm'>{formatDate(row.getValue('endDate'))}</div>
				);
			},
		},
		{
			id: 'status',
			header: 'Trạng thái',
			cell: ({ row }) => {
				return getStatusBadge(row.original);
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
					<DropdownMenuContent align='end' className='w-32'>
						<DropdownMenuItem onClick={() => handleEdit(row.original)}>
							Chỉnh sửa
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant='destructive'
							onClick={() => handleDelete(row.original.id)}
						>
							Xóa
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
	});

	function handleDelete(id: number) {
		mutateAsync(id, {
			onSuccess: () => {
				setData(prevData => prevData.filter(item => item.id !== id));
				toast.success('Đã xóa khuyến mãi thành công');
			},
			onError: (error: any) => {
				toast.error(
					error?.message || 'Lỗi khi xóa khuyến mãi. Vui lòng thử lại.',
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
								`Lỗi khi xóa khuyến mãi ID ${id}. Vui lòng thử lại.`,
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
				toast.success(`Đã xóa ${selectedIds.length} khuyến mãi thành công`);
			})
			.catch(() => {
				toast.error('Lỗi khi xóa khuyến mãi. Vui lòng thử lại.');
			});
	}

	if (isPromotionsPending) {
		return (
			<div className='flex h-48 w-full items-center justify-center'>
				Đang tải khuyến mãi...
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
										Xóa ({table.getFilteredSelectedRowModel().rows.length})
									</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-80'>
								<div className='space-y-4'>
									<div className='space-y-2'>
										<h4 className='font-medium leading-none'>
											Xóa khuyến mãi?
										</h4>
										<p className='text-sm text-muted-foreground'>
											Bạn sắp xóa{' '}
											{table.getFilteredSelectedRowModel().rows.length} khuyến
											mãi. Hành động này không thể hoàn tác.
										</p>
										<div className='max-h-32 overflow-y-auto rounded-md bg-muted p-2 text-xs'>
											{table.getFilteredSelectedRowModel().rows.map(row => (
												<div key={row.original.id} className='truncate py-1'>
													• {row.original.code}
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
											Hủy
										</Button>
										<Button
											variant='destructive'
											size='sm'
											onClick={handleDeleteMultiple}
										>
											Xóa
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
									return await refreshPromotions();
								},
								{
									pending: 'Đang làm mới...',
									success: 'Đã làm mới khuyến mãi',
									error: 'Lỗi khi làm mới khuyến mãi',
								},
							);
						}}
					>
						<RefreshCcw />
						<span className='hidden lg:inline'>Làm mới</span>
					</Button>
					<Button
						variant='outline'
						size='sm'
						className='cursor-pointer'
						onClick={handleCreate}
					>
						<IconPlus />
						<span className='hidden lg:inline'>Thêm khuyến mãi</span>
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
					{table.getFilteredSelectedRowModel().rows.length} /{' '}
					{table.getFilteredRowModel().rows.length} hàng đã chọn.
				</div>
				<div className='flex w-full items-center gap-8 lg:w-fit'>
					<div className='hidden items-center gap-2 lg:flex'>
						<Label htmlFor='rows-per-page' className='text-sm font-medium'>
							Hàng mỗi trang
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
						Trang {table.getState().pagination.pageIndex + 1} /{' '}
						{table.getPageCount()}
					</div>
					<div className='ml-auto flex items-center gap-2 lg:ml-0'>
						<Button
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Đến trang đầu</span>
							<IconChevronsLeft />
						</Button>
						<Button
							variant='outline'
							className='size-8'
							size='icon'
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Đến trang trước</span>
							<IconChevronLeft />
						</Button>
						<Button
							variant='outline'
							className='size-8'
							size='icon'
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className='sr-only'>Đến trang sau</span>
							<IconChevronRight />
						</Button>
						<Button
							variant='outline'
							className='hidden size-8 lg:flex'
							size='icon'
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className='sr-only'>Đến trang cuối</span>
							<IconChevronsRight />
						</Button>
					</div>
				</div>
			</div>

			{/* Edit Promotion Sheet */}
			<Sheet open={isEditOpen} onOpenChange={handleEditSheetOpenChange}>
				<SheetContent className='overflow-y-auto w-full sm:max-w-2xl'>
					<SheetHeader className='px-6'>
						<SheetTitle>Chỉnh sửa khuyến mãi</SheetTitle>
						<SheetDescription>
							Thay đổi thông tin khuyến mãi. Nhấn cập nhật khi hoàn tất.
						</SheetDescription>
					</SheetHeader>
					{selectedPromotion && (
						<EditPromotionForm
							key={editFormKey}
							promotion={selectedPromotion}
							onSuccess={() => {
								setIsEditOpen(false);
								refreshPromotions();
							}}
						/>
					)}
				</SheetContent>
			</Sheet>

			{/* Create Promotion Sheet */}
			<Sheet open={isCreateOpen} onOpenChange={handleCreateSheetOpenChange}>
				<SheetContent className='overflow-y-auto w-full sm:max-w-2xl'>
					<SheetHeader className='px-6'>
						<SheetTitle>Tạo khuyến mãi mới</SheetTitle>
						<SheetDescription>
							Thêm khuyến mãi mới vào hệ thống.
						</SheetDescription>
					</SheetHeader>
					<CreatePromotionForm
						key={createFormKey}
						onSuccess={() => {
							setIsCreateOpen(false);
							refreshPromotions();
						}}
					/>
				</SheetContent>
			</Sheet>
		</div>
	);
}
