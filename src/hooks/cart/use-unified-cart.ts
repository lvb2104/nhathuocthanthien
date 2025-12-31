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
import { useEffect, useCallback, useState, useMemo } from 'react';
import { CartItem, UserRole, Promotion } from '@/types';

/**
 * 🛒 Unified Cart Hook - The fucking smooth cart integration you need
 *
 * This bad boy combines `use-shopping-cart` (for that buttery UX) with your backend API.
 *
 * **How it works:**
 * 1. **Only authenticated customers can use the cart**: every action requires a logged-in customer.
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
	const isCustomer = session?.user?.role === UserRole.CUSTOMER;
	const canUseCart = isAuthenticated && isCustomer;

	// Promotion state
	const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(
		null,
	);

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
		if (!canUseCart || !backendCart?.items) return;

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
					manufacturer: product.manufacturer,
					image: product.images?.[0]?.imageUrl,
				},
				{ count: item.quantity },
			);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [canUseCart, backendCart?.items]);

	/**
	 * Ensure customer cart access
	 */
	const ensureCustomerCartAccess = useCallback(() => {
		if (!canUseCart) {
			throw new Error(
				'Bạn cần đăng nhập bằng tài khoản khách hàng để sử dụng giỏ hàng.',
			);
		}
	}, [canUseCart]);

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
			ensureCustomerCartAccess();
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
			if (canUseCart) {
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
			canUseCart,
			cartDetails,
			addToCartMutation,
			addItemToLocalCart,
			incrementLocalItem,
			decrementLocalItem,
			removeLocalItem,
			ensureCustomerCartAccess,
		],
	);

	/**
	 * Update item quantity (with backend sync)
	 */
	const updateItemQuantity = useCallback(
		async (productId: number, quantity: number) => {
			ensureCustomerCartAccess();
			// Optimistic update
			setLocalItemQuantity(productId.toString(), quantity);

			// Sync with backend if authenticated
			if (canUseCart) {
				try {
					await updateCartMutation.mutateAsync({ productId, quantity });
				} catch (error) {
					// Revert on error - refetch to get correct state
					// The query invalidation will handle this
					throw error;
				}
			}
		},
		[
			canUseCart,
			updateCartMutation,
			setLocalItemQuantity,
			ensureCustomerCartAccess,
		],
	);

	/**
	 * Increment item quantity by 1
	 */
	const incrementItem = useCallback(
		async (productId: number) => {
			ensureCustomerCartAccess();
			const currentQuantity = cartDetails?.[productId]?.quantity || 0;
			await updateItemQuantity(productId, currentQuantity + 1);
		},
		[cartDetails, updateItemQuantity, ensureCustomerCartAccess],
	);

	/**
	 * Decrement item quantity by 1
	 */
	const decrementItem = useCallback(
		async (productId: number) => {
			ensureCustomerCartAccess();
			const currentQuantity = cartDetails?.[productId]?.quantity || 0;
			if (currentQuantity > 1) {
				await updateItemQuantity(productId, currentQuantity - 1);
			}
		},
		[cartDetails, updateItemQuantity, ensureCustomerCartAccess],
	);

	/**
	 * Remove item from cart (with backend sync)
	 */
	const removeItem = useCallback(
		async (productId: number) => {
			ensureCustomerCartAccess();
			// Optimistic update
			removeLocalItem(productId.toString());

			// Sync with backend if authenticated
			if (canUseCart) {
				try {
					await removeFromCartMutation.mutateAsync(productId);
				} catch (error) {
					// The mutation will handle invalidation and refetch
					throw error;
				}
			}
		},
		[
			canUseCart,
			removeFromCartMutation,
			removeLocalItem,
			ensureCustomerCartAccess,
		],
	);

	/**
	 * Clear entire cart (with backend sync)
	 */
	const clearCart = useCallback(async () => {
		ensureCustomerCartAccess();
		// Optimistic update
		clearLocalCart();

		// Sync with backend if authenticated
		if (canUseCart) {
			try {
				await clearCartMutation.mutateAsync();
			} catch (error) {
				throw error;
			}
		}
	}, [canUseCart, clearCartMutation, clearLocalCart, ensureCustomerCartAccess]);

	/**
	 * Apply a promotion to the cart
	 */
	const applyPromotion = useCallback((promotion: Promotion) => {
		setAppliedPromotion(promotion);
	}, []);

	/**
	 * Remove the applied promotion
	 */
	const removePromotion = useCallback(() => {
		setAppliedPromotion(null);
	}, []);

	/**
	 * Calculate discount amount
	 */
	const discountAmount = useMemo(() => {
		if (!appliedPromotion) return 0;
		const subtotal = Object.values(cartDetails || {}).reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
		return (subtotal * appliedPromotion.discountPercent) / 100;
	}, [appliedPromotion, cartDetails]);

	/**
	 * Final total after discount
	 */
	const finalTotalPrice = useMemo(() => {
		const subtotal = Object.values(cartDetails || {}).reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
		return Math.max(0, subtotal - discountAmount);
	}, [cartDetails, discountAmount]);

	/**
	 * Formatted discount amount
	 */
	const formattedDiscountAmount = useMemo(() => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(discountAmount);
	}, [discountAmount]);

	/**
	 * Formatted final total
	 */
	const formattedFinalTotalPrice = useMemo(() => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(finalTotalPrice);
	}, [finalTotalPrice]);

	return {
		// Cart state
		cartDetails,
		cartCount,
		formattedTotalPrice,
		isLoading: isLoadingBackendCart,

		// Cart operations
		addItem,
		incrementItem,
		decrementItem,
		updateItemQuantity,
		removeItem,
		clearCart,

		// Promotion state
		appliedPromotion,
		discountAmount,
		finalTotalPrice,
		formattedDiscountAmount,
		formattedFinalTotalPrice,

		// Promotion operations
		applyPromotion,
		removePromotion,

		// Checkout
		redirectToCheckout,

		// Auth state
		isAuthenticated,
		canUseCart,
	};
}
