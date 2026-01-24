import { AppSidebar } from './_components/app-sidebar';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { SideHeader } from './_components/side-header';

export default async function PharmacistLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider className='h-screen'>
			<AppSidebar />
			<SidebarInset className='flex flex-col overflow-auto'>
				<header className='flex h-16 shrink-0 items-center gap-2'>
					<div className='flex items-center gap-2 px-4'>
						<SidebarTrigger className='-ml-1' />
						<Separator orientation='vertical' className='mr-2 h-4' />
						<SideHeader />
					</div>
				</header>
				<div className='relative flex flex-1 flex-col'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
