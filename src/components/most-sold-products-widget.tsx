'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/hooks';
import { toast } from 'react-toastify';

function MostSoldProductsWidget() {
	const { data: products, isError: isProductsError } = useProducts();

	useEffect(() => {
		if (isProductsError) {
			toast.error('Lỗi khi tải sản phẩm đã bán chạy.');
		}
	}, [isProductsError]);

	return (
		<div className='w-full bg-neutral-50 py-6'>
			<div className='mx-auto max-w-6xl px-4 lg:px-0'>
				<div className='grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
					{products?.map(product => (
						<Link
							href={`/products/${product.id}`}
							key={product.id}
							className='group flex h-full flex-col rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md'
						>
							<div className='relative'>
								<span className='absolute left-2 top-2 rounded-sm bg-green-500 px-2 py-0.5 text-xs font-semibold text-white z-10'>
									Yêu thích
								</span>

								<div className='relative h-44 w-full overflow-hidden rounded-t-xl bg-neutral-100'>
									<Image
										src={
											product.images[0]?.imageUrl ||
											'https://res.cloudinary.com/dh4vuuxwg/image/upload/v1763375954/products/gds5aglnl8u9izxym9hn.jpg'
										}
										alt={product.name}
										fill
										className='object-contain p-4 transition-transform duration-300 group-hover:scale-105'
									/>
								</div>
							</div>

							<div className='flex flex-1 flex-col px-3 pb-3 pt-2'>
								<span className='mb-1 inline-block rounded-sm bg-green-100 px-2 py-0.5 text-[11px] font-semibold uppercase text-green-700'>
									100 túi x 2s
								</span>

								<h3 className='mb-1 line-clamp-2 text-sm font-semibold text-neutral-900'>
									{product.name}
								</h3>

								<div className='mb-1 space-y-0.5 text-[11px] text-neutral-600'>
									<p>
										<span className='font-semibold'>Xuất xứ:</span> Việt Nam
									</p>
									{product.manufacturer && (
										<p>
											<span className='font-semibold'>Nhà sản xuất:</span>{' '}
											{product.manufacturer}
										</p>
									)}
								</div>

								<div className='mt-auto pt-2 text-base font-semibold text-red-600'>
									{Number(product.price).toLocaleString('vi-VN')}đ
								</div>
							</div>
						</Link>
					)) || (
						<h1 className='col-span-full text-center'>
							Không có sản phẩm nào để hiển thị
						</h1>
					)}
				</div>
			</div>
		</div>
	);
}

export default MostSoldProductsWidget;
