import CartCard from './_components/cart-card';
import { serverGetPromotions, serverGetShippingAddresses } from '@/services';

async function CartPage() {
	try {
		// Fetch promotions and shipping addresses in parallel on the server
		// This improves performance by hydrating React Query with initial data
		const [promotions, shippingAddresses] = await Promise.all([
			serverGetPromotions(),
			serverGetShippingAddresses(),
		]);

		return (
			<CartCard
				initialPromotions={promotions}
				initialShippingAddresses={shippingAddresses}
			/>
		);
	} catch {
		// If user is not authenticated or there's an error,
		// render CartCard without initial data (will fetch client-side)
		return <CartCard />;
	}
}

export default CartPage;
