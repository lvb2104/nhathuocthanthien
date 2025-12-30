import { Suspense } from 'react';
import OrdersList from './_components/orders-list';
import { serverGetOrders } from '@/services';
import Loading from '@/app/loading';

async function OrdersPageContent() {
	try {
		// Fetch initial orders data on the server
		const initialData = await serverGetOrders({ page: 1, limit: 10 });

		return <OrdersList initialData={initialData} />;
	} catch {
		// If user is not authenticated or there's an error,
		// render OrdersList without initial data (will fetch client-side)
		return <OrdersList />;
	}
}

async function OrdersPage() {
	return (
		<Suspense fallback={<Loading />}>
			<OrdersPageContent />
		</Suspense>
	);
}

export default OrdersPage;
