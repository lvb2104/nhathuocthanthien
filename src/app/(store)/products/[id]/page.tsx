import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import ProductDetail from '@/components/product-detail';
import { serverGetProductById } from '@/services';

async function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	try {
		const { id } = await params;
		const product = await serverGetProductById(Number(id));
		return <ProductDetail initialProduct={product} id={id} />;
	} catch (error) {
		throw error;
	}
}

export default ProductDetailPage;
