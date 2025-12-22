import { PromotionsTable } from '@/app/(dashboard)/admin/promotions/_components/promotions-table';
import { serverGetPromotions } from '@/services';

async function PromotionsPage() {
	try {
		const promotions = await serverGetPromotions();
		return <PromotionsTable initialPromotions={promotions} />;
	} catch (error) {
		throw error;
	}
}

export default PromotionsPage;
