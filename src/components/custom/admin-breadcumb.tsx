'use client';
import { navConfig } from '@/configs/nav-config';
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '../ui/breadcrumb';
import Link from 'next/link';
import { useState } from 'react';
import { useIsMobile } from '@/hooks';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const ITEMS_TO_DISPLAY = 3;

function AdminBreadcumb() {
	const [items, setItems] = useState([navConfig.admin.navMain[0].items[0]]);
	const [isOpen, setIsOpen] = useState(false);
	const isMobile = useIsMobile();

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className='hidden md:block'>
					<BreadcrumbLink asChild>
						<Link href='/'>Home</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator className='hidden lg:block' />
				{items.length > ITEMS_TO_DISPLAY ? (
					<>
						<BreadcrumbItem>
							{!isMobile ? (
								<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
									<DropdownMenuTrigger
										className='flex items-center gap-1'
										aria-label='Toggle menu'
									>
										<BreadcrumbEllipsis className='size-4' />
									</DropdownMenuTrigger>
									<DropdownMenuContent align='start'>
										{items.slice(1, -2).map((item, index) => (
											<DropdownMenuItem key={index}>
												<Link href={item.url ? item.url : '#'}>
													{item.title}
												</Link>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Drawer open={isOpen} onOpenChange={setIsOpen}>
									<DrawerTrigger aria-label='Toggle Menu'>
										<BreadcrumbEllipsis className='h-4 w-4' />
									</DrawerTrigger>
									<DrawerContent>
										<DrawerHeader className='text-left'>
											<DrawerTitle>Navigate to</DrawerTitle>
											<DrawerDescription>
												Select a page to navigate to.
											</DrawerDescription>
										</DrawerHeader>
										<div className='grid gap-1 px-4'>
											{items.slice(1, -2).map((item, index) => (
												<Link
													key={index}
													href={item.url ? item.url : '#'}
													className='py-1 text-sm'
												>
													{item.title}
												</Link>
											))}
										</div>
										<DrawerFooter className='pt-4'>
											<DrawerClose asChild>
												<Button variant='outline'>Close</Button>
											</DrawerClose>
										</DrawerFooter>
									</DrawerContent>
								</Drawer>
							)}
						</BreadcrumbItem>
					</>
				) : null}
				{items.slice(-ITEMS_TO_DISPLAY + 1).map((item, index) => (
					<BreadcrumbItem key={index}>
						{item.url ? (
							<>
								<BreadcrumbLink
									asChild
									className='max-w-20 truncate md:max-w-none'
								>
									<Link href={item.url}>{item.title}</Link>
								</BreadcrumbLink>
								<BreadcrumbSeparator />
							</>
						) : (
							<BreadcrumbPage className='max-w-20 truncate md:max-w-none'>
								{item.title}
							</BreadcrumbPage>
						)}
					</BreadcrumbItem>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export default AdminBreadcumb;
