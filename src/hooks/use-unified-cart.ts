'use client';
import { useShoppingCart } from 'use-shopping-cart';
import {
	useAddToCart,
	useCart,
	useClearCart,
	useRemoveFromCart,
	useUpdateCartItem,
} from '@/hooks';
import { useSession } from 'next-auth/react';
import { useEffect, useCallback } from 'react';
import { CartItem } from '@/types';

/**
 * 🛒 Unified Cart Hook - The fucking smooth cart integration you need
 *
 * This bad boy combines `use-shopping-cart` (for that buttery UX) with your backend API.
 *
 * **How it works:**
 * 1. **Unauthenticated users**: Cart lives in localStorage via `use-shopping-cart`. Fast as hell.
 * 2. **Authenticated users**:
 *    - Cart syncs with backend on mount (loads server cart → local cart)
 *    - Every cart action (add/update/remove) hits backend AND updates local state
 *    - Optimistic updates for instant UI feedback
 *    - Auto-rollback on backend failures
 *
 * **Backend API Endpoints Used:**
 * - GET /cart - Fetch cart
 * - POST /cart/:productId - Add item (with quantity in body)
 * - PUT /cart/:productId - Update quantity
 * - DELETE /cart/:productId - Remove item
 * - DELETE /cart - Clear entire cart
 *
 * **Usage:**
 * ```tsx
 * const { addItem, cartCount, removeItem, clearCart } = useUnifiedCart();
 *
 * // Add product to cart
 * await addItem(productId, { name, price, image }, quantity);
 *
 * // Remove item
 * await removeItem(productId);
 * ```
 *
 * @returns Unified cart operations and state
 */
export function useUnifiedCart() {
	const { data: session } = useSession();
	const isAuthenticated = !!session?.user;

	// Backend cart operations
	const { data: backendCart, isLoading: isLoadingBackendCart } = useCart();
	const addToCartMutation = useAddToCart();
	const updateCartMutation = useUpdateCartItem();
	const removeFromCartMutation = useRemoveFromCart();
	const clearCartMutation = useClearCart();

	// use-shopping-cart operations (for UI/local state)
	const {
		cartDetails,
		addItem: addItemToLocalCart,
		incrementItem: incrementLocalItem,
		decrementItem: decrementLocalItem,
		setItemQuantity: setLocalItemQuantity,
		removeItem: removeLocalItem,
		clearCart: clearLocalCart,
		cartCount,
		formattedTotalPrice,
		redirectToCheckout,
	} = useShoppingCart();

	/**
	 * Sync backend cart to local cart on mount (for authenticated users)
	 */
	useEffect(() => {
		if (!isAuthenticated || !backendCart?.items) return;

		// Clear local cart first to avoid conflicts
		clearLocalCart();

		// Add each item from backend to local cart
		backendCart.items.forEach((item: CartItem) => {
			const product = item.product;
			addItemToLocalCart(
				{
					id: product.id.toString(),
					name: product.name,
					price: Number(product.price),
					currency: 'VND',
					description: product.description,
					image: product.images?.[0]?.imageUrl,
				},
				{ count: item.quantity },
			);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, backendCart?.items]);

	/**
	 * Add item to cart (with backend sync for authenticated users)
	 */
	const addItem = useCallback(
		async (
			productId: number,
			productData: {
				name: string;
				price: number;
				description?: string;
				image?: string;
			},
			quantity: number = 1,
		) => {
			// Always update local cart for immediate UI feedback
			const currentQuantity = cartDetails?.[productId]?.quantity || 0;

			if (currentQuantity > 0) {
				incrementLocalItem(productId.toString(), { count: quantity });
			} else {
				addItemToLocalCart(
					{
						id: productId.toString(),
						name: productData.name,
						price: productData.price,
						currency: 'VND',
						description: productData.description,
						image: productData.image,
					},
					{ count: quantity },
				);
			}

			// Sync with backend if authenticated
			if (isAuthenticated) {
				try {
					await addToCartMutation.mutateAsync({ productId, quantity });
				} catch (error) {
					// If backend fails, revert local change
					if (currentQuantity > 0) {
						decrementLocalItem(productId.toString(), { count: quantity });
					} else {
						removeLocalItem(productId.toString());
					}
					throw error;
				}
			}
		},
		[
			isAuthenticated,
			cartDetails,
			addToCartMutation,
			addItemToLocalCart,
			incrementLocalItem,
			decrementLocalItem,
			removeLocalItem,
		],
	);

	/**
	 * Update item quantity (with backend sync)
	 */
	const updateItemQuantity = useCallback(
		async (productId: number, quantity: number) => {
			// Optimistic update
			setLocalItemQuantity(productId.toString(), quantity);

			// Sync with backend if authenticated
			if (isAuthenticated) {
				try {
					await updateCartMutation.mutateAsync({ productId, quantity });
				} catch (error) {
					// Revert on error - refetch to get correct state
					// The query invalidation will handle this
					throw error;
				}
			}
		},
		[isAuthenticated, updateCartMutation, setLocalItemQuantity],
	);

	/**
	 * Increment item quantity by 1
	 */
	const incrementItem = useCallback(
		async (productId: number) => {
			const currentQuantity = cartDetails?.[productId]?.quantity || 0;
			await updateItemQuantity(productId, currentQuantity + 1);
		},
		[cartDetails, updateItemQuantity],
	);

	/**
	 * Decrement item quantity by 1
	 */
	const decrementItem = useCallback(
		async (productId: number) => {
			const currentQuantity = cartDetails?.[productId]?.quantity || 0;
			if (currentQuantity > 1) {
				await updateItemQuantity(productId, currentQuantity - 1);
			}
		},
		[cartDetails, updateItemQuantity],
	);

	/**
	 * Remove item from cart (with backend sync)
	 */
	const removeItem = useCallback(
		async (productId: number) => {
			// Optimistic update
			removeLocalItem(productId.toString());

			// Sync with backend if authenticated
			if (isAuthenticated) {
				try {
					await removeFromCartMutation.mutateAsync(productId);
				} catch (error) {
					// The mutation will handle invalidation and refetch
					throw error;
				}
			}
		},
		[isAuthenticated, removeFromCartMutation, removeLocalItem],
	);

	/**
	 * Clear entire cart (with backend sync)
	 */
	const clearCart = useCallback(async () => {
		// Optimistic update
		clearLocalCart();

		// Sync with backend if authenticated
		if (isAuthenticated) {
			try {
				await clearCartMutation.mutateAsync();
			} catch (error) {
				throw error;
			}
		}
	}, [isAuthenticated, clearCartMutation, clearLocalCart]);

	return {
		// Cart state
		cartDetails,
		cartCount,
		formattedTotalPrice,
		backendTotalPrice: backendCart?.totalPrice,
		isLoading: isLoadingBackendCart,

		// Cart operations
		addItem,
		incrementItem,
		decrementItem,
		updateItemQuantity,
		removeItem,
		clearCart,

		// Checkout
		redirectToCheckout,

		// Auth state
		isAuthenticated,
	};
}
