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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'react-toastify';
import {
	GetAllUsersResponse,
	UserFilterParams,
	UserInfo,
	UserRole,
} from '@/types';
import { useEffect } from 'react';
import { useUsers, useLockUser, useRestoreUser } from '@/hooks';
import { RefreshCcw, Search, X } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import AssignAccountForm from './assign-account-form';

export function UsersTable({
	initialUsers,
}: {
	initialUsers?: GetAllUsersResponse;
}) {
	// API Filter params state
	const [apiParams, setApiParams] = React.useState<UserFilterParams>({
		page: 1,
		limit: 10,
		keyword: '',
		role: undefined as UserRole | undefined,
		isActive: undefined as boolean | undefined,
	});

	// Local filter inputs (for debouncing)
	const [searchInput, setSearchInput] = React.useState('');

	const [data, setData] = React.useState<UserInfo[]>([]);
	const {
		data: response,
		isError: isUsersError,
		refetch: refreshUsers,
		isPending: isUsersPending,
	} = useUsers(apiParams, initialUsers);
	const { mutateAsync: lockMutate } = useLockUser();
	const { mutateAsync: restoreMutate } = useRestoreUser();

	// Create sheet state
	const [isCreateOpen, setIsCreateOpen] = React.useState(false);
	const [createFormKey, setCreateFormKey] = React.useState(0);

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
		if (isUsersError) {
			toast.error('Lỗi khi tải người dùng');
		}
	}, [isUsersError]);

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
			role: undefined,
			isActive: undefined,
			includeDeleted: undefined,
		});
	};

	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [lockPopoverOpen, setLockPopoverOpen] = React.useState(false);

	// Check if user is locked/deleted (soft delete)
	const isUserLocked = (user: UserInfo) => {
		return user.deletedAt !== null;
	};

	const columns: ColumnDef<UserInfo>[] = [
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
			accessorKey: 'fullName',
			header: 'Họ và tên',
			cell: ({ row }) => {
				return <div className='font-medium'>{row.getValue('fullName')}</div>;
			},
			enableHiding: false,
		},
		{
			accessorKey: 'email',
			header: 'Email',
			cell: ({ row }) => {
				return <div className='text-sm'>{row.getValue('email')}</div>;
			},
			enableHiding: false,
		},
		{
			accessorKey: 'phone',
			header: 'Số điện thoại',
			cell: ({ row }) => {
				const phone = row.getValue('phone') as string;
				return <div className='text-sm'>{phone || '-'}</div>;
			},
		},
		{
			accessorKey: 'roles.name',
			header: 'Vai trò',
			cell: ({ row }) => {
				const role = (row.original as any).roles?.name;
				const roleMap: Record<string, string> = {
					customer: 'Khách hàng',
					pharmacist: 'Dược sĩ',
					employee: 'Nhân viên giao hàng',
					admin: 'Quản trị viên',
				};
				return (
					<Badge variant='secondary' className='w-fit'>
						{role ? roleMap[role] || role : '-'}
					</Badge>
				);
			},
		},
		{
			id: 'emailStatus',
			header: 'Xác thực Email',
			cell: ({ row }) => {
				const isVerified = row.original.isActive;
				return (
					<Badge
						variant={isVerified ? 'default' : 'secondary'}
						className='w-fit'
					>
						{isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
					</Badge>
				);
			},
		},
		{
			id: 'accountStatus',
			header: 'Trạng thái tài khoản',
			cell: ({ row }) => {
				const isLocked = isUserLocked(row.original);
				return (
					<Badge
						variant={isLocked ? 'destructive' : 'default'}
						className='w-fit'
					>
						{isLocked ? 'Đã khóa' : 'Đang hoạt động'}
					</Badge>
				);
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const isLocked = isUserLocked(row.original);
				return (
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
							{isLocked ? (
								<DropdownMenuItem
									onClick={() => handleRestore(row.original.id)}
								>
									Khôi phục
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									variant='destructive'
									onClick={() => handleLock(row.original.id)}
								>
									Khóa
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
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

	function handleLock(id: number) {
		toast.promise(
			lockMutate(id).then(() => {
				setData(prevData => prevData.filter(item => item.id !== id));
			}),
			{
				pending: 'Đang khóa người dùng...',
				success: 'Đã khóa người dùng thành công',
				error: 'Lỗi khi khóa người dùng. Vui lòng thử lại.',
			},
		);
	}

	function handleRestore(id: number) {
		toast.promise(
			restoreMutate(id).then(() => {
				setData(prevData => prevData.filter(item => item.id !== id));
			}),
			{
				pending: 'Đang khôi phục người dùng...',
				success: 'Đã khôi phục người dùng thành công',
				error: 'Lỗi khi khôi phục người dùng. Vui lòng thử lại.',
			},
		);
	}

	function handleLockMultiple() {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		if (selectedRows.length === 0) return;

		const activeUsers = selectedRows.filter(row => !isUserLocked(row.original));
		const selectedIds = activeUsers.map(row => row.original.id);

		toast.promise(
			Promise.all(selectedIds.map(id => lockMutate(id))).then(() => {
				setData(prevData =>
					prevData.filter(item => !selectedIds.includes(item.id)),
				);
				setRowSelection({});
				setLockPopoverOpen(false);
			}),
			{
				pending: `Đang khóa ${selectedIds.length} người dùng...`,
				success: `Đã khóa ${selectedIds.length} người dùng thành công`,
				error: 'Lỗi khi khóa người dùng. Vui lòng thử lại.',
			},
		);
	}

	function handleRestoreMultiple() {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		if (selectedRows.length === 0) return;

		const lockedUsers = selectedRows.filter(row => isUserLocked(row.original));
		const selectedIds = lockedUsers.map(row => row.original.id);

		toast.promise(
			Promise.all(selectedIds.map(id => restoreMutate(id))).then(() => {
				setData(prevData =>
					prevData.filter(item => !selectedIds.includes(item.id)),
				);
				setRowSelection({});
			}),
			{
				pending: `Đang khôi phục ${selectedIds.length} người dùng...`,
				success: `Đã khôi phục ${selectedIds.length} người dùng thành công`,
				error: 'Lỗi khi khôi phục người dùng. Vui lòng thử lại.',
			},
		);
	}

	if (isUsersPending) {
		return (
			<div className='flex h-48 w-full items-center justify-center'>
				Đang tải người dùng...
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
							placeholder='Tìm theo email hoặc tên...'
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
							className='pl-9'
						/>
					</div>

					{/* Role Filter */}
					<Select
						value={apiParams.role || 'all'}
						onValueChange={value => {
							setApiParams(prev => ({
								...prev,
								role: value === 'all' ? undefined : (value as UserRole),
								page: 1,
							}));
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder='Tất cả vai trò' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Tất cả vai trò</SelectItem>
							<SelectItem value={UserRole.CUSTOMER}>Khách hàng</SelectItem>
							<SelectItem value={UserRole.ADMIN}>Quản trị viên</SelectItem>
							<SelectItem value={UserRole.PHARMACIST}>Dược sĩ</SelectItem>
							<SelectItem value={UserRole.EMPLOYEE}>
								Nhân viên giao hàng
							</SelectItem>
						</SelectContent>
					</Select>

					{/* Status Filter */}
					<Select
						value={
							apiParams.isActive === undefined
								? 'all'
								: apiParams.isActive
									? 'verified'
									: 'unverified'
						}
						onValueChange={value => {
							setApiParams(prev => ({
								...prev,
								isActive:
									value === 'all'
										? undefined
										: value === 'verified'
											? true
											: false,
								page: 1,
							}));
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder='Tất cả trạng thái' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Tất cả trạng thái</SelectItem>
							<SelectItem value='verified'>Đã xác thực</SelectItem>
							<SelectItem value='unverified'>Chưa xác thực</SelectItem>
						</SelectContent>
					</Select>

					{/* Include Deleted Filter (Checkbox) */}
					<div className='flex items-center gap-2'>
						<Checkbox
							id='include-deleted'
							checked={apiParams.includeDeleted === true}
							onCheckedChange={checked => {
								setApiParams(prev => ({
									...prev,
									includeDeleted: checked ? true : undefined,
									page: 1,
								}));
							}}
						/>
						<Label
							htmlFor='include-deleted'
							className='text-sm font-medium cursor-pointer'
						>
							Bao gồm người dùng đã bị khóa
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
						Xóa bộ lọc
					</Button>
				</div>
			</div>

			{/* Toolbar */}
			<div className='flex items-center justify-between px-4 lg:px-6'>
				<div className='flex items-center gap-2'>
					{table.getFilteredSelectedRowModel().rows.length > 0 &&
						(() => {
							const selectedRows = table.getFilteredSelectedRowModel().rows;
							const activeUsers = selectedRows.filter(
								row => !isUserLocked(row.original),
							);
							const lockedUsers = selectedRows.filter(row =>
								isUserLocked(row.original),
							);

							return (
								<>
									{activeUsers.length > 0 && (
										<Popover
											open={lockPopoverOpen}
											onOpenChange={setLockPopoverOpen}
										>
											<PopoverTrigger asChild>
												<Button
													variant='destructive'
													size='sm'
													className='cursor-pointer'
												>
													<span>Khóa ({activeUsers.length})</span>
												</Button>
											</PopoverTrigger>
											<PopoverContent className='w-80'>
												<div className='space-y-4'>
													<div className='space-y-2'>
														<h4 className='font-medium leading-none'>
															Khóa người dùng?
														</h4>
														<p className='text-sm text-muted-foreground'>
															Bạn sắp khóa {activeUsers.length} người dùng. Họ
															sẽ không còn quyền truy cập hệ thống.
														</p>
														<div className='max-h-32 overflow-y-auto rounded-md bg-muted p-2 text-xs'>
															{activeUsers.map(row => (
																<div
																	key={row.original.id}
																	className='truncate py-1'
																>
																	• {row.original.fullName} (
																	{row.original.email})
																</div>
															))}
														</div>
													</div>
													<div className='flex gap-2 justify-end'>
														<Button
															variant='outline'
															size='sm'
															onClick={() => setLockPopoverOpen(false)}
														>
															Hủy
														</Button>
														<Button
															variant='destructive'
															size='sm'
															onClick={handleLockMultiple}
														>
															Khóa
														</Button>
													</div>
												</div>
											</PopoverContent>
										</Popover>
									)}
									{lockedUsers.length > 0 && (
										<Button
											variant='default'
											size='sm'
											className='cursor-pointer'
											onClick={handleRestoreMultiple}
										>
											<span>Khôi phục ({lockedUsers.length})</span>
										</Button>
									)}
								</>
							);
						})()}
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
									return await refreshUsers();
								},
								{
									pending: 'Đang làm mới...',
									success: 'Đã làm mới người dùng',
									error: 'Lỗi khi làm mới người dùng',
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
						<span className='hidden lg:inline'>Thêm người dùng</span>
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
					{table.getFilteredSelectedRowModel().rows.length} hàng đã chọn. Tổng
					cộng {response?.pagination?.totalItems ?? 0} hàng.
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

			{/* Create User Sheet */}
			<Sheet open={isCreateOpen} onOpenChange={handleCreateSheetOpenChange}>
				<SheetContent className='overflow-y-auto w-full sm:max-w-2xl'>
					<SheetHeader className='px-6'>
						<SheetTitle>Cấp tài khoản mới</SheetTitle>
						<SheetDescription>
							Cấp tài khoản mới cho nhân viên hoặc dược sĩ.
						</SheetDescription>
					</SheetHeader>
					<AssignAccountForm
						key={createFormKey}
						onSuccess={() => {
							setIsCreateOpen(false);
							refreshUsers();
						}}
					/>
				</SheetContent>
			</Sheet>
		</div>
	);
}
