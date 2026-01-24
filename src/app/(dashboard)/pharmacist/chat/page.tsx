import { PharmacistChatInterface } from '@/app/(dashboard)/pharmacist/_components/pharmacist-chat-interface';

export const dynamic = 'force-dynamic';

export default async function PharmacistChatPage() {
	return (
		<div className='absolute inset-0 flex flex-col gap-4 p-4 lg:gap-6 lg:px-6'>
			<div className='flex items-center flex-shrink-0'>
				<h1 className='text-lg font-semibold md:text-2xl'>Tin nhắn</h1>
			</div>
			<div className='flex-1 min-h-0 overflow-hidden'>
				<PharmacistChatInterface />
			</div>
		</div>
	);
}
