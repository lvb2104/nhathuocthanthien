import Features from '@/components/layouts/features';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import StoreLocation from '@/components/layouts/store-location';

function StoreLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			{children}
			<Features />
			<StoreLocation />
			<Footer />
		</>
	);
}

export default StoreLayout;
