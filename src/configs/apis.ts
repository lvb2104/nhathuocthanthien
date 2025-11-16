// defines the API endpoints used in the application
export const apiEndpoints = {
	auth: {
		signIn: '/auth/sign-in',
		refreshToken: '/auth/refresh-token',
		signUp: '/auth/sign-up',
		verifyEmail: '/auth/verify-email',
		forgotPassword: '/auth/forgot-password',
		verifyResetPasswordOtp: '/auth/verify-reset-password-otp',
		resetPassword: '/auth/reset-password',
		signOut: '/auth/sign-out',
	},
	products: {
		getAll: '/products',
		getById: (id: string) => `/products/${id}`,
		create: '/products',
		update: (id: string) => `/products/${id}`,
		delete: (id: string) => `/products/${id}`,
	},
	categories: {
		getAll: '/categories',
		getById: (id: string) => `/categories/${id}`,
		create: '/categories',
		update: (id: string) => `/categories/${id}`,
		delete: (id: string) => `/categories/${id}`,
	},
	cart: {
		getCart: '/cart',
		addItem: (id: string) => `/cart/${id}`,
		updateQuantity: (id: string) => `/cart/${id}`,
		deleteItem: (id: string) => `/cart/${id}`,
		clearCart: '/cart',
	},
};
