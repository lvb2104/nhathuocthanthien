'use client';
import { routes } from '@/configs/routes';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ContentWrapper from './content-wrapper';
import { useSignOut } from '@/hooks';
import { toast } from 'react-toastify';
import router from 'next/router';
import { useAuthStore } from '@/store';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import useIsMobile from '@/hooks/use-is-mobile';
import { NavItem, navItems } from '@/lib/placeholder-data';

function Header() {
	const { mutate } = useSignOut();
	const { isLoggedIn } = useAuthStore();
	const { isMobile } = useIsMobile();

	function handleSignOut() {
		mutate(undefined, {
			onSuccess: () => {
				toast.success('Đăng xuất thành công!');
				router.push(routes.home);
			},
		});
	}
	return (
		<header className='bg-(--primary-color) text-white pb-2'>
			<ContentWrapper>
				{/* Top Bar */}
				<div
					className='flex justify-end align-center gap-2 text-sm pt-2'
					title='Tài khoản của bạn'
				>
					<Link href={routes.profile} className='flex items-center'>
						<Image src='/icons/user.svg' alt='User' width={15} height={15} />
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
								<Image
									src='/icons/list.png'
									alt='Order Tracking'
									width={30}
									height={30}
								/>
							</div>
							<div>
								<div className='text-xs mb-[-2px]'>Tra cứu</div>
								<div className='font-semibold'>Đơn hàng</div>
							</div>
						</div>
						<div className='flex items-center cursor-pointer'>
							<div className='p-2 rounded'>
								<Image
									src='/icons/cart.svg'
									alt='Cart'
									width={30}
									height={30}
								/>
							</div>
							<div>
								<div className='text-xs mb-[-2px]'>Giỏ hàng</div>
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
				<NavigationMenu viewport={isMobile ? true : false}>
					<NavigationMenuList className='flex-wrap'>
						{navItems.map((item: NavItem) => (
							<NavigationMenuItem key={item.label}>
								<NavigationMenuTrigger className='bg-(--primary-color) cursor-pointer'>
									{item.label}
								</NavigationMenuTrigger>
								{item.textLinks ? (
									<NavigationMenuContent className='z-50'>
										{item.textLinks
											? item.textLinks.map(textLink => (
													<NavigationMenuLink
														key={textLink.label || textLink.href}
														href={textLink.href}
													>
														{textLink.label}
													</NavigationMenuLink>
												))
											: null}
									</NavigationMenuContent>
								) : null}
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</ContentWrapper>
		</header>
	);
}

export default Header;
