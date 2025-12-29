import { ProductsTable } from '@/app/(dashboard)/admin/products/_components/products-table';
import { serverGetCategories, serverGetProducts } from '@/services';

async function ProductsPage() {
	try {
		const categories = await serverGetCategories();
		const response = await serverGetProducts();
		return (
			<ProductsTable
				initialCategories={categories}
				initialProducts={response}
			/>
		);
	} catch (error) {
		throw error;
	}
}

export default ProductsPage;
