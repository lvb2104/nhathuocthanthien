'use client';

import { useState, useEffect } from 'react';
import { Prescription, ApprovePrescriptionRequest } from '@/types';
import { useApprovePrescription } from '@/hooks/prescriptions/use-approve-prescription';
import { useProducts } from '@/hooks/products/use-products';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { Plus, Trash2, Package } from 'lucide-react';
import Image from 'next/image';

interface ApprovePrescriptionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	prescription: Prescription;
}

type PrescriptionItem = {
	product_id: number;
	quantity: number;
};

export function ApprovePrescriptionDialog({
	open,
	onOpenChange,
	prescription,
}: ApprovePrescriptionDialogProps) {
	const [items, setItems] = useState<PrescriptionItem[]>([
		{ product_id: 0, quantity: 1 },
	]);
	const [searchKeyword, setSearchKeyword] = useState('');

	const { mutateAsync, isPending } = useApprovePrescription();
	const { data: productsResponse, isPending: isLoadingProducts } = useProducts({
		keyword: searchKeyword,
		limit: 100, // Get enough products for selection
	});

	// Reset form when dialog opens
	useEffect(() => {
		if (open) {
			setItems([{ product_id: 0, quantity: 1 }]);
			setSearchKeyword('');
		}
	}, [open]);

	const handleAddItem = () => {
		setItems([...items, { product_id: 0, quantity: 1 }]);
	};

	const handleRemoveItem = (index: number) => {
		if (items.length > 1) {
			setItems(items.filter((_, i) => i !== index));
		}
	};

	const handleProductChange = (index: number, productId: number) => {
		const newItems = [...items];
		newItems[index].product_id = productId;
		setItems(newItems);
	};

	const handleQuantityChange = (index: number, quantity: number) => {
		const newItems = [...items];
		newItems[index].quantity = Math.max(1, quantity);
		setItems(newItems);
	};

	const validateForm = (): boolean => {
		// Check if all items have a product selected
		const hasEmptyProduct = items.some(item => item.product_id === 0);
		if (hasEmptyProduct) {
			toast.error('Vui lòng chọn sản phẩm cho tất cả các mục');
			return false;
		}

		// Check if all quantities are valid
		const hasInvalidQuantity = items.some(item => item.quantity < 1);
		if (hasInvalidQuantity) {
			toast.error('Số lượng phải lớn hơn 0');
			return false;
		}

		// Check for duplicate products
		const productIds = items.map(item => item.product_id);
		const uniqueProductIds = new Set(productIds);
		if (productIds.length !== uniqueProductIds.size) {
			toast.error('Không được chọn trùng sản phẩm');
			return false;
		}

		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) {
			return;
		}

		const request: ApprovePrescriptionRequest = {
			items: items,
		};

		toast.promise(
			mutateAsync({
				id: prescription.id,
				request,
			}).then(() => {
				onOpenChange(false);
			}),
			{
				pending: 'Đang duyệt đơn thuốc...',
				success: 'Đã duyệt đơn thuốc thành công',
				error: 'Lỗi khi duyệt đơn thuốc',
			},
		);
	};

	const products = productsResponse?.data || [];

	const isImage = (url: string) => {
		return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-3xl'>
				<DialogHeader>
					<DialogTitle>Duyệt đơn thuốc #{prescription.id}</DialogTitle>
					<DialogDescription>
						Chọn các sản phẩm và số lượng để duyệt đơn thuốc cho bệnh nhân{' '}
						<strong>{prescription.user?.fullName}</strong>
					</DialogDescription>
				</DialogHeader>

				<div className='max-h-[60vh] overflow-y-auto px-1'>
					<div className='grid gap-4 py-4'>
						{/* Prescription Preview - Compact */}
						<div className='space-y-2'>
							<Label className='flex items-center gap-2 text-sm'>
								<Package className='size-4' />
								Đơn thuốc của bệnh nhân
							</Label>
							<div className='rounded-lg border p-2 bg-muted/30'>
								{isImage(prescription.fileUrl) ? (
									<div className='relative w-full max-w-[280px] mx-auto aspect-[3/4] bg-white rounded-md overflow-hidden'>
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
										className='flex items-center justify-center gap-2 p-3 text-sm text-primary hover:underline'
									>
										<Package className='size-4' />
										Xem file đơn thuốc
									</a>
								)}
							</div>
						</div>

						{/* Search Products */}
						<div className='space-y-2'>
							<Label className='text-sm'>Tìm kiếm sản phẩm</Label>
							<Input
								placeholder='Nhập tên sản phẩm...'
								value={searchKeyword}
								onChange={e => setSearchKeyword(e.target.value)}
							/>
						</div>

						{/* Product Items */}
						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<Label className='text-sm'>Danh sách thuốc duyệt</Label>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={handleAddItem}
								>
									<Plus className='size-4' />
									Thêm thuốc
								</Button>
							</div>

							<div className='space-y-3 max-h-[280px] overflow-y-auto pr-1'>
								{items.map((item, index) => (
									<div
										key={index}
										className='grid grid-cols-[1fr_100px_40px] gap-2 items-end'
									>
										<div className='space-y-2'>
											<Label className='text-xs'>Sản phẩm {index + 1}</Label>
											<Select
												value={item.product_id.toString()}
												onValueChange={value =>
													handleProductChange(index, parseInt(value))
												}
												disabled={isLoadingProducts}
											>
												<SelectTrigger className='truncate'>
													<SelectValue placeholder='Chọn sản phẩm' />
												</SelectTrigger>
												<SelectContent>
													{products.length === 0 ? (
														<div className='p-2 text-center text-sm text-muted-foreground'>
															{isLoadingProducts
																? 'Đang tải...'
																: 'Không có sản phẩm'}
														</div>
													) : (
														products.map(product => (
															<SelectItem
																key={product.id}
																value={product.id.toString()}
																className='max-w-full'
															>
																<div className='flex items-center justify-between gap-2 w-full'>
																	<span className='truncate flex-1'>
																		{product.name}
																	</span>
																	<span className='text-xs text-muted-foreground whitespace-nowrap'>
																		{parseFloat(product.price).toLocaleString(
																			'vi-VN',
																		)}{' '}
																		₫
																	</span>
																</div>
															</SelectItem>
														))
													)}
												</SelectContent>
											</Select>
										</div>

										<div className='space-y-2'>
											<Label className='text-xs'>Số lượng</Label>
											<Input
												type='number'
												min='1'
												value={item.quantity}
												onChange={e =>
													handleQuantityChange(
														index,
														parseInt(e.target.value) || 1,
													)
												}
											/>
										</div>

										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => handleRemoveItem(index)}
											disabled={items.length === 1}
											className='text-destructive hover:text-destructive hover:bg-destructive/10'
										>
											<Trash2 className='size-4' />
										</Button>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant='outline'
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						Hủy
					</Button>
					<Button onClick={handleSubmit} disabled={isPending}>
						{isPending ? 'Đang xử lý...' : 'Duyệt đơn thuốc'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
