'use client';

import { IconDotsVertical, IconLogout } from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { useSignOut } from '@/hooks';
import { routes } from '@/configs/routes';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

export function NavUser() {
	const { isMobile } = useSidebar();
	const { data: session } = useSession();
	const user = session?.user;
	const { mutateAsync } = useSignOut();
	const router = useRouter();

	function handleSignOut() {
		toast.promise(
			mutateAsync().then(() => {
				router.replace(routes.auth.signIn);
			}),
			{
				pending: 'Đang đăng xuất...',
				success: 'Đăng xuất thành công!',
			},
		);
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<Avatar className='h-8 w-8 rounded-lg grayscale'>
								<AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
								<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-medium'>{user?.fullName}</span>
								<span className='text-muted-foreground truncate text-xs'>
									{user?.email}
								</span>
							</div>
							<IconDotsVertical className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}
					>
						<DropdownMenuItem onClick={handleSignOut}>
							<IconLogout />
							Đăng xuất
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
