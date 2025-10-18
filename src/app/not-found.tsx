'use client';
import { Button } from '@/components/ui/button';
import { app } from '@/configs/app';
import { routes } from '@/configs/routes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function NotFound() {
	const [cooldown, setCooldown] = useState(app.REDIRECT_COOLDOWN_SECONDS);
	const router = useRouter();

	useEffect(() => {
		if (cooldown <= 0) return;
		const interval = setInterval(() => {
			setCooldown(prev => {
				if (prev <= 1) {
					clearInterval(interval);
					router.push(routes.home);
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [cooldown, router]);

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='text-center'>
				<h1 className='text-4xl font-bold mb-4'>404 - Không tìm thấy trang</h1>
				<p className='text-gray-600'>
					Đang chuyển hướng về trang chủ trong {cooldown} giây...
				</p>
				<Button
					className='w-[40%] bg-[#189dfe] hover:bg-(--primary-color) px-6 py-3 text-white rounded-lg font-semibold transition m-5'
					onClick={() => router.back()}
				>
					Quay lại
				</Button>
			</div>
		</div>
	);
}

export default NotFound;
