'use client';

import { Prescription, PrescriptionStatus } from '@/types';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Calendar, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface PrescriptionDetailsSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	prescription: Prescription;
}

export function PrescriptionDetailsSheet({
	open,
	onOpenChange,
	prescription,
}: PrescriptionDetailsSheetProps) {
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

	const isImage = (url: string) => {
		return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='w-full overflow-y-auto sm:max-w-2xl p-6'>
				<SheetHeader className='mb-6'>
					<SheetTitle className='flex items-center gap-2'>
						<FileText className='text-green-600' size={20} />
						<span className='text-base'>Đơn thuốc #{prescription.id}</span>
					</SheetTitle>
				</SheetHeader>

				<div className='space-y-6'>
					{/* Status */}
					<div className='flex items-center gap-2 pb-5 border-b'>
						<Badge
							variant={getPrescriptionStatusBadgeVariant(prescription.status)}
							className='font-medium'
						>
							{getPrescriptionStatusLabel(prescription.status)}
						</Badge>
						<span className='text-xs text-gray-500'>
							{formatDate(prescription.uploadedAt)}
						</span>
					</div>

					{/* Patient Information */}
					<div className='pb-5 border-b'>
						<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
							<User className='size-4 text-green-600' />
							Thông tin bệnh nhân
						</h3>
						<div className='bg-gray-50 rounded-lg p-4 space-y-2.5 text-xs'>
							<div className='flex gap-2'>
								<span className='font-medium text-gray-600 w-28 flex-shrink-0'>
									Họ tên:
								</span>
								<span className='text-gray-900'>
									{prescription.user?.fullName || 'N/A'}
								</span>
							</div>
							<div className='flex gap-2'>
								<span className='font-medium text-gray-600 w-28 flex-shrink-0'>
									Email:
								</span>
								<span className='text-gray-900'>
									{prescription.user?.email || 'N/A'}
								</span>
							</div>
						</div>
					</div>

					{/* Prescription File */}
					<div className='pb-5 border-b'>
						<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
							<FileText className='size-4 text-green-600' />
							Đơn thuốc
						</h3>
						<div className='bg-gray-50 rounded-lg p-4'>
							{isImage(prescription.fileUrl) ? (
								<div className='relative w-full max-w-md mx-auto aspect-[3/4] bg-white rounded-md overflow-hidden border border-gray-200'>
									<Image
										src={prescription.fileUrl}
										alt='Đơn thuốc'
										fill
										className='object-contain'
									/>
								</div>
							) : (
								<a
									href={prescription.fileUrl}
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center justify-center gap-2 p-4 text-sm text-green-600 hover:text-green-700 hover:underline transition-colors'
								>
									<FileText className='size-4' />
									Xem file đơn thuốc
								</a>
							)}
						</div>
					</div>

					{/* Status & Dates */}
					<div className='pb-5 border-b'>
						<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
							<Calendar className='size-4 text-green-600' />
							Thông tin đơn thuốc
						</h3>
						<div className='bg-gray-50 rounded-lg p-4 space-y-2.5 text-xs'>
							<div className='flex justify-between items-center'>
								<span className='text-gray-600'>Trạng thái:</span>
								<Badge
									variant={getPrescriptionStatusBadgeVariant(
										prescription.status,
									)}
									className='text-xs py-0.5 px-2'
								>
									{getPrescriptionStatusLabel(prescription.status)}
								</Badge>
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-gray-600'>Ngày tải lên:</span>
								<span className='text-gray-900'>
									{formatDate(prescription.uploadedAt)}
								</span>
							</div>
							{prescription.pharmacist && (
								<div className='flex justify-between items-center'>
									<span className='text-gray-600'>Dược sĩ:</span>
									<span className='text-gray-900 font-medium'>
										{prescription.pharmacist.fullName}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Approved Items */}
					{prescription.status === PrescriptionStatus.APPROVED &&
						prescription.items &&
						prescription.items.length > 0 && (
							<div className='pb-5'>
								<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
									<CheckCircle className='size-4 text-green-600' />
									Thuốc đã duyệt ({prescription.items.length})
								</h3>
								<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
									{prescription.items.map((item, index) => (
										<div
											key={index}
											className='flex items-start justify-between gap-3 pb-3 last:pb-0 border-b last:border-0'
										>
											<div className='flex-1 min-w-0'>
												<p className='text-sm font-medium text-gray-900 line-clamp-2'>
													{item.product?.name || `Sản phẩm #${item.productId}`}
												</p>
												<p className='text-xs text-gray-500 mt-0.5'>
													Số lượng: {item.quantity}
												</p>
											</div>
											{item.product?.price && (
												<div className='text-right flex-shrink-0'>
													<p className='text-sm font-semibold text-gray-900'>
														{parseFloat(item.product.price).toLocaleString(
															'vi-VN',
														)}{' '}
														₫
													</p>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
