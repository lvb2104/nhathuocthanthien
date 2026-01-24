import { ChartAreaInteractive } from './_components/chart-area-interactive';
import { InventoryAlerts } from './_components/inventory-alerts';
import { SectionCards } from './_components/section-cards';
import { TopProductsTable } from './_components/top-products-table';

function OverviewPage() {
	return (
		<div className='space-y-6'>
			<SectionCards />
			<div className='grid gap-6 px-4 lg:px-6 @3xl/main:grid-cols-2'>
				<ChartAreaInteractive />
				<div className='space-y-6'>
					<TopProductsTable />
					<InventoryAlerts />
				</div>
			</div>
		</div>
	);
}

export default OverviewPage;
