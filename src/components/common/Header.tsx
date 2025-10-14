import { routes } from '@/configs/routes'
import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Header() {
	return (
		<header className='px-[10%] py-2 bg-[#54AA00]'>
			{/* Top Bar */}
			<div className='flex justify-end gap-2 text-white text-sm'>
				<Image
					src='/images/user.svg'
					alt='User'
					width={15}
					height={15}
					className=''
				/>
				<Link href={routes.signIn}>Sign In</Link>
				<Link href={routes.signUp}>Sign Up</Link>
			</div>
			{/* Main Header */}
			<div className='container mx-auto flex items-center justify-between'>
				{/* Logo */}
				<div className='flex items-center'>
					<div>
						<Image src='/images/logo.png' alt='Logo' width={100} height={100} />
					</div>
					<div className='text-white'>
						<div className='text-xs uppercase'>Nhà thuốc</div>
						<div className='text-2xl font-bold'>thân thiên</div>
						<div className='text-xs'>Pharmacy</div>
					</div>
				</div>
				{/* Search Bar */}
				<div className='flex-1 max-w-2xl mx-8'>
					<div className='relative'>
						<input
							type='text'
							placeholder='Tìm sản phẩm...'
							className='w-full px-4 py-3 rounded-full pr-12 text-gray-700 bg-white border-none outline-none'
						/>
						<button className='absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full'>
							<Search className='w-5 h-5 text-gray-600' />
						</button>
					</div>
				</div>
				{/* Cart and Order Tracking */}
				<div className='flex items-center gap-6 text-white'>
					<div className='flex items-center gap-2 cursor-pointer'>
						<div className='bg-opacity-20 p-2 rounded'>
							<Image
								src='/images/list.png'
								alt='Order Tracking'
								width={30}
								height={30}
							/>
						</div>
						<div>
							<div className='text-xs'>Tra cứu</div>
							<div className='font-semibold'>Đơn hàng</div>
						</div>
					</div>
					<div className='flex items-center gap-2 cursor-pointer'>
						<div className='bg-opacity-20 p-2 rounded'>
							<Image src='/images/cart.svg' alt='Cart' width={30} height={30} />
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
			<nav className='bg-[#6FA225]'>
				<div className='container mx-auto px-6 flex items-center justify-between text-white text-sm'>
					<button className='px-4 py-2 rounded'>
						Thực phẩm chức năng
						<Image
							src='/images/down-arrow.svg'
							alt='Down Arrow'
							width={10}
							height={10}
							className='inline ml-1'
						/>
					</button>
					<button className='px-4 py-2 rounded'>
						Mỹ phẩm
						<Image
							src='/images/down-arrow.svg'
							alt='Down Arrow'
							width={10}
							height={10}
							className='inline ml-1'
						/>
					</button>
					<button className='px-4 py-2 rounded'>
						Mẹ & bé
						<Image
							src='/images/down-arrow.svg'
							alt='Down Arrow'
							width={10}
							height={10}
							className='inline ml-1'
						/>
					</button>
					<button className='px-4 py-2 rounded'>
						Dược phẩm
						<Image
							src='/images/down-arrow.svg'
							alt='Down Arrow'
							width={10}
							height={10}
							className='inline ml-1'
						/>
					</button>
					<button className='px-4 py-2 rounded'>
						Bao cao su
						<Image
							src='/images/down-arrow.svg'
							alt='Down Arrow'
							width={10}
							height={10}
							className='inline ml-1'
						/>
					</button>
					<button className='px-4 py-2 rounded'>
						Bệnh học
						<Image
							src='/images/down-arrow.svg'
							alt='Down Arrow'
							width={10}
							height={10}
							className='inline ml-1'
						/>
					</button>
					<button className='px-4 py-2 rounded'>
						Giới thiệu
						<Image
							src='/images/down-arrow.svg'
							alt='Down Arrow'
							width={10}
							height={10}
							className='inline ml-1'
						/>
					</button>
					<button className='px-4 py-2 rounded'>
						Dược thư
						<Image
							src='/images/down-arrow.svg'
							alt='Down Arrow'
							width={10}
							height={10}
							className='inline ml-1'
						/>
					</button>
					<button className='px-4 py-2 rounded'>
						Có may mắn
						<Image
							src='/images/down-arrow.svg'
							alt='Down Arrow'
							width={10}
							height={10}
							className='inline ml-1'
						/>
					</button>
				</div>
			</nav>
		</header>
	)
}

export default Header
