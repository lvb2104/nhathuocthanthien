'use client';
import * as React from 'react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { IconInnerShadowTop } from '@tabler/icons-react';
import { navConfig } from '@/configs/nav-config';
import { NavMain } from '../../admin/_components/nav-main';
import { NavUser } from '../../admin/_components/nav-user';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { routes } from '@/configs/routes';
import { NavSecondary } from '../../admin/_components/nav-secondary';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathName = usePathname();

	return (
		<Sidebar collapsible='offcanvas' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className='data-[slot=sidebar-menu-button]:!p-1.5'
						>
							<Link href={routes.home}>
								<IconInnerShadowTop className='!size-5' />
								<span className='text-base font-semibold'>
									Nhà Thuốc Thân Thiện
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navConfig.employee.navMain} currentPath={pathName} />
				<NavSecondary
					items={navConfig.employee.navSecondary}
					className='mt-auto'
					currentPath={pathName}
				/>
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
