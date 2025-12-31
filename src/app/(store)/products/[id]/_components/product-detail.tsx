'use client';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import ContentWrapper from '../../../../../components/layouts/content-wrapper';
import { routes } from '@/configs/routes';
import { Product } from '@/types';
import { Button } from '../../../../../components/ui/button';
import Lightbox from 'yet-another-react-lightbox';
import { Zoom, Thumbnails } from 'yet-another-react-lightbox/plugins';
import { useProduct, useProducts, useUnifiedCart } from '@/hooks';
import { toast } from 'react-toastify';
import Loading from '@/app/loading';
import { app } from '@/configs/app';
import Breadcrumbs from '@/components/breadcrumbs';
import { ProductReviewsSection } from './product-reviews-section';

// Certifications data
const certifications = [
	{
		id: 1,
		imageUrl:
			'https://nhathuocthanthien.com.vn/wp-content/uploads/2024/01/dgm_nttt_gmp-logo.jpg',
		title: 'Chứng nhận GMP',
		description:
			'Chứng nhận cơ sở sản xuất đạt tiêu chuẩn theo quy định của Nhà nước, đảm bảo luôn tạo ra sản phẩm đạt chất lượng đăng ký và an toàn cho người sử dụng',
	},
	{
		id: 2,
		imageUrl:
			'https://nhathuocthanthien.com.vn/wp-content/uploads/2024/01/dgm_nttt_giay-phep-quang-cao-thuoc.jpg',
		title: 'Giấy phép quảng cáo thuốc',
		description:
			'Do Cục quản lý Dược – Bộ Y tế xác nhận nội dung quảng cáo thuốc theo đúng quy định của pháp luật và nội dung, tài liệu đã được đăng ký trước đó',
	},
	{
		id: 3,
		imageUrl:
			'https://nhathuocthanthien.com.vn/wp-content/uploads/2024/01/dgm_nttt_ngoi-sao-thuoc-viet.jpg',
		title: 'Ngôi sao thuốc việt',
		description:
			'Giải thưởng uy tín, lần đầu tiên được Cục Quản lý Dược Việt Nam tổ chức bình chọn và trao tặng cho các sản phẩm thuốc sản xuất trong nước',
	},
];

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

	// Certifications carousel state
	const [currentSlide, setCurrentSlide] = useState(0);
	const carouselRef = useRef<HTMLDivElement>(null);

	// Auto-scroll certifications carousel
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide(prev => (prev + 1) % certifications.length);
		}, 5000); // Change slide every 5 seconds

		return () => clearInterval(interval);
	}, []);

	// Fetch most-sold products for sidebar widget
	const { data: mostSoldResponse, isPending: isMostSoldPending } = useProducts({
		limit: 3,
	});
	const mostSoldProducts = mostSoldResponse?.data || [];

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
		}
	}

	return (
		<main className='py-6'>
			<ContentWrapper>
				{/* Breadcrumbs */}
				<Breadcrumbs
					items={[
						{ label: 'Trang chủ', href: routes.home },
						{
							label: product?.category?.name || 'Danh mục',
							href: product?.category?.id
								? routes.category(product.category.id)
								: routes.home,
						},
						{ label: product?.name || '', href: '#' },
					]}
				/>

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

						{/* Share Buttons */}
						<div className='mt-4 border-t border-neutral-200 pt-4'>
							<div className='flex items-center justify-center gap-3'>
								<div className='flex gap-2'>
									{/* Facebook Share */}
									<button
										onClick={() => {
											const url = window.location.href;
											window.open(
												`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
												'_blank',
											);
										}}
										className='group relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-700 hover:scale-110 hover:shadow-md active:scale-95'
										title='Chia sẻ lên Facebook'
									>
										<svg
											className='h-5 w-5'
											fill='currentColor'
											viewBox='0 0 24 24'
										>
											<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
										</svg>
									</button>

									{/* Gmail Share */}
									<button
										onClick={() => {
											const subject = encodeURIComponent(
												`Xem sản phẩm: ${product?.name || ''}`,
											);
											const body = encodeURIComponent(
												`Tôi muốn chia sẻ sản phẩm này với bạn:\n\n${product?.name}\nGiá: ${Number(product?.price).toLocaleString('vi-VN')}đ\n\nXem tại: ${window.location.href}`,
											);
											window.open(
												`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`,
												'_blank',
											);
										}}
										className='group relative flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition-all hover:bg-red-700 hover:scale-110 hover:shadow-md active:scale-95'
										title='Chia sẻ qua Gmail'
									>
										<svg
											className='h-5 w-5'
											fill='currentColor'
											viewBox='0 0 24 24'
										>
											<path d='M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.69 2.28 24 3.434 24 5.457z' />
										</svg>
									</button>

									{/* Instagram Share */}
									<button
										onClick={() => {
											// Instagram doesn't have a web share URL, so we'll copy the link
											navigator.clipboard
												.writeText(window.location.href)
												.then(() => {
													toast.success(
														'Đã sao chép link! Bạn có thể dán vào Instagram.',
													);
												})
												.catch(() => {
													toast.error('Không thể sao chép link');
												});
										}}
										className='group relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white shadow-sm transition-all hover:scale-110 hover:shadow-md active:scale-95'
										title='Sao chép link để chia sẻ lên Instagram'
									>
										<svg
											className='h-5 w-5'
											fill='currentColor'
											viewBox='0 0 24 24'
										>
											<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
										</svg>
									</button>
								</div>
							</div>
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
									Xuất xứ:
								</span>
								<span className='text-neutral-900'>Việt Nam</span>
							</div>
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
										Mô tả:
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

				{/* Content Section with Sidebar */}
				<div className='mt-8 grid gap-6 lg:grid-cols-[1fr_320px]'>
					{/* Main Content - Product Details */}
					<section className='rounded-xl border border-neutral-200 bg-white shadow-sm'>
						{/* Certifications Carousel */}
						<div className='border-b border-neutral-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6'>
							<h2 className='mb-4 text-lg font-bold text-neutral-900'>
								Chứng nhận sản phẩm
							</h2>

							<div className='relative overflow-hidden rounded-lg'>
								{/* Carousel Container */}
								<div
									ref={carouselRef}
									className='flex transition-transform duration-500 ease-in-out'
									style={{ transform: `translateX(-${currentSlide * 100}%)` }}
								>
									{certifications.map(cert => (
										<div key={cert.id} className='w-full flex-shrink-0'>
											<div className='flex items-center gap-4 rounded-lg bg-white shadow-sm p-10'>
												{/* Certificate Image */}
												<div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100'>
													<Image
														src={cert.imageUrl}
														alt={cert.title}
														fill
														className='object-contain p-2'
													/>
												</div>

												{/* Certificate Info */}
												<div className='flex-1 min-w-0'>
													<h3 className='mb-1 font-semibold text-neutral-900'>
														{cert.title}
													</h3>
													<p className='text-xs leading-relaxed text-neutral-600 line-clamp-2'>
														{cert.description}
													</p>
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Navigation Dots */}
								<div className='mt-3 flex items-center justify-center gap-2'>
									{certifications.map((_, index) => (
										<button
											key={index}
											onClick={() => setCurrentSlide(index)}
											className={`h-2 rounded-full transition-all duration-300 ${
												index === currentSlide
													? 'w-6 bg-green-600'
													: 'w-2 bg-neutral-300 hover:bg-neutral-400'
											}`}
											aria-label={`Go to slide ${index + 1}`}
										/>
									))}
								</div>

								{/* Navigation Arrows */}
								<button
									onClick={() =>
										setCurrentSlide(
											prev =>
												(prev - 1 + certifications.length) %
												certifications.length,
										)
									}
									className='absolute left-0 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95'
									aria-label='Previous slide'
								>
									<svg
										className='h-5 w-5'
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
								</button>

								<button
									onClick={() =>
										setCurrentSlide(prev => (prev + 1) % certifications.length)
									}
									className='absolute right-0 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95'
									aria-label='Next slide'
								>
									<svg
										className='h-5 w-5'
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
								</button>
							</div>
						</div>

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
								<details className='group' open>
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
								<details className='group' open>
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
								<details className='group' open>
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
								<details className='group' open>
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
								<details className='group' open>
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

					{/* Sidebar - Sticky */}
					<aside className='hidden lg:block'>
						<div className='sticky top-6 space-y-6'>
							{/* Pharmacist Consultation Card */}
							<div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
								<div className='mb-4 flex items-center gap-3'>
									<div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
										<svg
											className='h-6 w-6 text-green-600'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
											/>
										</svg>
									</div>
									<div>
										<h3 className='font-semibold text-neutral-900'>
											Tư vấn chuyên môn
										</h3>
										<p className='text-xs text-neutral-500'>
											Dược sĩ: Cao Thị Hương
										</p>
									</div>
								</div>

								<div className='mb-4 flex items-center gap-2 text-sm'>
									<span className='inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700'>
										Đang Online
									</span>
								</div>

								<div className='mb-4 space-y-2 text-sm text-neutral-600'>
									<div className='flex items-center gap-2'>
										<svg
											className='h-4 w-4 text-green-600'
											fill='currentColor'
											viewBox='0 0 20 20'
										>
											<path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
										</svg>
										<span className='font-semibold text-green-600'>
											0918893886
										</span>
									</div>
									<div className='flex items-start gap-2'>
										<svg
											className='mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400'
											fill='currentColor'
											viewBox='0 0 20 20'
										>
											<path
												fillRule='evenodd'
												d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
												clipRule='evenodd'
											/>
										</svg>
										<span className='text-xs'>Cam kết hàng chính hãng</span>
									</div>
									<div className='flex items-start gap-2'>
										<svg
											className='mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400'
											fill='currentColor'
											viewBox='0 0 20 20'
										>
											<path
												fillRule='evenodd'
												d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
												clipRule='evenodd'
											/>
										</svg>
										<span className='text-xs'>Đổi trả trong 30 ngày</span>
									</div>
									<div className='flex items-start gap-2'>
										<svg
											className='mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400'
											fill='currentColor'
											viewBox='0 0 20 20'
										>
											<path
												fillRule='evenodd'
												d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
												clipRule='evenodd'
											/>
										</svg>
										<span className='text-xs'>
											Xem hàng tại nhà, thanh toán
										</span>
									</div>
									<div className='flex items-start gap-2'>
										<svg
											className='mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400'
											fill='currentColor'
											viewBox='0 0 20 20'
										>
											<path
												fillRule='evenodd'
												d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
												clipRule='evenodd'
											/>
										</svg>
										<span className='text-xs'>TP.HCM ship ngay sau 2 giờ</span>
									</div>
								</div>

								<div className='flex gap-2'>
									<Button className='flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700'>
										Nhắn tin
									</Button>
									<Button className='rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50'>
										Hồ sơ
									</Button>
								</div>
							</div>

							{/* Most Sold Products Widget */}
							<div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
								<h3 className='mb-4 text-lg font-bold text-neutral-900'>
									Sản phẩm bán chạy
								</h3>
								<div className='space-y-4'>
									{isMostSoldPending ? (
										<div className='text-center py-4 text-sm text-neutral-500'>
											Đang tải...
										</div>
									) : mostSoldProducts.length > 0 ? (
										mostSoldProducts.map(mostSoldProduct => (
											<a
												key={mostSoldProduct.id}
												href={`/products/${mostSoldProduct.id}`}
												className='group flex gap-3 cursor-pointer'
											>
												<div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100'>
													<Image
														src={
															mostSoldProduct.images[0]?.imageUrl ||
															app.DEFAULT_IMAGE_URL
														}
														alt={mostSoldProduct.name}
														fill
														className='object-contain p-2 transition-transform group-hover:scale-110'
													/>
												</div>
												<div className='flex-1 min-w-0'>
													<h4 className='mb-1 truncate text-sm font-semibold text-neutral-900 group-hover:text-green-600'>
														{mostSoldProduct.name}
													</h4>
													<div className='flex items-center gap-2'>
														<span className='text-sm font-bold text-red-600'>
															{Number(mostSoldProduct.price).toLocaleString(
																'vi-VN',
															)}
															đ
														</span>
													</div>
													<div className='mt-1 flex items-center gap-1 text-xs'>
														<span className='text-yellow-400'>★★★★★</span>
														<span className='text-neutral-500'>5.0</span>
													</div>
												</div>
											</a>
										))
									) : (
										<div className='text-center py-4 text-sm text-neutral-500'>
											Không có sản phẩm
										</div>
									)}
								</div>
							</div>
						</div>
					</aside>
				</div>

				{/* Reviews Section */}
				<ProductReviewsSection productId={Number(id)} />
			</ContentWrapper>
		</main>
	);
}

export default ProductDetail;
