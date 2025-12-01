import CreateProductForm from '@/components/forms/create-product-form';
import { serverGetCategories } from '@/services';

async function CreateProductPage() {
	try {
		const categories = await serverGetCategories();
		return <CreateProductForm initialCategories={categories} />;
	} catch (error) {
		throw error;
	}
}

export default CreateProductPage;
