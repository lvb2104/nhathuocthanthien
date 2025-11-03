'use client';
import LoadingScreen from '@/components/custom/loading-screen';
import ContentWrapper from '@/components/layouts/content-wrapper';
import Hero from '@/components/layouts/hero';
import { Suspense } from 'react';

function HomeContent() {
	return (
		<main className='my-2.5'>
			<ContentWrapper>
				<Hero />
				{/* Featured products section */}
				<section>
					{/* Most sold products */}
					<div></div>
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
}

function HomePage() {
	return (
		<Suspense fallback={<LoadingScreen />}>
			<HomeContent />
		</Suspense>
	);
}

export default HomePage;
