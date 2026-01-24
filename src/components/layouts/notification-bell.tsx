'use client';
import {
	useNotifications,
	useMarkNotificationRead,
	useMarkAllNotificationsRead,
	useNotificationSocket,
} from '@/hooks';
import { useSession } from 'next-auth/react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useEffect, useState } from 'react';

export function NotificationBell() {
	const { data: session } = useSession();
	const isAuthenticated = !!session?.user;
	const { data: notifications, isLoading } = useNotifications();
	const { mutate: markAsRead } = useMarkNotificationRead();
	const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } =
		useMarkAllNotificationsRead();

	// Real-time socket notifications
	const { notifications: socketNotifications } = useNotificationSocket();
	const [shake, setShake] = useState(false);

	// Show toast when new notification arrives via socket
	useEffect(() => {
		if (socketNotifications.length > 0) {
			const latest = socketNotifications[socketNotifications.length - 1];

			// Show toast notification
			toast.info(`🔔 ${latest.message}`, {
				position: 'top-right',
				autoClose: 5000,
			});

			// Trigger shake animation
			setShake(true);
			setTimeout(() => setShake(false), 500);
		}
	}, [socketNotifications]);

	if (!isAuthenticated) {
		return null;
	}

	// Only show for authenticated users
	if (!session?.user) {
		return null;
	}

	const unreadCount =
		notifications?.filter(notification => !notification.isRead).length || 0;
	const hasNotifications = (notifications?.length || 0) > 0;

	function handleMarkAllAsRead() {
		markAllAsRead(undefined);
	}

	function handleNotificationClick(id: number, isRead: boolean) {
		if (!isRead) {
			markAsRead(id);
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={`flex items-center cursor-pointer relative p-1 rounded hover:bg-white/10 transition-colors ${
						shake ? 'animate-shake' : ''
					}`}
				>
					<Bell className='w-4 h-4 text-white' />
					{unreadCount > 0 && (
						<span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1'>
							{unreadCount > 99 ? '99+' : unreadCount}
						</span>
					)}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-[380px] max-h-[500px]'>
				<div className='flex items-center justify-between px-2 py-1.5'>
					<DropdownMenuLabel className='p-0'>
						Thông báo
						{unreadCount > 0 && (
							<span className='ml-2 text-xs font-normal text-muted-foreground'>
								({unreadCount} chưa đọc)
							</span>
						)}
					</DropdownMenuLabel>
					{hasNotifications && (
						<Button
							variant='ghost'
							size='sm'
							onClick={handleMarkAllAsRead}
							disabled={isMarkingAllAsRead || unreadCount === 0}
							className='h-7 text-xs'
						>
							Đánh dấu tất cả
						</Button>
					)}
				</div>
				<DropdownMenuSeparator />
				{isLoading ? (
					<div className='py-8 text-center text-sm text-muted-foreground'>
						Đang tải...
					</div>
				) : !hasNotifications ? (
					<div className='py-8 text-center text-sm text-muted-foreground'>
						Không có thông báo
					</div>
				) : (
					<div className='max-h-[400px] overflow-y-auto'>
						{notifications?.map(notification => (
							<DropdownMenuItem
								key={notification.id}
								className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
									!notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''
								}`}
								onClick={() =>
									handleNotificationClick(notification.id, notification.isRead)
								}
							>
								<div className='flex items-start justify-between w-full gap-2'>
									<p className='text-sm flex-1 leading-relaxed'>
										{notification.message}
									</p>
									{!notification.isRead && (
										<span className='w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1' />
									)}
								</div>
								<span className='text-xs text-muted-foreground'>
									{notification.sentAt &&
									!isNaN(new Date(notification.sentAt).getTime())
										? formatDistanceToNow(new Date(notification.sentAt), {
												addSuffix: true,
												locale: vi,
											})
										: 'Vừa xong'}
								</span>
							</DropdownMenuItem>
						))}
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
