import type { Metadata } from 'next'
import './globals.css'
import AppProviders from '../components/providers/AppProviders'
import { Bounce, ToastContainer } from 'react-toastify'
import NextTopLoader from 'nextjs-toploader'
import { fonts } from '@/configs/fonts'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import MoveButton from '@/components/common/MoveButton'
import Features from '@/components/common/Features'
import StoreLocationBar from '@/components/common/StoreLocationBar'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
	title: 'Nhà thuốc thân thiên',
	description:
		'Nền tảng đặt mua thuốc và sản phẩm chăm sóc sức khỏe trực tuyến hàng đầu Việt Nam',
	icons: {
		icon: '/images/logo.png',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
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
				<AppProviders>
					<Header />
					{children}
					<Features />
					<StoreLocationBar />
					<Footer />
				</AppProviders>
				<MoveButton />
				<ToastContainer
					position='bottom-right'
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick={false}
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme='light'
					transition={Bounce}
				/>
				<SpeedInsights />
			</body>
		</html>
	)
}
