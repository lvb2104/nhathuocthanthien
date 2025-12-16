'use client';
import { routes } from '@/configs/routes';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ContentWrapper from './content-wrapper';
import { useIsMobile, useSignOut, useUnifiedCart } from '@/hooks';
import { toast } from 'react-toastify';
import type { MouseEvent } from 'react';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { NavItem, navItems } from '@/lib/placeholder-data';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { useSession } from 'next-auth/react';

function Header() {
	const { mutateAsync } = useSignOut();
	const isMobile = useIsMobile();
	const router = useRouter();
	const { data: session } = useSession();
	const user = session?.user;
	const isCustomer = user?.role === UserRole.CUSTOMER;
	const { cartCount } = useUnifiedCart();

	function handleSignOut() {
		toast.promise(
			mutateAsync(undefined, {
				onError: (error: any) => {
					toast.error(
						error?.message || 'Đăng xuất thất bại. Vui lòng thử lại!',
					);
				},
			}).then(() => {
				router.replace(routes.home);
			}),
			{
				pending: 'Đang đăng xuất...',
				success: 'Đăng xuất thành công!',
			},
		);
	}

	function handleCartClick(event: MouseEvent<HTMLAnchorElement>) {
		if (isCustomer) return;

		event.preventDefault();
		toast.info(
			user
				? 'Chỉ tài khoản khách hàng mới có thể sử dụng giỏ hàng.'
				: 'Vui lòng đăng nhập để sử dụng giỏ hàng.',
		);

		if (!user) {
			router.push(routes.auth.signIn);
			return;
		}

		router.push(routes.home);
	}

	return (
		<header className='bg-(--primary-color) text-white pb-2'>
			<ContentWrapper>
				{/* Top Bar */}
				<div
					className='flex justify-end align-center gap-2 text-sm pt-2'
					title='Tài khoản của bạn'
				>
					<Link href={routes.user.profile} className='flex items-center'>
						<Image src='/icons/user.svg' alt='User' width={15} height={15} />
					</Link>
					{session?.user ? (
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
					<Link href={routes.home}>
						<div className='relative w-[150px] h-[50px]'>
							<Image
								src='/images/logo.png'
								alt='Logo'
								fill
								className='object-contain'
							/>
						</div>
					</Link>
					{/* Search Bar */}
					<div className='flex-1 max-w-xl'>
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
						<Link
							className='flex items-center cursor-pointer'
							href={
								user?.role === UserRole.ADMIN
									? routes.admin.overview
									: user?.role === UserRole.PHARMACIST
										? routes.pharmacist.overview
										: routes.user.orders
							}
						>
							<div className='p-2 rounded'>
								<Image
									src='/icons/list.png'
									alt='Order Tracking'
									width={30}
									height={30}
								/>
							</div>
							{user?.role === UserRole.ADMIN ? (
								<div>
									<div className='text-xs mb-[-2px]'>Quản lý</div>
									<div className='font-semibold'>Bảng điều khiển</div>
								</div>
							) : user?.role === UserRole.PHARMACIST ? (
								<div>
									<div className='text-xs mb-[-2px]'>Quản lý</div>
									<div className='font-semibold'>Nhà thuốc</div>
								</div>
							) : (
								<div>
									<div className='text-xs mb-[-2px]'>Tra cứu</div>
									<div className='font-semibold'>Đơn hàng</div>
								</div>
							)}
						</Link>
						<Link
							className='flex items-center cursor-pointer'
							href={routes.user.cart}
							onClick={handleCartClick}
						>
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
										{cartCount}
									</span>{' '}
									sản phẩm
								</div>
							</div>
						</Link>
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
