import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { SectionCards } from '@/components/section-cards';

function OverviewPage() {
	return (
		<>
			<SectionCards />
			<div className='px-4 lg:px-6'>
				<ChartAreaInteractive />
			</div>
		</>
	);
}

export default OverviewPage;
