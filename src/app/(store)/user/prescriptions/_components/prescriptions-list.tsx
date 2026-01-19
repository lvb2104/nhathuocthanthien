'use client';

import { useState } from 'react';
import { useMyPrescriptions } from '@/hooks';
import {
	GetMyPrescriptionsResponse,
	PrescriptionStatus,
	Prescription,
} from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
	getPrescriptionStatusConfig,
	formatPrescriptionDate,
} from './prescription-utils';
import {
	FileImage,
	ChevronLeft,
	ChevronRight,
	Plus,
	ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/configs/routes';
import PrescriptionDetailSheet from './prescription-detail-sheet';
import UploadPrescriptionDialog from './upload-prescription-dialog';

type PrescriptionsListProps = {
	initialData?: GetMyPrescriptionsResponse;
};

const STATUS_FILTERS = [
	{ value: null, label: 'Tất cả' },
	{ value: PrescriptionStatus.PENDING, label: 'Chờ duyệt' },
	{ value: PrescriptionStatus.APPROVED, label: 'Đã duyệt' },
	{ value: PrescriptionStatus.REJECTED, label: 'Từ chối' },
] as const;

export default function PrescriptionsList({
	initialData,
}: PrescriptionsListProps) {
	const [selectedStatus, setSelectedStatus] =
		useState<PrescriptionStatus | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedPrescription, setSelectedPrescription] =
		useState<Prescription | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	// Fetch prescriptions with filters and pagination
	const { data, isLoading, error } = useMyPrescriptions(
		{
			status: selectedStatus || undefined,
			page: currentPage,
			limit: 10,
		},
		initialData,
	);

	const prescriptions = data?.data || [];
	const pagination = data?.pagination;

	const handleStatusFilter = (status: PrescriptionStatus | null) => {
		setSelectedStatus(status);
		setCurrentPage(1);
	};

	const handleNextPage = () => {
		if (pagination && currentPage < pagination.totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	if (error) {
		return (
			<div className='min-h-screen flex items-center justify-center p-4'>
				<div className='w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8'>
					<p className='text-red-500 text-lg text-center'>
						Không thể tải danh sách đơn thuốc. Vui lòng thử lại sau.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4'>
			<div className='w-full max-w-6xl mx-auto'>
				{/* Header */}
				<div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-6'>
					<div className='flex items-center justify-between mb-6'>
						<div className='flex items-center gap-3'>
							<FileImage className='text-green-600' size={32} />
							<div>
								<h1 className='text-2xl font-bold text-gray-900'>
									Đơn thuốc của bạn
								</h1>
								{pagination && (
									<p className='text-sm text-gray-600 mt-1'>
										{pagination.totalItems} đơn thuốc
									</p>
								)}
							</div>
						</div>
						<div className='flex gap-2'>
							<UploadPrescriptionDialog>
								<Button className='bg-green-600 hover:bg-green-700 gap-2'>
									<Plus size={18} />
									<span className='hidden sm:inline'>Tải đơn mới</span>
								</Button>
							</UploadPrescriptionDialog>
							<Link href={routes.home}>
								<Button variant='outline' className='gap-2'>
									<ShoppingBag size={18} />
									<span className='hidden sm:inline'>Mua sắm</span>
								</Button>
							</Link>
						</div>
					</div>

					{/* Status Filter Tabs */}
					<div className='flex flex-wrap gap-2'>
						{STATUS_FILTERS.map(filter => {
							const isActive = selectedStatus === filter.value;
							return (
								<button
									key={filter.label}
									onClick={() => handleStatusFilter(filter.value)}
									className={`px-4 py-2 rounded-lg font-medium transition-colors ${
										isActive
											? 'bg-green-600 text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									{filter.label}
								</button>
							);
						})}
					</div>
				</div>

				{/* Prescriptions List */}
				<div className='space-y-4'>
					{isLoading ? (
						// Loading skeleton
						Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className='bg-white rounded-xl shadow border border-gray-200 p-6'
							>
								<Skeleton className='h-6 w-32 mb-4' />
								<Skeleton className='h-20 w-full' />
							</div>
						))
					) : prescriptions.length === 0 ? (
						// Empty state
						<div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center'>
							<FileImage className='mx-auto text-gray-400 mb-4' size={64} />
							<p className='text-gray-500 text-lg mb-2'>
								{selectedStatus
									? 'Không tìm thấy đơn thuốc nào'
									: 'Bạn chưa có đơn thuốc nào'}
							</p>
							<p className='text-gray-400 text-sm mb-6'>
								{selectedStatus
									? 'Thử thay đổi bộ lọc để xem đơn thuốc khác'
									: 'Tải lên đơn thuốc để được dược sĩ tư vấn'}
							</p>
							<UploadPrescriptionDialog>
								<Button className='bg-green-600 hover:bg-green-700'>
									Tải đơn thuốc mới
								</Button>
							</UploadPrescriptionDialog>
						</div>
					) : (
						// Prescription cards
						prescriptions.map(prescription => {
							const statusConfig = getPrescriptionStatusConfig(
								prescription.status,
							);

							return (
								<div
									key={prescription.id}
									onClick={() => {
										setSelectedPrescription(prescription);
										setIsDetailOpen(true);
									}}
									className='bg-white rounded-xl shadow hover:shadow-md transition-shadow border border-gray-200 p-6 cursor-pointer'
								>
									<div className='flex items-start gap-4'>
										{/* Thumbnail */}
										<div className='relative w-20 h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200'>
											<Image
												src={prescription.fileUrl}
												alt={`Đơn thuốc #${prescription.id}`}
												fill
												className='object-cover'
											/>
										</div>

										{/* Content */}
										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-3 mb-2'>
												<h3 className='font-semibold text-gray-900'>
													Đơn thuốc #{prescription.id}
												</h3>
												<Badge
													variant={statusConfig.variant}
													className={statusConfig.className}
												>
													{statusConfig.label}
												</Badge>
											</div>
											<p className='text-sm text-gray-600 mb-2'>
												{formatPrescriptionDate(prescription.uploadedAt)}
											</p>
											{prescription.pharmacist && (
												<p className='text-sm text-gray-500'>
													Xử lý bởi: {prescription.pharmacist.fullName}
												</p>
											)}
											{prescription.status === PrescriptionStatus.APPROVED &&
												prescription.items && (
													<p className='text-sm text-green-600 mt-1'>
														{prescription.items.length} sản phẩm được kê
													</p>
												)}
										</div>

										{/* Action */}
										<Button
											variant='outline'
											size='sm'
											className='gap-1 flex-shrink-0'
											onClick={e => {
												e.stopPropagation();
												setSelectedPrescription(prescription);
												setIsDetailOpen(true);
											}}
										>
											Chi tiết
											<ChevronRight size={16} />
										</Button>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Pagination */}
				{pagination && pagination.totalPages > 1 && (
					<div className='bg-white rounded-xl shadow border border-gray-200 p-4 mt-6'>
						<div className='flex items-center justify-between'>
							<p className='text-sm text-gray-600'>
								Trang {pagination.page} / {pagination.totalPages}
							</p>
							<div className='flex gap-2'>
								<Button
									variant='outline'
									size='sm'
									onClick={handlePrevPage}
									disabled={currentPage === 1}
									className='gap-2'
								>
									<ChevronLeft size={16} />
									Trước
								</Button>
								<Button
									variant='outline'
									size='sm'
									onClick={handleNextPage}
									disabled={currentPage >= pagination.totalPages}
									className='gap-2'
								>
									Sau
									<ChevronRight size={16} />
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Prescription Detail Sheet */}
			<PrescriptionDetailSheet
				prescription={selectedPrescription}
				open={isDetailOpen}
				onOpenChange={setIsDetailOpen}
			/>
		</div>
	);
}
