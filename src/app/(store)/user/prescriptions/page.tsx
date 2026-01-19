import { Suspense } from 'react';
import PrescriptionsList from './_components/prescriptions-list';
import { getMyPrescriptions } from '@/services';
import Loading from '@/app/loading';

async function PrescriptionsPageContent() {
	try {
		// Fetch initial prescriptions data on the server
		const initialData = await getMyPrescriptions({ page: 1, limit: 10 });

		return <PrescriptionsList initialData={initialData} />;
	} catch {
		// If user is not authenticated or there's an error,
		// render PrescriptionsList without initial data (will fetch client-side)
		return <PrescriptionsList />;
	}
}

async function PrescriptionsPage() {
	return (
		<Suspense fallback={<Loading />}>
			<PrescriptionsPageContent />
		</Suspense>
	);
}

export default PrescriptionsPage;
