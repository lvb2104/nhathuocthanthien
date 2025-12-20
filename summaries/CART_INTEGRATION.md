# Cart Integration Documentation

## Overview

This project integrates the pharmacy backend cart API with the `use-shopping-cart` library to provide a seamless shopping experience.

## Architecture

### Hybrid Approach

- **Frontend Library**: `use-shopping-cart` - Handles UI state, local storage, and checkout flows
- **Backend API**: Pharmacy Retail API - Persists cart data for authenticated users
- **Unified Hook**: `useUnifiedCart` - Bridges both systems

### How It Works

#### For Unauthenticated Users

- Cart data stored in browser's localStorage via `use-shopping-cart`
- Fast, responsive UI with no network calls
- Cart persists across page refreshes (local only)

#### For Authenticated Users

1. **On Login/Mount**: Backend cart synced to local cart
2. **On Cart Actions**:
   - Local cart updated immediately (optimistic update)
   - Backend API called to persist changes
   - On failure, local cart reverts automatically

## Backend API Endpoints

All endpoints are under `/cart`:

| Method | Endpoint           | Body                   | Description           |
| ------ | ------------------ | ---------------------- | --------------------- |
| GET    | `/cart`            | -                      | Fetch user's cart     |
| POST   | `/cart/:productId` | `{ quantity: number }` | Add item to cart      |
| PUT    | `/cart/:productId` | `{ quantity: number }` | Update item quantity  |
| DELETE | `/cart/:productId` | -                      | Remove item from cart |
| DELETE | `/cart`            | -                      | Clear entire cart     |

## File Structure

```
src/
├── hooks/
│   ├── use-cart.ts                 # Fetch cart from backend
│   ├── use-add-to-cart.ts          # Add item mutation
│   ├── use-update-cart-item.ts     # Update quantity mutation
│   ├── use-remove-from-cart.ts     # Remove item mutation
│   ├── use-clear-cart.ts           # Clear cart mutation
│   └── use-unified-cart.ts         # 🌟 Main hook - use this!
├── services/
│   └── cart.ts                     # API service functions
├── types/
│   └── cart.ts                     # TypeScript types
└── components/
    └── providers/
        └── cart-provider.tsx       # use-shopping-cart setup
```

## Usage

### Basic Example

```tsx
import { useUnifiedCart } from '@/hooks';

function ProductPage({ product }) {
	const { addItem, cartCount } = useUnifiedCart();

	const handleAddToCart = async () => {
		try {
			await addItem(
				product.id,
				{
					name: product.name,
					price: Number(product.price),
					image: product.images?.[0]?.imageUrl,
				},
				1, // quantity
			);
			// Success toast shown automatically
		} catch (error) {
			// Error toast shown automatically
		}
	};

	return <button onClick={handleAddToCart}>Add to Cart ({cartCount})</button>;
}
```

### Cart Operations

```tsx
const {
	// State
	cartDetails, // Object with cart items
	cartCount, // Total item count
	formattedTotalPrice, // Formatted price string
	isLoading, // Backend cart loading state
	isAuthenticated, // User auth status

	// Operations
	addItem, // (productId, data, qty) => Promise
	incrementItem, // (productId) => Promise
	decrementItem, // (productId) => Promise
	updateItemQuantity, // (productId, qty) => Promise
	removeItem, // (productId) => Promise
	clearCart, // () => Promise

	// Checkout
	redirectToCheckout, // Stripe checkout redirect
} = useUnifiedCart();
```

## Key Features

### ✅ Optimistic Updates

- UI updates instantly before backend confirms
- Smooth UX with no loading spinners for every action

### ✅ Auto Rollback

- If backend fails, local cart reverts automatically
- User sees accurate state at all times

### ✅ Seamless Auth Transition

- Guest cart → Login → Cart syncs from server
- No data loss, no confusion

### ✅ Error Handling

- All mutations include error toasts
- Detailed error messages from backend

### ✅ Type Safety

- Full TypeScript support throughout
- Proper types for cart items, requests, responses

## Backend Response Format

### GET /cart

```json
{
	"items": [
		{
			"productId": 1,
			"quantity": 2,
			"product": {
				"id": 1,
				"name": "Paracetamol 500mg",
				"price": "15000",
				"description": "Pain relief",
				"images": [{ "id": 1, "imageUrl": "https://..." }]
			}
		}
	],
	"totalPrice": "30000"
}
```

### POST/PUT /cart/:productId

```json
{
	"item": {
		/* CartItem */
	},
	"totalPrice": "45000"
}
```

### DELETE Operations

```json
{
	"totalPrice": "0"
}
```

## Configuration

### Cart Provider Setup

Located in `src/components/providers/cart-provider.tsx`:

```tsx
<ShoppingCartProvider
	mode='payment'
	cartMode='client-only'
	currency='VND'
	language='vi'
	shouldPersist // Enable localStorage
	successUrl={`${baseUrl}/checkout/success`}
	cancelUrl={`${baseUrl}/cart`}
>
	{children}
</ShoppingCartProvider>
```

## Testing Tips

1. **Test as Guest**: Add items → Check localStorage
2. **Test as User**: Add items → Check backend API calls in DevTools
3. **Test Sync**: Login with items in backend → See cart populate
4. **Test Offline**: Disable network → Cart still works locally (guest mode)

## Common Gotchas

### Product ID Types

- Backend uses `number` for productId
- `use-shopping-cart` uses `string` for item.id
- `useUnifiedCart` handles conversion automatically

### Price Format

- Backend returns prices as `string` (e.g., "15000")
- Frontend converts to `number` for calculations
- Use `formattedTotalPrice` for display

### Auth Check

- Uses `next-auth` session for authentication
- Backend queries disabled when not authenticated
- Guest carts stay local-only

## Future Enhancements

- [ ] Migrate guest cart to server on login
- [ ] Real-time cart sync across tabs/devices
- [ ] Cart item stock validation
- [ ] Promotion/coupon integration with backend
- [ ] Cart expiration/cleanup policies

---

**Built with 💚 for Nha Thuoc Than Thien**
