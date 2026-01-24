'use client';

import { usePathname } from 'next/navigation';

const pathTitles: Record<string, string> = {
	'/pharmacist': 'Quản lý đơn thuốc',
	'/pharmacist/chat': 'Tin nhắn',
};

export function SideHeader() {
	const pathname = usePathname();
	const title = pathTitles[pathname] || 'Dược sĩ';

	return (
		<div className='flex items-center gap-2'>
			<h1 className='text-lg font-semibold'>{title}</h1>
		</div>
	);
}
