'use client'
import { routes } from '@/configs/routes'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function NotFound() {
	const router = useRouter()

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push(routes.home)
		}, 5000)

		return () => clearTimeout(timer)
	}, [router])

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='text-center'>
				<h1 className='text-4xl font-bold mb-4'>404 - Không tìm thấy trang</h1>
				<p className='text-gray-600'>Đang chuyển hướng về trang chủ...</p>
			</div>
		</div>
	)
}

export default NotFound
