import { CategoriesTable } from '@/app/(dashboard)/admin/categories/_components/categories-table';
import { serverGetCategories } from '@/services';

async function CategoriesPage() {
	try {
		const categories = await serverGetCategories();
		return <CategoriesTable initialCategories={categories} />;
	} catch (error) {
		throw error;
	}
}

export default CategoriesPage;
