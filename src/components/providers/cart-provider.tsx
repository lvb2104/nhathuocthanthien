'use client';
import { CartProvider as ShoppingCartProvider } from 'use-shopping-cart';

function CartProvider({ children }: { children: React.ReactNode }) {
	return (
		<ShoppingCartProvider
			mode='payment'
			cartMode='client-only'
			stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
			currency='VND'
			language='vi'
			shouldPersist
			billingAddressCollection={true}
			successUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`}
			cancelUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/cart`}
			allowedCountries={['VN']}
		>
			{children}
		</ShoppingCartProvider>
	);
}

export default CartProvider;
