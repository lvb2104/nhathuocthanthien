import { serverGetOrders } from '@/services';
import { OrdersTable } from './_components/orders-table';

async function OrdersPage() {
	const initialOrders = await serverGetOrders({
		page: 1,
		limit: 10,
	});

	return <OrdersTable initialOrders={initialOrders} />;
}

export default OrdersPage;
