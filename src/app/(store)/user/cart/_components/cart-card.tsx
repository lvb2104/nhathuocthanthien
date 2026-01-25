'use client';
import {
	useUnifiedCart,
	usePromotions,
	useShippingAddresses,
	useCreateShippingAddress,
	useCreateOrder,
} from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { PaymentMethod } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { app } from '@/configs/app';
import {
	X,
	Minus,
	Plus,
	Tag,
	Check,
	ChevronDown,
	MapPin,
	Banknote,
	CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/configs/routes';
import { useState, useEffect, useMemo } from 'react';
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

enum AddressMode {
	SELECT = 'select',
	CREATE = 'create',
}

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
		appliedPromotion,
		applyPromotion,
		removePromotion,
		formattedDiscountAmount,
		formattedFinalTotalPrice,
		clearCart,
	} = useUnifiedCart();
	const [showCoupon, setShowCoupon] = useState(false);
	const [selectedPromotionId, setSelectedPromotionId] = useState<string>('');
	const [orderNotes, setOrderNotes] = useState('');

	// Address selection state
	const [addressMode, setAddressMode] = useState<AddressMode>(
		AddressMode.SELECT,
	);
	const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
		null,
	);

	// Payment method state
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<PaymentMethod>(PaymentMethod.CASH);

	const router = useRouter();

	// Query client for manual refetching
	const queryClient = useQueryClient();

	// Order creation mutation
	const createOrderMutation = useCreateOrder();

	// Fetch shipping addresses with initial data from server
	const { data: shippingAddressesResponse, isLoading: isLoadingAddresses } =
		useShippingAddresses(initialShippingAddresses);
	const shippingAddresses = useMemo(
		() => shippingAddressesResponse || [],
		[shippingAddressesResponse],
	);

	// Create shipping address mutation
	const createAddressMutation = useCreateShippingAddress();

	// Memoize default values to prevent form reset on re-renders
	const addressFormDefaultValues = useMemo(
		() => ({
			fullName: '',
			phone: '',
			addressLine: '',
			ward: '',
			district: '',
			province: '',
			note: '',
			isDefault: false,
		}),
		[],
	);

	// React Hook Form for new address creation
	const form = useForm<z.infer<typeof ShippingAddressSchema>>({
		resolver: zodResolver(ShippingAddressSchema),
		defaultValues: addressFormDefaultValues,
		mode: 'onBlur',
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
			setAddressMode(AddressMode.CREATE);
		}
	}, [isLoadingAddresses, shippingAddresses.length]);

	// Auto-select default address when addresses are loaded
	useEffect(() => {
		if (
			!isLoadingAddresses &&
			shippingAddresses.length > 0 &&
			selectedAddressId === null
		) {
			// Find the default address or use the first one
			const defaultAddress =
				shippingAddresses.find(a => a.isDefault) || shippingAddresses[0];
			setSelectedAddressId(defaultAddress.id);
		}
	}, [isLoadingAddresses, shippingAddresses, selectedAddressId]);

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
		// Validate that cart has items
		if (!cartDetails || Object.keys(cartDetails).length === 0) {
			toast.error('Giỏ hàng trống');
			return;
		}

		// Validate address selection
		if (addressMode === AddressMode.SELECT) {
			if (!selectedAddressId) {
				toast.error('Vui lòng chọn địa chỉ giao hàng');
				return;
			}

			// Create order with selected address
			await createOrderWithAddress(selectedAddressId);
		} else {
			// addressMode === 'create'
			// Trigger form validation and submission
			form.handleSubmit(onSubmitNewAddress)();
		}
	};

	const createOrderWithAddress = async (addressId: number) => {
		try {
			// Prepare order items from cart
			const items = Object.values(cartDetails || {}).map(item => ({
				productId: Number(item.id),
				quantity: item.quantity,
			}));

			// Create order payload
			const orderData = {
				items,
				userShippingAddressId: addressId,
				promotionId: appliedPromotion?.id,
				paymentMethod: selectedPaymentMethod,
			};

			// Create order using toast.promise for better UX
			const response = await toast.promise(
				createOrderMutation.mutateAsync(orderData),
				{
					pending: 'Đang tạo đơn hàng...',
					success: 'Đặt hàng thành công! 🎉',
					error: {
						render({ data }: any) {
							return (
								data?.response?.data?.message ||
								'Không thể tạo đơn hàng. Vui lòng thử lại.'
							);
						},
					},
				},
			);

			// Handle post-order actions based on payment method
			if (response.checkoutUrl) {
				// PayOS payment - redirect to payment gateway
				// Don't clear cart yet - will be cleared after payment confirmation
				toast.info('Đang chuyển đến trang thanh toán...');
				// Use window.location for external payment URLs
				window.location.href = response.checkoutUrl;
			} else {
				// Cash payment - clear cart immediately since payment is on delivery
				await clearCart();
				setOrderNotes('');
				removePromotion();

				// Redirect to orders page
				setTimeout(() => {
					router.push(routes.user.orders);
				}, 1000);
			}
		} catch (error: any) {
			// Error is already handled by toast.promise
			console.error('Checkout error:', error);
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

			// Manually refetch addresses to get the newly created one
			// The mutation's onSuccess already invalidates, but we need fresh data here
			await queryClient.refetchQueries({
				queryKey: ['user', 'shipping-addresses'],
			});

			// Get the fresh data from the query cache
			const refetchedAddresses =
				queryClient.getQueryData<GetShippingAddressesResponse>([
					'user',
					'shipping-addresses',
				]);

			if (refetchedAddresses && refetchedAddresses.length > 0) {
				// Find the most recently created address (should be the new one)
				// Sort by createdAt descending and take the first one
				const sortedAddresses = [...refetchedAddresses].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				);
				const newAddress = sortedAddresses[0];
				await createOrderWithAddress(newAddress.id);
			} else {
				toast.error('Không thể lấy địa chỉ vừa tạo. Vui lòng thử lại.');
			}
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
								onClick={() => setAddressMode(AddressMode.SELECT)}
								className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
									addressMode === AddressMode.SELECT
										? 'bg-green-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								Chọn địa chỉ có sẵn
							</button>
							<button
								type='button'
								onClick={() => setAddressMode(AddressMode.CREATE)}
								className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
									addressMode === AddressMode.CREATE
										? 'bg-green-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								Tạo địa chỉ mới
							</button>
						</div>

						{/* Select Existing Address Mode */}
						{addressMode === AddressMode.SELECT && (
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
													setSelectedAddressId(
														e.target.value ? Number(e.target.value) : null,
													)
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
						{addressMode === AddressMode.CREATE && (
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
								value={orderNotes}
								onChange={e => setOrderNotes(e.target.value)}
								className='w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none'
							/>
						</div>

						{/* Payment Method Selection */}
						<div className='space-y-3'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Phương thức thanh toán
							</h3>

							<div className='grid grid-cols-2 gap-3'>
								{/* Cash Payment Option */}
								<button
									type='button'
									onClick={() => setSelectedPaymentMethod(PaymentMethod.CASH)}
									className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
										selectedPaymentMethod === PaymentMethod.CASH
											? 'border-green-600 bg-green-50'
											: 'border-gray-300 bg-white hover:border-gray-400'
									}`}
								>
									<Banknote
										size={32}
										className={
											selectedPaymentMethod === PaymentMethod.CASH
												? 'text-green-600'
												: 'text-gray-600'
										}
									/>
									<div className='text-center'>
										<p
											className={`font-semibold ${
												selectedPaymentMethod === PaymentMethod.CASH
													? 'text-green-700'
													: 'text-gray-700'
											}`}
										>
											Tiền mặt
										</p>
										<p className='text-xs text-gray-500 mt-1'>
											Thanh toán khi nhận hàng
										</p>
									</div>
								</button>

								{/* Online Banking Payment Option */}
								<button
									type='button'
									onClick={() => setSelectedPaymentMethod(PaymentMethod.PAYOS)}
									className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
										selectedPaymentMethod === PaymentMethod.PAYOS
											? 'border-green-600 bg-green-50'
											: 'border-gray-300 bg-white hover:border-gray-400'
									}`}
								>
									<CreditCard
										size={32}
										className={
											selectedPaymentMethod === PaymentMethod.PAYOS
												? 'text-green-600'
												: 'text-gray-600'
										}
									/>
									<div className='text-center'>
										<p
											className={`font-semibold ${
												selectedPaymentMethod === PaymentMethod.PAYOS
													? 'text-green-700'
													: 'text-gray-700'
											}`}
										>
											Ngân hàng
										</p>
										<p className='text-xs text-gray-500 mt-1'>
											Thanh toán trực tuyến
										</p>
									</div>
								</button>
							</div>
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
