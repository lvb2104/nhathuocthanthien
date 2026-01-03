import { serverGetOrders } from '@/services';
import { OrdersTable } from './_components/orders-table';

async function OrdersPage() {
	const initialOrders = await serverGetOrders({
		page: 1,
		limit: 10,
	});

	return (
		<div className='flex flex-col gap-6 p-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Orders</h1>
					<p className='text-muted-foreground'>
						Manage and track all customer orders
					</p>
				</div>
			</div>

			<OrdersTable initialOrders={initialOrders} />
		</div>
	);
}

export default OrdersPage;
