import { DeliveriesTable } from './_components/deliveries-table';

export const dynamic = 'force-dynamic';

export default async function DeliveriesPage() {
	// The table component will handle its own data fetching
	return <DeliveriesTable />;
}
