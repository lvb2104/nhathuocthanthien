'use client';
import {
	useUnifiedCart,
	usePromotions,
	useShippingAddresses,
	useCreateShippingAddress,
} from '@/hooks';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { app } from '@/configs/app';
import { X, Minus, Plus, Tag, Check, ChevronDown, MapPin } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/configs/routes';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShippingAddressSchema } from '@/schemas';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GetPromotionsResponse, GetShippingAddressesResponse } from '@/types';

function CartCard({
	initialPromotions,
	initialShippingAddresses,
}: {
	initialPromotions?: GetPromotionsResponse;
	initialShippingAddresses?: GetShippingAddressesResponse;
}) {
	const {
		cartDetails,
		removeItem,
		incrementItem,
		decrementItem,
		formattedTotalPrice,
		cartCount,
		redirectToCheckout,
		appliedPromotion,
		applyPromotion,
		removePromotion,
		formattedDiscountAmount,
		formattedFinalTotalPrice,
	} = useUnifiedCart();
	const [showCoupon, setShowCoupon] = useState(false);
	const [selectedPromotionId, setSelectedPromotionId] = useState<string>('');

	// Address selection state
	const [addressMode, setAddressMode] = useState<'select' | 'create'>('select');
	const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
		null,
	);

	// Fetch shipping addresses with initial data from server
	const { data: shippingAddressesResponse, isLoading: isLoadingAddresses } =
		useShippingAddresses(initialShippingAddresses);
	const shippingAddresses = shippingAddressesResponse || [];

	// Create shipping address mutation
	const createAddressMutation = useCreateShippingAddress();

	// React Hook Form for new address creation
	const form = useForm<z.infer<typeof ShippingAddressSchema>>({
		resolver: zodResolver(ShippingAddressSchema),
		defaultValues: {
			fullName: '',
			phone: '',
			addressLine: '',
			ward: '',
			district: '',
			province: '',
			note: '',
			isDefault: false,
		},
	});

	// Fetch all promotions with initial data from server
	const { data: promotions = [], isLoading: isLoadingPromotions } =
		usePromotions(initialPromotions);

	// Filter active promotions
	const activePromotions = promotions.filter(promo => {
		const now = new Date();
		const startDate = new Date(promo.startDate);
		const endDate = new Date(promo.endDate);
		return now >= startDate && now <= endDate;
	});

	// Auto-switch to create mode if no addresses exist
	useEffect(() => {
		if (!isLoadingAddresses && shippingAddresses.length === 0) {
			setAddressMode('create');
		}
	}, [isLoadingAddresses, shippingAddresses.length]);

	const handleApplyPromotion = () => {
		if (!selectedPromotionId) {
			toast.error('Vui lòng chọn mã giảm giá');
			return;
		}

		const promotion = activePromotions.find(
			p => p.id.toString() === selectedPromotionId,
		);

		if (!promotion) {
			toast.error('Mã giảm giá không hợp lệ');
			return;
		}

		applyPromotion(promotion);
		toast.success(
			`Áp dụng mã giảm giá ${promotion.discountPercent}% thành công!`,
		);
		setSelectedPromotionId('');
		setShowCoupon(false);
	};

	const handleRemovePromotion = () => {
		removePromotion();
		toast.info('Đã gỡ mã giảm giá');
	};

	const handleCheckout = async () => {
		// Validate address selection
		if (addressMode === 'select') {
			if (!selectedAddressId) {
				toast.error('Vui lòng chọn địa chỉ giao hàng');
				return;
			}
			// If we have a selected address, proceed to checkout
			redirectToCheckout();
		} else {
			// addressMode === 'create'
			// Trigger form validation and submission
			form.handleSubmit(onSubmitNewAddress)();
		}
	};

	const onSubmitNewAddress = async (
		values: z.infer<typeof ShippingAddressSchema>,
	) => {
		try {
			await createAddressMutation.mutateAsync(values);
			toast.success('Đã tạo địa chỉ mới thành công');
			// Reset form after success
			form.reset();
			// Proceed to checkout after creating address
			redirectToCheckout(); // TODO: fix this
		} catch (error: any) {
			const message =
				error?.response?.data?.message || 'Không thể tạo địa chỉ mới';
			toast.error(message);
		}
	};

	const handleIncrement = async (productId: number) => {
		try {
			await incrementItem(productId);
		} catch (error: any) {
			const message =
				error?.response?.data?.message || 'Không thể tăng số lượng sản phẩm';
			toast.error(message);
		}
	};

	const handleDecrement = async (productId: number) => {
		try {
			await decrementItem(productId);
		} catch (error: any) {
			const message =
				error?.response?.data?.message || 'Không thể giảm số lượng sản phẩm';
			toast.error(message);
		}
	};

	const handleRemove = async (productId: number) => {
		try {
			await removeItem(productId);
			toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
		} catch (error: any) {
			const message =
				error?.response?.data?.message || 'Không thể xóa sản phẩm';
			toast.error(message);
		}
	};

	const cartItems = cartDetails ? Object.values(cartDetails) : [];

	if (cartItems.length === 0) {
		return (
			<div className='min-h-screen flex items-center justify-center p-4'>
				<div className='w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8'>
					<p className='text-gray-500 text-lg text-center'>Giỏ hàng trống</p>
					<button className='mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-lg transition-colors'>
						<Link href={routes.home}>Tiếp tục mua sắm</Link>
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4'>
			<div className='w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8'>
				<div className='space-y-6'>
					{/* Back to shopping link */}
					<Link
						href={routes.home}
						className='cursor-pointer inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors'
					>
						<svg
							className='w-5 h-5'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M15 19l-7-7 7-7'
							/>
						</svg>
						Mua thêm sản phẩm khác
					</Link>

					<h2 className='text-xl font-semibold text-center'>
						Giỏ hàng của bạn
					</h2>

					{/* Cart Items */}
					<div className='space-y-4'>
						{cartItems.map(item => (
							<div
								key={item.id}
								className='flex items-start gap-4 pb-4 border-b border-gray-200'
							>
								{/* Product Image */}
								<div className='relative w-20 h-20 flex-shrink-0'>
									<Image
										src={item.image || app.DEFAULT_IMAGE_URL}
										alt={item.name}
										fill
										className='object-contain'
									/>
								</div>

								{/* Product Info */}
								<div className='flex-1 min-w-0'>
									<h3 className='text-sm text-gray-800 line-clamp-2 mb-2'>
										{item.name}
									</h3>

									{/* Remove Button */}
									<button
										onClick={() => handleRemove(Number(item.id))}
										className='text-gray-400 hover:text-red-500 transition-colors cursor-pointer'
										aria-label='Xóa sản phẩm'
									>
										<X size={18} />
									</button>
								</div>

								{/* Price & Quantity */}
								<div className='flex flex-col items-end gap-3'>
									<div className='text-base font-semibold text-gray-900'>
										{item.formattedPrice}
									</div>

									{/* Quantity Controls */}
									<div className='flex items-center gap-2 border border-gray-300 rounded'>
										<button
											onClick={() => handleDecrement(Number(item.id))}
											disabled={item.quantity <= 1}
											className='cursor-pointer p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
											aria-label='Giảm số lượng'
										>
											<Minus size={16} className='text-gray-600' />
										</button>

										<input
											type='text'
											value={item.quantity}
											readOnly
											className='w-12 text-center text-sm border-x border-gray-300 py-1.5 focus:outline-none'
										/>

										<button
											onClick={() => handleIncrement(Number(item.id))}
											className='cursor-pointer p-1.5 hover:bg-gray-100 transition-colors'
											aria-label='Tăng số lượng'
										>
											<Plus size={16} className='text-gray-600' />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Voucher Section */}
					<div className='space-y-3'>
						{/* Applied Promotion Badge */}
						{appliedPromotion && (
							<div className='flex items-center justify-between gap-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
								<div className='flex items-center gap-2 flex-1'>
									<div className='p-1.5 bg-green-100 rounded'>
										<Check size={16} className='text-green-600' />
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-semibold text-green-700 truncate'>
											{appliedPromotion.code}
										</p>
										<p className='text-xs text-green-600'>
											Giảm {appliedPromotion.discountPercent}%
										</p>
									</div>
								</div>
								<button
									onClick={handleRemovePromotion}
									className='cursor-pointer text-green-600 hover:text-green-700 text-sm font-medium'
								>
									Gỡ
								</button>
							</div>
						)}

						{/* Dropdown Selector */}
						{!appliedPromotion && (
							<>
								<button
									type='button'
									onClick={() => setShowCoupon(v => !v)}
									aria-expanded={showCoupon}
									className='cursor-pointer inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors'
								>
									<Tag size={20} />
									<span className='font-medium'>Sử dụng mã giảm giá</span>
									<svg
										className={`w-4 h-4 transition-transform ${showCoupon ? 'rotate-180' : ''}`}
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M19 9l-7 7-7-7'
										/>
									</svg>
								</button>

								{showCoupon && (
									<div className='space-y-3'>
										<div className='relative'>
											<select
												value={selectedPromotionId}
												onChange={e => setSelectedPromotionId(e.target.value)}
												disabled={isLoadingPromotions}
												className='w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white disabled:opacity-50'
											>
												<option value=''>
													{isLoadingPromotions
														? 'Đang tải...'
														: activePromotions.length === 0
															? 'Không có mã giảm giá'
															: 'Chọn mã giảm giá'}
												</option>
												{activePromotions.map(promo => (
													<option key={promo.id} value={promo.id}>
														{promo.code} - Giảm {promo.discountPercent}% -{' '}
														{promo.description}
													</option>
												))}
											</select>
											<ChevronDown
												size={20}
												className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
											/>
										</div>
										<button
											onClick={handleApplyPromotion}
											disabled={!selectedPromotionId || isLoadingPromotions}
											className='cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
										>
											Áp dụng mã giảm giá
										</button>
									</div>
								)}
							</>
						)}
					</div>

					{/* Cart Summary */}
					<div className='space-y-2'>
						<div className='flex justify-between text-gray-700'>
							<span>Tạm tính ({cartCount} sản phẩm):</span>
							<span>{formattedTotalPrice}</span>
						</div>
						{appliedPromotion && (
							<div className='flex justify-between text-green-600'>
								<span>Giảm giá ({appliedPromotion.discountPercent}%):</span>
								<span>-{formattedDiscountAmount}</span>
							</div>
						)}
						<div className='flex justify-between text-lg font-bold text-red-600'>
							<span>Tổng tiền:</span>
							<span>
								{appliedPromotion
									? formattedFinalTotalPrice
									: formattedTotalPrice}
							</span>
						</div>
					</div>

					{/* Address Selection Section */}
					<div className='space-y-4'>
						<div className='flex items-center gap-2'>
							<MapPin size={20} className='text-gray-700' />
							<h3 className='text-lg font-semibold text-gray-900'>
								Địa chỉ giao hàng
							</h3>
						</div>

						{/* Address Mode Toggle */}
						<div className='flex gap-2'>
							<button
								type='button'
								onClick={() => setAddressMode('select')}
								className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
									addressMode === 'select'
										? 'bg-green-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								Chọn địa chỉ có sẵn
							</button>
							<button
								type='button'
								onClick={() => setAddressMode('create')}
								className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
									addressMode === 'create'
										? 'bg-green-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								Tạo địa chỉ mới
							</button>
						</div>

						{/* Select Existing Address Mode */}
						{addressMode === 'select' && (
							<div className='space-y-3'>
								{isLoadingAddresses ? (
									<p className='text-gray-500 text-center py-4'>
										Đang tải địa chỉ...
									</p>
								) : shippingAddresses.length === 0 ? (
									<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
										<p className='text-sm text-yellow-800'>
											Bạn chưa có địa chỉ nào. Vui lòng tạo địa chỉ mới.
										</p>
									</div>
								) : (
									<>
										<div className='relative'>
											<select
												value={selectedAddressId || ''}
												onChange={e =>
													setSelectedAddressId(Number(e.target.value))
												}
												className='w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white'
											>
												<option value=''>Chọn địa chỉ giao hàng</option>
												{shippingAddresses.map(address => (
													<option key={address.id} value={address.id}>
														{address.fullName} - {address.phone} -{' '}
														{address.addressLine}, {address.ward},{' '}
														{address.district}, {address.province}
														{address.isDefault ? ' (Mặc định)' : ''}
													</option>
												))}
											</select>
											<ChevronDown
												size={20}
												className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
											/>
										</div>

										{/* Display selected address details */}
										{selectedAddressId &&
											(() => {
												const selectedAddress = shippingAddresses.find(
													a => a.id === selectedAddressId,
												);
												return selectedAddress ? (
													<div className='bg-green-50 border border-green-200 rounded-lg p-4'>
														<div className='space-y-1 text-sm'>
															<p className='font-semibold text-green-900'>
																{selectedAddress.fullName}
															</p>
															<p className='text-green-800'>
																Số điện thoại: {selectedAddress.phone}
															</p>
															<p className='text-green-800'>
																Địa chỉ: {selectedAddress.addressLine},{' '}
																{selectedAddress.ward},{' '}
																{selectedAddress.district},{' '}
																{selectedAddress.province}
															</p>
															{selectedAddress.note && (
																<p className='text-green-700'>
																	Ghi chú: {selectedAddress.note}
																</p>
															)}
														</div>
													</div>
												) : null;
											})()}
									</>
								)}
							</div>
						)}

						{/* Create New Address Mode */}
						{addressMode === 'create' && (
							<Form {...form}>
								<div className='space-y-4'>
									{/* Name & Phone */}
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
										<FormField
											control={form.control}
											name='fullName'
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input placeholder='Tên của bạn *' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name='phone'
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															type='tel'
															placeholder='Số điện thoại *'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Province & District */}
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
										<FormField
											control={form.control}
											name='province'
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input placeholder='Tỉnh/Thành phố *' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name='district'
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input placeholder='Quận/Huyện *' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Ward */}
									<FormField
										control={form.control}
										name='ward'
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input placeholder='Xã/Phường *' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Address Line */}
									<FormField
										control={form.control}
										name='addressLine'
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input placeholder='Địa chỉ cụ thể *' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Note */}
									<FormField
										control={form.control}
										name='note'
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Textarea
														placeholder='Ghi chú (tuỳ chọn)'
														rows={3}
														className='resize-none'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</Form>
						)}
					</div>

					{/* Checkout Form */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold text-gray-900'>
							Thông tin thanh toán
						</h3>

						{/* Order Notes */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Ghi chú đơn hàng (tuỳ chọn)
							</label>
							<textarea
								placeholder='Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.'
								rows={4}
								className='w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none'
							/>
						</div>

						{/* Summary Footer */}
						<div className='space-y-2 pt-4'>
							<div className='flex justify-between text-gray-700'>
								<span>Tạm tính ({cartCount} sản phẩm):</span>
								<span>{formattedTotalPrice}</span>
							</div>
							{appliedPromotion && (
								<div className='flex justify-between text-green-600'>
									<span>Giảm giá ({appliedPromotion.discountPercent}%):</span>
									<span>-{formattedDiscountAmount}</span>
								</div>
							)}
							<div className='flex justify-between text-lg font-bold text-red-600'>
								<span>Tổng tiền:</span>
								<span>
									{appliedPromotion
										? formattedFinalTotalPrice
										: formattedTotalPrice}
								</span>
							</div>
						</div>

						{/* Terms Notice */}
						<p className='text-sm text-gray-600'>
							Nhận hàng tại nhà, kiểm tra trước, thanh toán sau
						</p>

						<p className='text-sm text-gray-600'>
							Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{' '}
							<a
								href='#'
								className='cursor-pointer text-green-600 hover:underline'
							>
								Điều khoản dịch vụ
							</a>{' '}
							và{' '}
							<a
								href='#'
								className='cursor-pointer text-green-600 hover:underline'
							>
								Chính sách xử lý dữ liệu cá nhân
							</a>{' '}
							của Nhà thuốc Thần Thiện
						</p>

						{/* Place Order Button */}
						<button
							disabled={createAddressMutation.isPending}
							className='cursor-pointer w-[50%] mx-auto block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
							onClick={handleCheckout}
						>
							{createAddressMutation.isPending ? 'Đang xử lý...' : 'Đặt hàng'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CartCard;
