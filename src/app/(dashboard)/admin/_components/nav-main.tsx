'use client';
import { IconCirclePlusFilled, IconMail, type Icon } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavMain({
	items,
	currentPath,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
	}[];
	currentPath?: string;
}) {
	return (
		<SidebarGroup>
			<SidebarGroupContent className='flex flex-col gap-2'>
				<SidebarMenu>
					{items.map(item => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								tooltip={item.title}
								isActive={currentPath === item.url}
								asChild
							>
								<Link href={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
