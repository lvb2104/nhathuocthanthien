'use client';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

export function SideHeader() {
	const pathname = usePathname();
	const pageName =
		pathname === '/employee' ? 'My Deliveries' : pathname.split('/').pop();

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbPage className='capitalize'>{pageName}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
