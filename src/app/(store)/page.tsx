import Loading from '@/app/loading';
import ContentWrapper from '@/components/layouts/content-wrapper';
import Hero from '@/components/layouts/hero';
import ProductsWidget from '@/components/widgets/products-widget';
import MostSoldProductsWidget from '@/components/widgets/most-sold-products-widget';
import {
	serverGetProducts,
	serverGetCategories,
	serverGetMostSoldProducts,
} from '@/services';
import { Suspense } from 'react';
import Image from 'next/image';
import { app } from '@/configs/app';

async function StorePageContent({
	searchParams,
}: {
	searchParams: Promise<{ search?: string }>;
}) {
	try {
		const params = await searchParams; // Get query after ? in server component instead of using useSearchParams which is for client component
		const searchQuery = params.search;

		// If searching, show search results
		if (searchQuery) {
			const searchResponse = await serverGetProducts({ keyword: searchQuery });
			const products = searchResponse.data;

			return (
				<main className='my-2.5'>
					<ContentWrapper>
						<div className='py-8'>
							<h1 className='text-2xl font-bold text-gray-900 mb-2'>
								Kết quả tìm kiếm cho: &quot;{searchQuery}&quot;
							</h1>
							<p className='text-gray-600 mb-6'>
								Tìm thấy {searchResponse.pagination.totalItems} sản phẩm
							</p>
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
															product.images[0]?.imageUrl ||
															app.DEFAULT_IMAGE_URL
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
										Không tìm thấy sản phẩm nào phù hợp
									</p>
								</div>
							)}
						</div>
					</ContentWrapper>
				</main>
			);
		}

		// Default home page - fetch most sold products and categories
		const mostSoldResponse = await serverGetMostSoldProducts({ limit: 12 });

		const categoriesResponse = await serverGetCategories({ limit: 4 });
		const categories = categoriesResponse.data;

		// Fetch products for each category
		const categoryProductsPromises = categories.map(category =>
			serverGetProducts({
				categoryId: category.id,
				limit: 6,
			}),
		);
		const categoryProductsResults = await Promise.all(categoryProductsPromises);

		// Emoji icons for categories
		const emojis = ['💊', '🩺', '💉', '🧪'];

		return (
			<main className='my-2.5'>
				<ContentWrapper>
					<Hero />
					{/* Featured products section */}
					<section>
						{/* Most sold products */}
						<MostSoldProductsWidget
							initialProducts={mostSoldResponse}
							title='🔥 Sản phẩm bán chạy'
							params={{ limit: 12 }}
						/>

						{/* Category-based product widgets */}
						{categories.map((category, index) => (
							<ProductsWidget
								key={category.id}
								initialProducts={categoryProductsResults[index]}
								title={`${emojis[index % emojis.length]} ${category.name}`}
								params={{ categoryId: category.id, limit: 6 }}
							/>
						))}
					</section>
				</ContentWrapper>
			</main>
		);
	} catch (error) {
		throw error;
	}
}

async function StorePage({
	searchParams,
}: {
	searchParams: Promise<{ search?: string }>;
}) {
	return (
		<Suspense fallback={<Loading />}>
			<StorePageContent searchParams={searchParams} />
		</Suspense>
	);
}

export default StorePage;
