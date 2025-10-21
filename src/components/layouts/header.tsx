'use client';
import { routes } from '@/configs/routes';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import user from '@/assets/icons/user.svg';
import list from '@/assets/icons/list.png';
import cart from '@/assets/icons/cart.svg';
import downArrow from '@/assets/icons/down-arrow.svg';
import ContentWrapper from './content-wrapper';
import { useSignOut } from '@/hooks';
import { toast } from 'react-toastify';
import router from 'next/router';
import { useAuthStore } from '@/store';

function Header() {
	const { mutate } = useSignOut();
	const { isLoggedIn } = useAuthStore();

	function handleSignOut() {
		mutate(undefined, {
			onSuccess: () => {
				toast.success('Đăng xuất thành công!');
				router.push(routes.home);
			},
		});
	}
	return (
		<header className='bg-(--primary-color) text-white'>
			<ContentWrapper>
				{/* Top Bar */}
				<div
					className='flex justify-end align-center gap-2 text-sm pt-2'
					title='Tài khoản của bạn'
				>
					<Link href={routes.profile} className='flex items-center'>
						<Image src={user} alt='User' width={15} height={15} />
					</Link>
					{isLoggedIn ? (
						<button className='cursor-pointer' onClick={handleSignOut}>
							Đăng xuất
						</button>
					) : (
						<>
							<Link href={routes.auth.signIn}>Đăng nhập</Link> |
							<Link href={routes.auth.signUp}>Đăng ký</Link>
						</>
					)}
				</div>
				{/* Main Header */}
				<div className='flex items-center justify-between pb-2'>
					{/* Logo */}
					<Link className='flex items-center' href={routes.home}>
						<div>
							<Image
								src='/images/logo.png'
								alt='Logo'
								width={100}
								height={100}
							/>
						</div>
						<div>
							<div className='text-xs uppercase'>Nhà thuốc</div>
							<div className='text-2xl font-bold'>thân thiện</div>
							<div className='text-xs'>Pharmacy</div>
						</div>
					</Link>
					{/* Search Bar */}
					<div className='flex-1 max-w-xl mx-8'>
						<div className='relative'>
							<input
								type='text'
								placeholder='Tìm sản phẩm...'
								className='w-full h-10 px-4 py-3 rounded-full pr-12 text-gray-700 bg-white border-none outline-none'
							/>
							<button className='absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full'>
								<Search className='w-5 h-5 text-gray-600' />
							</button>
						</div>
					</div>
					{/* Cart and Order Tracking */}
					<div className='flex items-center gap-4'>
						<div className='flex items-center cursor-pointer'>
							<div className='p-2 rounded'>
								<Image src={list} alt='Order Tracking' width={30} height={30} />
							</div>
							<div>
								<div className='text-xs'>Tra cứu</div>
								<div className='font-semibold'>Đơn hàng</div>
							</div>
						</div>
						<div className='flex items-center cursor-pointer'>
							<div className='p-2 rounded'>
								<Image src={cart} alt='Cart' width={30} height={30} />
							</div>
							<div>
								<div className='text-xs'>Giỏ hàng</div>
								<div className='font-semibold'>
									<span className='rounded-[2px] px-[3px] bg-white text-[#ff5722] font-[500] text-sm text-center'>
										0
									</span>{' '}
									sản phẩm
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Navigation */}
				<nav>
					<div className='container mx-auto px-6 flex items-center justify-between text-sm py-2'>
						<button className='flex justify-center'>
							Thực phẩm chức năng
							<Image
								src={downArrow}
								alt='Down Arrow'
								width={10}
								height={10}
								className='inline ml-1	'
							/>
						</button>
						<button className='flex justify-center'>
							Mỹ phẩm
							<Image
								src={downArrow}
								alt='Down Arrow'
								width={10}
								height={10}
								className='inline ml-1'
							/>
						</button>
						<button className='flex justify-center'>
							Mẹ & bé
							<Image
								src={downArrow}
								alt='Down Arrow'
								width={10}
								height={10}
								className='inline ml-1'
							/>
						</button>
						<button className='flex justify-center'>
							Dược phẩm
							<Image
								src={downArrow}
								alt='Down Arrow'
								width={10}
								height={10}
								className='inline ml-1'
							/>
						</button>
						<button className='flex justify-center'>
							Bao cao su
							<Image
								src={downArrow}
								alt='Down Arrow'
								width={10}
								height={10}
								className='inline ml-1'
							/>
						</button>
						<button className='flex justify-center'>
							Bệnh học
							<Image
								src={downArrow}
								alt='Down Arrow'
								width={10}
								height={10}
								className='inline ml-1'
							/>
						</button>
						<button className='flex justify-center'>
							Giới thiệu
							<Image
								src={downArrow}
								alt='Down Arrow'
								width={10}
								height={10}
								className='inline ml-1'
							/>
						</button>
						<button className='flex justify-center'>
							Dược thư
							<Image
								src={downArrow}
								alt='Down Arrow'
								width={10}
								height={10}
								className='inline ml-1'
							/>
						</button>
						<button className='flex justify-center'>
							Có may mắn
							<Image
								src={downArrow}
								alt='Down Arrow'
								width={10}
								height={10}
								className='inline ml-1'
							/>
						</button>
					</div>
				</nav>
			</ContentWrapper>
		</header>
	);
}

export default Header;
