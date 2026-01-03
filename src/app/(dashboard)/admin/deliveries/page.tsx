import { DeliveriesTable } from './_components/deliveries-table';

export const dynamic = 'force-dynamic';

export default async function DeliveriesPage() {
	// The table component will handle its own data fetching
	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<div className='flex items-center'>
				<h1 className='text-lg font-semibold md:text-2xl'>Deliveries</h1>
			</div>
			<div className='flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm'>
				<DeliveriesTable />
			</div>
		</div>
	);
}
