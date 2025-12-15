'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ContentWrapper from '../../../../../components/layouts/content-wrapper';
import { routes } from '@/configs/routes';
import Link from 'next/link';
import { Product } from '@/types';
import { Button } from '../../../../../components/ui/button';
import Lightbox from 'yet-another-react-lightbox';
import { Zoom, Thumbnails } from 'yet-another-react-lightbox/plugins';
import { useProduct, useUnifiedCart } from '@/hooks';
import { toast } from 'react-toastify';
import Loading from '@/app/loading';
import { app } from '@/configs/app';

function ProductDetail({
	initialProduct,
	id,
}: {
	initialProduct: Product;
	id: string;
}) {
	const {
		data: product,
		isError: isProductError,
		isPending: isProductPending,
	} = useProduct(Number(id), initialProduct);

	useEffect(() => {
		if (isProductError) {
			toast.error('Error fetching product data');
		}
	}, [isProductError]);

	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const { addItem } = useUnifiedCart();

	if (isProductPending) return <Loading />;

	const images =
		product?.images && product.images.length > 0
			? product.images
			: [
					{
						id: 0,
						imageUrl: app.DEFAULT_IMAGE_URL,
					},
				];
	const activeImage = selectedImage ?? images[0]?.imageUrl;
	const lightboxSlides = images.map(img => ({ src: img.imageUrl }));

	async function handleAddItemToCart() {
		if (!product) return;

		try {
			await addItem(
				product.id,
				{
					name: product.name,
					price: Number(product.price),
					description: product.description || undefined,
					image: product.images?.[0]?.imageUrl,
				},
				1,
			);
			toast.success('Đã thêm sản phẩm vào giỏ hàng');
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message || 'Không thể thêm vào giỏ hàng';
			toast.error(errorMessage);
			console.error('Failed to add item to cart:', error);
		}
	}

	return (
		<main className='py-6'>
			<ContentWrapper>
				{/* Breadcrumbs */}
				<nav className='mb-6 flex items-center gap-2 text-sm'>
					<Link
						href={routes.home}
						className='cursor-pointer flex items-center gap-1.5 text-neutral-600 transition-colors hover:text-green-600'
					>
						<svg
							className='h-4 w-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
							/>
						</svg>
						<span>Trang chủ</span>
					</Link>

					<svg
						className='h-4 w-4 text-neutral-400'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M9 5l7 7-7 7'
						/>
					</svg>

					<Link
						href={routes.home}
						className='cursor-pointer text-neutral-600 transition-colors hover:text-green-600'
					>
						{product?.category?.name}
					</Link>

					<svg
						className='h-4 w-4 text-neutral-400'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M9 5l7 7-7 7'
						/>
					</svg>

					<span className='max-w-[300px] truncate font-medium text-neutral-900'>
						{product?.name}
					</span>
				</nav>

				<div className='grid gap-6 lg:grid-cols-2'>
					{/* Image Gallery Card */}
					<div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-lg'>
						{/* Main Image Display */}
						<button
							onClick={() => {
								const index = images.findIndex(
									img => img.imageUrl === activeImage,
								);
								setLightboxIndex(index >= 0 ? index : 0);
								setLightboxOpen(true);
							}}
							className='group relative mx-auto h-[420px] w-full max-w-xl overflow-hidden rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 ring-1 ring-neutral-200/50 cursor-zoom-in'
						>
							<Image
								src={activeImage}
								alt={product?.name || 'Ảnh sản phẩm'}
								fill
								className='object-contain p-6 transition-transform duration-300 group-hover:scale-105'
								sizes='(min-width: 1024px) 50vw, 100vw'
								priority
							/>

							{/* Zoom indicator on hover */}
							<div className='pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
								<div className='rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm'>
									Nhấn để phóng to
								</div>
							</div>
						</button>

						{/* Thumbnail Grid */}
						<div className='mt-4 grid grid-cols-5 gap-3'>
							{images.map(image => {
								const isActive = activeImage === image.imageUrl;
								return (
									<button
										key={image.id}
										onClick={() => setSelectedImage(image.imageUrl)}
										className={`cursor-pointer group relative h-20 w-full overflow-hidden rounded-lg transition-all duration-200 ${
											isActive
												? 'ring-2 ring-green-600 ring-offset-2 scale-105'
												: 'ring-1 ring-neutral-200 hover:ring-green-400 hover:scale-105'
										}`}
									>
										<div className='absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100' />
										<Image
											src={image.imageUrl}
											alt={`${product?.name} ảnh ${image.id}`}
											fill
											className={`object-contain p-2 transition-opacity duration-200 ${
												isActive
													? 'opacity-100'
													: 'opacity-70 group-hover:opacity-100'
											}`}
										/>
										{isActive && (
											<div className='absolute inset-0 bg-green-600/10' />
										)}
									</button>
								);
							})}
						</div>

						{/* Image Counter Badge */}
						<div className='mt-3 flex items-center justify-center gap-2 text-sm text-neutral-600'>
							<svg
								className='h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
								/>
							</svg>
							<span>{images.length} ảnh</span>
						</div>
					</div>

					<div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-lg'>
						{/* Badges */}
						<div className='mb-3 flex items-center gap-2'>
							<span className='inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20'>
								Yêu thích
							</span>
							<span className='inline-flex items-center rounded-md bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-600/20'>
								Mới
							</span>
						</div>

						{/* Product Name */}
						<h1 className='mb-3 text-2xl font-bold leading-tight text-neutral-900'>
							{product?.name}
						</h1>

						{/* Rating & Stats */}
						<div className='mb-4 flex items-center gap-4 border-b border-neutral-100 pb-4 text-sm'>
							<div className='flex items-center gap-1.5'>
								<span className='font-bold text-red-600'>5.0</span>
								<span className='text-yellow-400'>★★★★★</span>
							</div>
							<span className='text-neutral-500'>|</span>
							<span className='text-neutral-600'>12 đánh giá</span>
							<span className='text-neutral-500'>|</span>
							<span className='text-neutral-600'>8.3k lượt xem</span>
						</div>

						{/* Price */}
						<div className='mb-5'>
							<div className='text-3xl font-bold text-red-600'>
								{Number(product?.price).toLocaleString('vi-VN')}đ
							</div>
						</div>

						{/* Warning Notice */}
						<div className='mb-5 flex items-start gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-800 ring-1 ring-inset ring-green-600/10'>
							<Image
								src='/icons/alert-product.svg'
								alt='Cảnh báo'
								width={20}
								height={20}
								className='mt-0.5 flex-shrink-0'
							/>
							<p>
								<strong>Lưu ý:</strong> Thực phẩm này không phải là thuốc và
								không có tác dụng thay thế thuốc chữa bệnh.
							</p>
						</div>

						{/* Product Info */}
						<div className='mb-6 space-y-3 rounded-lg bg-neutral-50 p-4 text-sm'>
							<div className='flex items-start gap-2'>
								<span className='min-w-[80px] font-semibold text-neutral-700'>
									Nhãn hiệu:
								</span>
								<span className='text-neutral-900'>
									{product?.manufacturer || 'Đang cập nhật'}
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span className='min-w-[80px] font-semibold text-neutral-700'>
									Danh mục:
								</span>
								<span className='text-neutral-900'>
									{product?.category?.name || 'Đang cập nhật'}
								</span>
							</div>
							{product?.detail?.targetUser && (
								<div className='flex items-start gap-2'>
									<span className='min-w-[80px] font-semibold text-neutral-700'>
										Chi tiết:
									</span>
									<span className='text-neutral-900'>
										{product?.description || 'Đang cập nhật'}
									</span>
								</div>
							)}
						</div>

						{/* CTA Buttons */}
						<div className='mb-5 flex flex-col gap-3 sm:flex-row'>
							<Button className='flex-1 rounded-lg bg-orange-500 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md active:scale-[0.98]'>
								Mua ngay
							</Button>
							<Button
								onClick={handleAddItemToCart}
								className='flex-1 rounded-lg border-2 border-orange-500 bg-white px-6 py-3.5 text-base font-semibold text-orange-600 shadow-sm transition-all hover:bg-orange-50 active:scale-[0.98]'
							>
								Thêm vào giỏ
							</Button>
						</div>

						{/* Additional Warning */}
						{product?.detail?.warning && (
							<div className='rounded-lg bg-yellow-50 p-4 text-sm text-yellow-900 ring-1 ring-inset ring-yellow-600/20'>
								<strong className='block mb-1'>⚠️ Cảnh báo</strong>
								{product?.detail.warning}
							</div>
						)}
					</div>
				</div>

				{/* Lightbox */}
				<Lightbox
					open={lightboxOpen}
					close={() => setLightboxOpen(false)}
					slides={lightboxSlides}
					index={lightboxIndex}
					plugins={[Zoom, Thumbnails]}
					zoom={{
						maxZoomPixelRatio: 3,
						scrollToZoom: true,
					}}
					thumbnails={{
						position: 'bottom',
						width: 120,
						height: 80,
						gap: 16,
					}}
					styles={{
						container: {
							backgroundColor: 'rgba(0, 0, 0, 0.85)',
						},
					}}
				/>

				<section className='mt-8 rounded-xl border border-neutral-200 bg-white shadow-sm'>
					{/* Tab Header */}
					<div className='border-b border-neutral-200 bg-neutral-50'>
						<button className='inline-flex items-center gap-2 border-b-2 border-green-600 px-6 py-3.5 text-sm font-semibold text-green-600'>
							<svg
								className='h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 6h16M4 10h16M4 14h16M4 18h16'
								/>
							</svg>
							Nội dung chính
						</button>
					</div>

					{/* Content Sections */}
					<div className='divide-y divide-neutral-100'>
						{/* Mô tả chung */}
						{product?.description && (
							<details className='group' open>
								<summary className='flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-neutral-900 transition-colors hover:bg-neutral-50'>
									<span>Mô tả sản phẩm</span>
									<svg
										className='h-5 w-5 text-neutral-400 transition-transform group-open:rotate-180'
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
								</summary>
								<div className='px-6 pb-4 pt-2 text-sm leading-relaxed text-neutral-700'>
									<p className='whitespace-pre-line'>{product.description}</p>
								</div>
							</details>
						)}

						{/* Thành phần */}
						{product?.detail?.composition && (
							<details className='group'>
								<summary className='flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-neutral-900 transition-colors hover:bg-neutral-50'>
									<span>Thành phần</span>
									<svg
										className='h-5 w-5 text-neutral-400 transition-transform group-open:rotate-180'
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
								</summary>
								<div className='px-6 pb-4 pt-2 text-sm leading-relaxed text-neutral-700'>
									<p className='whitespace-pre-line'>
										{product.detail.composition}
									</p>
								</div>
							</details>
						)}

						{/* Công dụng */}
						{product?.detail?.usageText && (
							<details className='group'>
								<summary className='flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-neutral-900 transition-colors hover:bg-neutral-50'>
									<span>Công dụng</span>
									<svg
										className='h-5 w-5 text-neutral-400 transition-transform group-open:rotate-180'
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
								</summary>
								<div className='px-6 pb-4 pt-2 text-sm leading-relaxed text-neutral-700'>
									<p className='whitespace-pre-line'>
										{product.detail.usageText}
									</p>
								</div>
							</details>
						)}

						{/* Đối tượng sử dụng */}
						{product?.detail?.targetUser && (
							<details className='group'>
								<summary className='flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-neutral-900 transition-colors hover:bg-neutral-50'>
									<span>Đối tượng sử dụng</span>
									<svg
										className='h-5 w-5 text-neutral-400 transition-transform group-open:rotate-180'
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
								</summary>
								<div className='px-6 pb-4 pt-2 text-sm leading-relaxed text-neutral-700'>
									<p className='whitespace-pre-line'>
										{product.detail.targetUser}
									</p>
								</div>
							</details>
						)}

						{/* Liều dùng & Cách dùng */}
						{product?.detail?.dosage && (
							<details className='group'>
								<summary className='flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-neutral-900 transition-colors hover:bg-neutral-50'>
									<span>Cách dùng</span>
									<svg
										className='h-5 w-5 text-neutral-400 transition-transform group-open:rotate-180'
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
								</summary>
								<div className='px-6 pb-4 pt-2 text-sm leading-relaxed text-neutral-700'>
									<div className='space-y-3'>
										<div>
											<h4 className='mb-1 font-semibold text-neutral-900'>
												Cách sử dụng:
											</h4>
											<p className='text-neutral-700'>
												Dùng trực tiếp bằng đường uống.
											</p>
											<p className='text-neutral-700'>
												Có thể pha với nước hoặc sữa.
											</p>
										</div>
										<div>
											<h4 className='mb-1 font-semibold text-neutral-900'>
												Liều dùng:
											</h4>
											<p className='whitespace-pre-line'>
												{product.detail.dosage}
											</p>
										</div>
									</div>
								</div>
							</details>
						)}

						{/* Cảnh báo */}
						{product?.detail?.warning && (
							<details className='group'>
								<summary className='flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-neutral-900 transition-colors hover:bg-neutral-50'>
									<span>Lưu ý khi sử dụng</span>
									<svg
										className='h-5 w-5 text-neutral-400 transition-transform group-open:rotate-180'
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
								</summary>
								<div className='px-6 pb-4 pt-2'>
									<div className='rounded-lg bg-yellow-50 p-4 text-sm text-yellow-900 ring-1 ring-inset ring-yellow-600/20'>
										<p className='whitespace-pre-line'>
											{product.detail.warning}
										</p>
									</div>
								</div>
							</details>
						)}
					</div>
				</section>
			</ContentWrapper>
		</main>
	);
}

export default ProductDetail;
