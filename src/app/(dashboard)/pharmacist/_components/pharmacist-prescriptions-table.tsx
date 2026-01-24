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
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import {
	Prescription,
	PrescriptionStatus,
	GetAllPrescriptionsForPharmacistResponse,
} from '@/types';
import { useEffect, useState } from 'react';
import { usePharmacistPrescriptions } from '@/hooks/prescriptions/use-pharmacist-prescriptions';
import { RefreshCcw, Search, X, Eye, CheckCircle, XCircle } from 'lucide-react';
import { PrescriptionDetailsSheet } from './prescription-details-sheet';
import { ApprovePrescriptionDialog } from './approve-prescription-dialog';
import { RejectPrescriptionDialog } from './reject-prescription-dialog';

export function PharmacistPrescriptionsTable({
	initialPrescriptions,
}: {
	initialPrescriptions?: GetAllPrescriptionsForPharmacistResponse;
}) {
	const [statusFilter, setStatusFilter] = useState<PrescriptionStatus | 'all'>(
		'all',
	);
	const [searchInput, setSearchInput] = useState('');
	const [fromDateInput, setFromDateInput] = useState('');
	const [toDateInput, setToDateInput] = useState('');
	const [data, setData] = useState<Prescription[]>([]);

	// Dialog/Sheet states
	const [selectedPrescription, setSelectedPrescription] =
		useState<Prescription | null>(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [isApproveOpen, setIsApproveOpen] = useState(false);
	const [isRejectOpen, setIsRejectOpen] = useState(false);

	// Build API params from filters
	const [keyword, setKeyword] = useState('');
	const [fromDate, setFromDate] = useState<string | undefined>();
	const [toDate, setToDate] = useState<string | undefined>();

	// Debounce search
	useEffect(() => {
		const timeout = setTimeout(() => {
			setKeyword(searchInput);
		}, 500);
		return () => clearTimeout(timeout);
	}, [searchInput]);

	// Debounce date filters
	useEffect(() => {
		const timeout = setTimeout(() => {
			setFromDate(fromDateInput || undefined);
			setToDate(toDateInput || undefined);
		}, 500);
		return () => clearTimeout(timeout);
	}, [fromDateInput, toDateInput]);

	const {
		data: response,
		isError,
		refetch: refreshPrescriptions,
		isPending,
	} = usePharmacistPrescriptions(
		{
			status: statusFilter === 'all' ? undefined : statusFilter,
			keyword,
			fromDate,
			toDate,
		},
		initialPrescriptions,
	);

	useEffect(() => {
		if (isError) {
			toast.error('Lỗi khi tải danh sách đơn thuốc');
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

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getPrescriptionStatusLabel = (status: PrescriptionStatus) => {
		switch (status) {
			case PrescriptionStatus.PENDING:
				return 'Chờ duyệt';
			case PrescriptionStatus.APPROVED:
				return 'Đã duyệt';
			case PrescriptionStatus.REJECTED:
				return 'Đã từ chối';
			default:
				return status;
		}
	};

	const getPrescriptionStatusBadgeVariant = (status: PrescriptionStatus) => {
		switch (status) {
			case PrescriptionStatus.PENDING:
				return 'secondary';
			case PrescriptionStatus.APPROVED:
				return 'default';
			case PrescriptionStatus.REJECTED:
				return 'destructive';
			default:
				return 'secondary';
		}
	};

	const handleViewDetails = (prescription: Prescription) => {
		setSelectedPrescription(prescription);
		setIsDetailsOpen(true);
	};

	const handleApprove = (prescription: Prescription) => {
		setSelectedPrescription(prescription);
		setIsApproveOpen(true);
	};

	const handleReject = (prescription: Prescription) => {
		setSelectedPrescription(prescription);
		setIsRejectOpen(true);
	};

	const clearFilters = () => {
		setSearchInput('');
		setFromDateInput('');
		setToDateInput('');
		setStatusFilter('all');
	};

	const columns: ColumnDef<Prescription>[] = [
		{
			accessorKey: 'id',
			header: 'Mã đơn',
			cell: ({ row }) => {
				return <div className='font-medium'>#{row.getValue('id')}</div>;
			},
			enableHiding: false,
		},
		{
			accessorKey: 'user.fullName',
			header: 'Bệnh nhân',
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
			accessorKey: 'uploadedAt',
			header: 'Ngày tải lên',
			cell: ({ row }) => {
				const date = row.getValue('uploadedAt') as string;
				return <div className='text-sm'>{formatDate(date)}</div>;
			},
		},
		{
			accessorKey: 'status',
			header: 'Trạng thái',
			cell: ({ row }) => {
				const status = row.getValue('status') as PrescriptionStatus;
				return (
					<Badge
						variant={getPrescriptionStatusBadgeVariant(status)}
						className='w-fit'
					>
						{getPrescriptionStatusLabel(status)}
					</Badge>
				);
			},
		},
		{
			accessorKey: 'pharmacist.fullName',
			header: 'Dược sĩ',
			cell: ({ row }) => {
				const pharmacist = row.original.pharmacist;
				if (!pharmacist) {
					return <div className='text-sm text-muted-foreground'>Chưa phân</div>;
				}
				return <div className='text-sm'>{pharmacist.fullName}</div>;
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
						<DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
							<Eye className='mr-2 size-4' />
							Xem chi tiết
						</DropdownMenuItem>
						{row.original.status === PrescriptionStatus.PENDING && (
							<>
								<DropdownMenuItem onClick={() => handleApprove(row.original)}>
									<CheckCircle className='mr-2 size-4' />
									Duyệt đơn
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleReject(row.original)}
									variant='destructive'
								>
									<XCircle className='mr-2 size-4' />
									Từ chối
								</DropdownMenuItem>
							</>
						)}
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
				Đang tải danh sách đơn thuốc...
			</div>
		);
	}

	return (
		<>
			<div className='w-full flex-col justify-start gap-6 flex'>
				{/* Filter Bar */}
				<div className='space-y-4 px-4 lg:px-6'>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{/* Search */}
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								placeholder='Tìm kiếm theo tên bệnh nhân...'
								value={searchInput}
								onChange={e => setSearchInput(e.target.value)}
								className='pl-9'
							/>
						</div>

						{/* Status Filter */}
						<Select
							value={statusFilter}
							onValueChange={value => {
								setStatusFilter(value as PrescriptionStatus | 'all');
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder='Tất cả trạng thái' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>Tất cả trạng thái</SelectItem>
								<SelectItem value={PrescriptionStatus.PENDING}>
									Chờ duyệt
								</SelectItem>
								<SelectItem value={PrescriptionStatus.APPROVED}>
									Đã duyệt
								</SelectItem>
								<SelectItem value={PrescriptionStatus.REJECTED}>
									Đã từ chối
								</SelectItem>
							</SelectContent>
						</Select>

						{/* Date Range - From */}
						<Input
							type='date'
							placeholder='Từ ngày'
							value={fromDateInput}
							onChange={e => setFromDateInput(e.target.value)}
						/>
					</div>

					{/* Second row - To Date and clear button */}
					<div className='flex items-center gap-4'>
						<Input
							type='date'
							placeholder='Đến ngày'
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
							Xóa bộ lọc
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
										return await refreshPrescriptions();
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
										Không có đơn thuốc nào.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				<div className='flex items-center justify-between px-4 lg:px-6'>
					<div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
						Tổng cộng {data.length} đơn thuốc.
					</div>
				</div>
			</div>

			{/* Dialogs/Sheets */}
			{selectedPrescription && (
				<>
					<PrescriptionDetailsSheet
						prescription={selectedPrescription}
						open={isDetailsOpen}
						onOpenChange={setIsDetailsOpen}
					/>
					<ApprovePrescriptionDialog
						prescription={selectedPrescription}
						open={isApproveOpen}
						onOpenChange={setIsApproveOpen}
					/>
					<RejectPrescriptionDialog
						prescription={selectedPrescription}
						open={isRejectOpen}
						onOpenChange={setIsRejectOpen}
					/>
				</>
			)}
		</>
	);
}
