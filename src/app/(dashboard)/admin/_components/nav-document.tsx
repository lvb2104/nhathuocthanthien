'use client';

import {
	IconDots,
	IconFolder,
	IconShare3,
	IconTrash,
	type Icon,
} from '@tabler/icons-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavDocuments({
	items,
	currentPath,
}: {
	items: {
		name: string;
		url: string;
		icon: Icon;
	}[];
	currentPath?: string;
}) {
	const { isMobile } = useSidebar();

	return (
		<SidebarGroup className='group-data-[collapsible=icon]:hidden'>
			<SidebarGroupLabel>Tài liệu</SidebarGroupLabel>
			<SidebarMenu>
				{items.map(item => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton
							isActive={
								Boolean(currentPath) &&
								(currentPath === item.url || currentPath?.startsWith(item.url))
							}
							asChild
						>
							<Link href={item.url}>
								<item.icon />
								<span>{item.name}</span>
							</Link>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction
									showOnHover
									className='data-[state=open]:bg-accent rounded-sm'
								>
									<IconDots />
									<span className='sr-only'>Thêm</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className='w-24 rounded-lg'
								side={isMobile ? 'bottom' : 'right'}
								align={isMobile ? 'end' : 'start'}
							>
								<DropdownMenuItem>
									<IconFolder />
									<span>Mở</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<IconShare3 />
									<span>Chia sẻ</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem variant='destructive'>
									<IconTrash />
									<span>Xóa</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
