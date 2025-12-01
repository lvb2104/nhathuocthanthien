import EditProductForm from '@/components/forms/edit-product-form';
import { serverGetCategories, serverGetProductById } from '@/services';

async function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	try {
		const { id } = await params;
		const [categories, product] = await Promise.all([
			serverGetCategories(),
			serverGetProductById(Number(id)),
		]);
		return (
			<EditProductForm
				initialCategories={categories}
				initialProduct={product}
				id={id}
			/>
		);
	} catch (error) {
		throw error;
	}
}

export default EditProductPage;
