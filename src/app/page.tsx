import LoadingScreen from '@/components/custom/loading-screen';
import { Suspense } from 'react';

function HomeContent() {
	return (
		<main className='h-screen flex items-center justify-center'>
			<h1>Home Page</h1>
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
