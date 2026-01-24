import { PharmacistPrescriptionsTable } from './_components/pharmacist-prescriptions-table';

export const dynamic = 'force-dynamic';

export default async function PharmacistPage() {
	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:px-6'>
			<div className='flex items-center'>
				<h1 className='text-lg font-semibold md:text-2xl'>Quản lý đơn thuốc</h1>
			</div>
			<div className='flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm'>
				<PharmacistPrescriptionsTable />
			</div>
		</div>
	);
}
