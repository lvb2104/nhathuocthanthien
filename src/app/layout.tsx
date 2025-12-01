import type { Metadata } from 'next';
import './globals.css';
import { Bounce, ToastContainer } from 'react-toastify';
import NextTopLoader from 'nextjs-toploader';
import { fonts } from '@/configs/fonts';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import AppProvider from '@/components/providers/app-provider';

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
				<AppProvider>{children}</AppProvider>
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
