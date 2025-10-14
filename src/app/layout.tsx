import type { Metadata } from 'next'
import './globals.css'
import AppProviders from '../components/providers/AppProviders'
import { Bounce, ToastContainer } from 'react-toastify'
import NextTopLoader from 'nextjs-toploader'
import { fonts } from '@/configs/fonts'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export const metadata: Metadata = {
	title: 'Pharmacy Retail System',
	description: 'A comprehensive system for managing pharmacy operations',
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
				<Header />
				<AppProviders>{children}</AppProviders>
				<Footer />
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
			</body>
		</html>
	)
}
