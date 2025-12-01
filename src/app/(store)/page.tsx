import Loading from '@/app/loading';
import ContentWrapper from '@/components/layouts/content-wrapper';
import Hero from '@/components/layouts/hero';
import MostSoldProductsWidget from '@/components/most-sold-products-widget';
import { serverGetProducts } from '@/services';
import { Suspense } from 'react';

async function StorePageContent() {
	try {
		const products = await serverGetProducts();
		return (
			<main className='my-2.5'>
				<ContentWrapper>
					<Hero />
					{/* Featured products section */}
					<section>
						{/* Most sold products */}
						<MostSoldProductsWidget initialProducts={products} />
						{/* Categories */}
						<div></div>
						{/* Top search */}
						<div></div>
						{/* Category 1 */}
						<div></div>
						{/* Category 2 */}
						<div></div>
						{/* Category 3 */}
						<div></div>
						{/* Category 4 */}
						<div></div>
						{/* For you */}
						<div></div>
					</section>
				</ContentWrapper>
			</main>
		);
	} catch (error) {
		throw error;
	}
}

function StorePage() {
	return (
		<Suspense fallback={<Loading />}>
			<StorePageContent />
		</Suspense>
	);
}

export default StorePage;
