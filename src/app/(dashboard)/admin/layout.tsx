'use client';
import Loading from '@/app/loading';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/side-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { routes } from '@/configs/routes';
import { useAuthStore, useUserStore } from '@/store';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { hasHydrated, isLoggedIn } = useAuthStore();
	const { user } = useUserStore();

	// Redirect based on auth state and role
	useEffect(() => {
		if (!hasHydrated) return;
		if (!isLoggedIn) {
			router.replace(routes.auth.signIn);
			return;
		}
		if (!user || user.role !== UserRole.ADMIN) {
			router.replace(routes.home);
		}
	}, [hasHydrated, isLoggedIn, user, router]);

	// Hide content until auth state is determined and user is confirmed admin
	if (!hasHydrated || !isLoggedIn || !user || user.role !== UserRole.ADMIN) {
		return <Loading />;
	}

	return (
		<SidebarProvider
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--header-height': 'calc(var(--spacing) * 12)',
				} as React.CSSProperties
			}
		>
			{/* Sidebar */}
			<AppSidebar variant='inset' />
			{/* Main page */}
			<SidebarInset>
				<SiteHeader />
				<div className='flex flex-1 flex-col'>
					<div className='@container/main flex flex-1 flex-col gap-2'>
						<div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
							{children}
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
