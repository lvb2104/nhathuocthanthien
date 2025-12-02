'use client';
import { useShoppingCart } from 'use-shopping-cart';
import Image from 'next/image';
import { app } from '@/configs/app';
import { X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/configs/routes';
import { FormEvent, useState } from 'react';

function CartCard() {
	const {
		cartDetails,
		removeItem,
		incrementItem,
		decrementItem,
		formattedTotalPrice,
		cartCount,
		redirectToCheckout,
	} = useShoppingCart();
	const [showCoupon, setShowCoupon] = useState(false);
	const [coupon, setCoupon] = useState('');

	const handleApplyCoupon = (e: FormEvent) => {
		e.preventDefault();
		if (!coupon.trim()) return;
		// TODO: wire to your coupon API / logic
		// toast.success?.(`Áp dụng mã: ${coupon}`);
		console.log('Apply coupon:', coupon);
	};

	const handleCheckout = () => {
		redirectToCheckout();
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
						className='inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors'
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
										onClick={() => removeItem(item.id)}
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
											onClick={() => decrementItem(item.id)}
											disabled={item.quantity <= 1}
											className='p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
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
											onClick={() => incrementItem(item.id)}
											className='p-1.5 hover:bg-gray-100 transition-colors'
											aria-label='Tăng số lượng'
										>
											<Plus size={16} className='text-gray-600' />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Discount Code Section (toggle) */}
					<div className='space-y-3'>
						<button
							type='button'
							onClick={() => setShowCoupon(v => !v)}
							aria-expanded={showCoupon}
							className='inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors'
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
									d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
								/>
							</svg>
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
							<form
								onSubmit={handleApplyCoupon}
								className='flex overflow-hidden rounded-md border border-gray-300'
							>
								<input
									value={coupon}
									onChange={e => setCoupon(e.target.value)}
									placeholder='Mã ưu đãi'
									className='flex-1 px-4 py-2.5 outline-none'
								/>
								<button
									type='submit'
									className='bg-green-600 hover:bg-green-700 text-white px-6 whitespace-nowrap'
								>
									Áp dụng
								</button>
							</form>
						)}
					</div>

					{/* Cart Summary */}
					<div className='space-y-2'>
						<div className='flex justify-between text-gray-700'>
							<span>Tạm tính ({cartCount} sản phẩm):</span>
							<span>{formattedTotalPrice}</span>
						</div>
						<div className='flex justify-between text-lg font-bold text-red-600'>
							<span>Tổng tiền:</span>
							<span>{formattedTotalPrice}</span>
						</div>
					</div>

					{/* Warning Notice */}
					<div className='bg-red-50 border border-red-200 rounded-lg p-4'>
						<ul className='space-y-1 text-sm text-red-800'>
							<li>
								• <strong>Mục Tên của bạn *</strong> là mục bắt buộc.
							</li>
							<li>
								• <strong>Mục Số điện thoại *</strong> là mục bắt buộc.
							</li>
							<li>
								• <strong>Mục Quận/Huyện *</strong> là mục bắt buộc.
							</li>
							<li>
								• <strong>Mục Xã/Phường *</strong> là mục bắt buộc.
							</li>
							<li>
								• <strong>Mục Địa chỉ cụ thể *</strong> là mục bắt buộc.
							</li>
						</ul>
					</div>

					{/* Checkout Form */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold text-gray-900'>
							Thông tin thanh toán
						</h3>

						{/* Name & Phone */}
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<input
								type='text'
								placeholder='Tên của bạn *'
								className='w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none'
							/>
							<input
								type='tel'
								placeholder='Số điện thoại *'
								className='w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none'
							/>
						</div>

						{/* City & District */}
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<select className='w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-600'>
								<option>Tỉnh/Thành phố *</option>
							</select>
							<select className='w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-600'>
								<option>Quận/Huyện *</option>
							</select>
						</div>

						{/* Ward */}
						<select className='w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-600'>
							<option>Xã/Phường *</option>
						</select>

						{/* Address */}
						<input
							type='text'
							placeholder='Địa chỉ cụ thể *'
							className='w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none'
						/>

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
							<div className='flex justify-between text-lg font-bold text-red-600'>
								<span>Tổng tiền:</span>
								<span>{formattedTotalPrice}</span>
							</div>
						</div>

						{/* Terms Notice */}
						<p className='text-sm text-gray-600'>
							Nhận hàng tại nhà, kiểm tra trước, thanh toán sau
						</p>

						<p className='text-sm text-gray-600'>
							Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{' '}
							<a href='#' className='text-green-600 hover:underline'>
								Điều khoản dịch vụ
							</a>{' '}
							và{' '}
							<a href='#' className='text-green-600 hover:underline'>
								Chính sách xử lý dữ liệu cá nhân
							</a>{' '}
							của Nhà thuốc Thần Thiện
						</p>

						{/* Place Order Button */}
						<button
							className='w-[50%] mx-auto block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-lg transition-colors'
							onClick={handleCheckout}
						>
							Đặt hàng
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CartCard;
