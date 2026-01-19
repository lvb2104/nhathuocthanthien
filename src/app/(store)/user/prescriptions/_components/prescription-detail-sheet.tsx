'use client';

import { Prescription } from '@/types';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
	getPrescriptionStatusConfig,
	formatPrescriptionDate,
} from './prescription-utils';
import {
	FileImage,
	User,
	Package,
	CheckCircle,
	XCircle,
	Clock,
} from 'lucide-react';
import Image from 'next/image';
import { PrescriptionStatus } from '@/types';

type PrescriptionDetailSheetProps = {
	prescription: Prescription | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export default function PrescriptionDetailSheet({
	prescription,
	open,
	onOpenChange,
}: PrescriptionDetailSheetProps) {
	if (!prescription) return null;

	const statusConfig = getPrescriptionStatusConfig(prescription.status);

	const getStatusIcon = () => {
		switch (prescription.status) {
			case PrescriptionStatus.APPROVED:
				return <CheckCircle className='text-green-600' size={20} />;
			case PrescriptionStatus.REJECTED:
				return <XCircle className='text-red-600' size={20} />;
			default:
				return <Clock className='text-yellow-600' size={20} />;
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='w-full overflow-y-auto sm:max-w-2xl p-6'>
				<SheetHeader className='mb-6'>
					<SheetTitle className='flex items-center gap-2'>
						<FileImage className='text-green-600' size={20} />
						<span className='text-base'>Đơn thuốc #{prescription.id}</span>
					</SheetTitle>
				</SheetHeader>

				<div className='space-y-6'>
					{/* Status */}
					<div className='flex items-center gap-2 pb-5 border-b'>
						{getStatusIcon()}
						<Badge
							variant={statusConfig.variant}
							className={statusConfig.className}
						>
							{statusConfig.label}
						</Badge>
						<span className='text-xs text-gray-500'>
							{formatPrescriptionDate(prescription.uploadedAt)}
						</span>
					</div>

					{/* Prescription Image */}
					<div className='pb-5 border-b'>
						<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
							<FileImage size={16} className='text-green-600' />
							Hình ảnh đơn thuốc
						</h3>
						<div className='relative aspect-[3/4] w-full max-w-md mx-auto rounded-lg overflow-hidden bg-gray-100 border border-gray-200'>
							<Image
								src={prescription.fileUrl}
								alt={`Đơn thuốc #${prescription.id}`}
								fill
								className='object-contain'
							/>
						</div>
					</div>

					{/* Pharmacist Info (if processed) */}
					{prescription.pharmacist && (
						<div className='pb-5 border-b'>
							<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
								<User size={16} className='text-green-600' />
								Dược sĩ xử lý
							</h3>
							<div className='bg-gray-50 rounded-lg p-4'>
								<p className='text-sm text-gray-900'>
									{prescription.pharmacist.fullName}
								</p>
							</div>
						</div>
					)}

					{/* Approved Items (if approved) */}
					{prescription.status === PrescriptionStatus.APPROVED &&
						prescription.items &&
						prescription.items.length > 0 && (
							<div className='pb-5'>
								<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
									<Package size={16} className='text-green-600' />
									Thuốc được kê ({prescription.items.length})
								</h3>
								<div className='space-y-3'>
									{prescription.items.map((item, index) => (
										<div
											key={index}
											className='flex items-center justify-between bg-gray-50 rounded-lg p-3'
										>
											<div className='flex-1'>
												<p className='text-sm font-medium text-gray-900'>
													{item.product?.name || `Sản phẩm #${item.productId}`}
												</p>
												{item.product?.price && (
													<p className='text-xs text-gray-500'>
														{Number(item.product.price).toLocaleString('vi-VN')}
														đ
													</p>
												)}
											</div>
											<div className='text-right'>
												<span className='text-sm font-semibold text-green-600'>
													x{item.quantity}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

					{/* Rejection Notice */}
					{prescription.status === PrescriptionStatus.REJECTED && (
						<div className='bg-red-50 border border-red-200 rounded-lg p-4'>
							<p className='text-sm text-red-700'>
								Đơn thuốc này đã bị từ chối. Vui lòng liên hệ nhà thuốc để biết
								thêm chi tiết hoặc tải lên đơn thuốc mới.
							</p>
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
