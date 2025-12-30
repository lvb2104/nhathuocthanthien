import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { serverGetProductById, serverGetProducts } from '@/services';
import { GetProductsResponse } from '@/types';
import ProductDetail from './_components/product-detail';
import ProductsWidget from '@/components/products-widget';

async function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	try {
		const { id } = await params;
		const product = await serverGetProductById(Number(id));

		// Fetch similar products from the same category
		let similarProducts: GetProductsResponse = {
			data: [],
			pagination: { page: 1, limit: 12, totalItems: 0, totalPages: 0 },
		};
		if (product?.category?.id) {
			try {
				similarProducts = await serverGetProducts({
					categoryId: product.category.id,
					limit: 12,
				});
			} catch (error) {
				// Silently fail if similar products can't be fetched
				console.error('Failed to fetch similar products:', error);
			}
		}

		return (
			<>
				<ProductDetail initialProduct={product} id={id} />
				{product?.category?.id && (
					<ProductsWidget
						title='Sản phẩm tương tự'
						initialProducts={similarProducts}
						params={{
							categoryId: product.category.id,
							limit: 12,
						}}
					/>
				)}
			</>
		);
	} catch (error) {
		throw error;
	}
}

export default ProductDetailPage;
