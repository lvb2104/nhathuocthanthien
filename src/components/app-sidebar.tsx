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
import { NavMain } from './nav-main';
import { NavDocuments } from './nav-document';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { routes } from '@/configs/routes';

export const dynamic = 'force-dynamic';
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
				<NavMain items={navConfig.admin.navMain} currentPath={pathName} />
				<NavDocuments
					items={navConfig.admin.documents}
					currentPath={pathName}
				/>
				<NavSecondary
					items={navConfig.admin.navSecondary}
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
