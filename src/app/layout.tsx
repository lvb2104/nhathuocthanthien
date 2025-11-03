import type { Metadata } from 'next';
import './globals.css';
import AppProvider from '../components/providers/app-provider';
import { Bounce, ToastContainer } from 'react-toastify';
import NextTopLoader from 'nextjs-toploader';
import { fonts } from '@/configs/fonts';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import StoreLocation from '@/components/layouts/store-location';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/layouts/header';
import Features from '@/components/layouts/features';
import Footer from '@/components/layouts/footer';
import RefreshTokenClientWrapper from '@/components/refresh-token-client-wrapper';

export const metadata: Metadata = {
	title: 'Nhà thuốc thân thiện',
	description:
		'Nền tảng đặt mua thuốc và sản phẩm chăm sóc sức khỏe trực tuyến hàng đầu Việt Nam',
	icons: {
		icon: '/images/favicon.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${fonts.geistSans.variable} ${fonts.geistMono.variable} antialiased`}
			>
				<NextTopLoader
					color='#11DCE8'
					crawlSpeed={200}
					height={3}
					showSpinner={false}
					shadow={false}
				/>
				<AppProvider>
					<Header />
					{children}
					<Features />
					<StoreLocation />
					<Footer />
					<RefreshTokenClientWrapper />
				</AppProvider>
				<ScrollToTop />
				<ToastContainer
					position='bottom-right'
					autoClose={4000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick={true}
					rtl={false}
					draggable
					pauseOnHover
					theme='light'
					transition={Bounce}
				/>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
