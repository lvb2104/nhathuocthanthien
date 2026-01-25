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
	ShoppingCart,
	Check,
} from 'lucide-react';
import Image from 'next/image';
import { PrescriptionStatus } from '@/types';
import { useMyPrescription } from '@/hooks';
import { useUnifiedCart } from '@/hooks';
import { toast } from 'react-toastify';

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
	// Fetch full prescription details with items when sheet is open
	const { data: fullPrescription } = useMyPrescription(prescription?.id || 0);

	// Use full prescription if available, otherwise fall back to list data
	const displayPrescription = fullPrescription || prescription;

	// Get cart functionality
	const { addItem, cartDetails } = useUnifiedCart();

	// Helper function to check if item is in cart
	const isInCart = (productId: number) => {
		if (!cartDetails) return false;
		return Object.values(cartDetails).some(
			cartItem => Number(cartItem.id) === productId,
		);
	};

	// Handler to add prescription item to cart
	const handleAddToCart = async (item: {
		productId: number;
		quantity: number;
		product?: {
			id: number;
			name: string;
			price?: string;
		};
	}) => {
		if (!item.product) {
			toast.error('Không thể thêm sản phẩm vào giỏ hàng');
			return;
		}

		try {
			await addItem(
				item.product.id,
				{
					name: item.product.name,
					price: item.product.price ? Number(item.product.price) : 0,
				},
				item.quantity,
			);
			toast.success(`Đã thêm ${item.product.name} vào giỏ hàng`);
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message ||
				'Không thể thêm sản phẩm vào giỏ hàng';
			toast.error(errorMessage);
		}
	};

	if (!displayPrescription) return null;

	const statusConfig = getPrescriptionStatusConfig(displayPrescription.status);

	const getStatusIcon = () => {
		switch (displayPrescription.status) {
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
						<span className='text-base'>
							Đơn thuốc #{displayPrescription.id}
						</span>
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
							{formatPrescriptionDate(displayPrescription.uploadedAt)}
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
								src={displayPrescription.fileUrl}
								alt={`Đơn thuốc #${displayPrescription.id}`}
								fill
								className='object-contain'
							/>
						</div>
					</div>

					{/* Pharmacist Info (if processed) */}
					{displayPrescription.pharmacist && (
						<div className='pb-5 border-b'>
							<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
								<User size={16} className='text-green-600' />
								Dược sĩ xử lý
							</h3>
							<div className='bg-gray-50 rounded-lg p-4'>
								<p className='text-sm text-gray-900'>
									{displayPrescription.pharmacist.fullName}
								</p>
							</div>
						</div>
					)}

					{/* Approved Items (if approved) */}
					{displayPrescription.status === PrescriptionStatus.APPROVED &&
						displayPrescription.items &&
						displayPrescription.items.length > 0 && (
							<div className='pb-5'>
								<h3 className='font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2'>
									<Package size={16} className='text-green-600' />
									Thuốc được kê ({displayPrescription.items.length})
								</h3>
								<p className='text-xs text-gray-600 mb-3'>
									Nhấn vào sản phẩm để thêm vào giỏ hàng
								</p>
								<div className='space-y-3'>
									{displayPrescription.items.map((item, index) => {
										const inCart = isInCart(item.productId);
										return (
											<button
												key={index}
												onClick={() => handleAddToCart(item)}
												disabled={inCart}
												className={`w-full flex items-center justify-between rounded-lg p-3 transition-all ${
													inCart
														? 'bg-green-50 border-2 border-green-200 cursor-default'
														: 'bg-gray-50 border-2 border-transparent hover:border-green-300 hover:bg-green-50 cursor-pointer active:scale-[0.98]'
												}`}
											>
												<div className='flex-1 text-left'>
													<p className='text-sm font-medium text-gray-900 flex items-center gap-2'>
														{item.product?.name ||
															`Sản phẩm #${item.productId}`}
														{inCart && (
															<Check
																size={16}
																className='text-green-600 flex-shrink-0'
															/>
														)}
													</p>
													{item.product?.price && (
														<p className='text-xs text-gray-500 mt-1'>
															{Number(item.product.price).toLocaleString(
																'vi-VN',
															)}
															đ
														</p>
													)}
												</div>
												<div className='flex items-center gap-3'>
													<span className='text-sm font-semibold text-green-600'>
														x{item.quantity}
													</span>
													{inCart ? (
														<div className='flex items-center gap-1 text-xs text-green-600 font-medium'>
															<Check size={14} />
															<span>Trong giỏ</span>
														</div>
													) : (
														<ShoppingCart size={18} className='text-gray-400' />
													)}
												</div>
											</button>
										);
									})}
								</div>
							</div>
						)}

					{/* Rejection Notice */}
					{displayPrescription.status === PrescriptionStatus.REJECTED && (
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
