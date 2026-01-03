import { BatchesTable } from './_components/batches-table';
import { serverGetBatches, serverGetProducts } from '@/services';

export const dynamic = 'force-dynamic';

async function BatchesPage() {
	try {
		const initialBatches = await serverGetBatches();
		const initialProducts = await serverGetProducts();

		return (
			<BatchesTable
				initialBatches={initialBatches}
				initialProducts={initialProducts}
			/>
		);
	} catch (error) {
		throw error;
	}
}

export default BatchesPage;
