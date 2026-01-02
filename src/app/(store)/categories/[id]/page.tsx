import Loading from '@/app/loading';
import ContentWrapper from '@/components/layouts/content-wrapper';
import { serverGetProducts, serverGetCategories } from '@/services';
import { Suspense } from 'react';
import Image from 'next/image';
import { app } from '@/configs/app';
import { routes } from '@/configs/routes';
import Breadcrumbs from '@/components/custom/breadcrumbs';

async function CategoryPageContent({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	try {
		const { id } = await params;

		// Fetch category details
		const categoriesResponse = await serverGetCategories();
		const category = categoriesResponse.data.find(c => c.id === Number(id));

		// If category not found, show error
		if (!category) {
			return (
				<main className='my-2.5'>
					<ContentWrapper>
						<div className='py-8'>
							<h1 className='text-2xl font-bold text-gray-900 mb-2'>
								Danh mục không tồn tại
							</h1>
							<p className='text-gray-600 mb-6'>
								Không tìm thấy danh mục này. Vui lòng kiểm tra lại.
							</p>
						</div>
					</ContentWrapper>
				</main>
			);
		}

		// Fetch products for this category
		const response = await serverGetProducts({
			categoryId: Number(id),
			limit: 12,
		});
		const products = response.data;

		// Breadcrumbs items
		const breadcrumbItems = [
			{ label: 'Trang chủ', href: routes.home },
			{ label: category.name, href: `/categories/${id}` },
		];

		return (
			<main className='my-2.5'>
				<ContentWrapper>
					<div className='py-6'>
						{/* Breadcrumbs */}
						<Breadcrumbs items={breadcrumbItems} />

						{/* Category heading */}
						<h1 className='text-2xl font-bold text-gray-900 mb-2 mt-4'>
							{category.name}
						</h1>
						<p className='text-gray-600 mb-6'>
							Tìm thấy {response.pagination.totalItems} sản phẩm
						</p>

						{/* Products grid */}
						{products.length > 0 ? (
							<div className='grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
								{products.map(product => (
									<a
										href={`/products/${product.id}`}
										key={product.id}
										className='cursor-pointer group flex h-full flex-col rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md'
									>
										<div className='relative'>
											<div className='relative h-44 w-full overflow-hidden rounded-t-xl bg-neutral-100'>
												<Image
													src={
														product.images[0]?.imageUrl || app.DEFAULT_IMAGE_URL
													}
													alt={product.name}
													fill
													className='object-contain p-4 transition-transform duration-300 group-hover:scale-105'
												/>
											</div>
										</div>

										<div className='flex flex-1 flex-col px-3 pb-3 pt-2'>
											<h3 className='mb-1 line-clamp-2 text-sm font-semibold text-neutral-900'>
												{product.name}
											</h3>

											{product.description && (
												<p className='mb-1 text-[11px] text-neutral-600 line-clamp-2'>
													{product.description}
												</p>
											)}

											{product.manufacturer && (
												<div className='mb-1 text-[11px] text-neutral-600'>
													<span className='font-semibold'>Nhà sản xuất:</span>{' '}
													{product.manufacturer}
												</div>
											)}

											<div className='mt-auto pt-2 text-base font-semibold text-red-600'>
												{Number(product.price).toLocaleString('vi-VN')}đ
											</div>
										</div>
									</a>
								))}
							</div>
						) : (
							<div className='text-center py-12'>
								<p className='text-gray-500 text-lg'>
									Không tìm thấy sản phẩm nào trong danh mục này
								</p>
							</div>
						)}
					</div>
				</ContentWrapper>
			</main>
		);
	} catch (error) {
		throw error;
	}
}

async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
	return (
		<Suspense fallback={<Loading />}>
			<CategoryPageContent params={params} />
		</Suspense>
	);
}

export default CategoryPage;
