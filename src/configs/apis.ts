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
		getById: (id: number) => `/products/${id}`,
		create: '/products',
		update: (id: number) => `/products/${id}`,
		delete: (id: number) => `/products/${id}`,
	},
	categories: {
		getAll: '/categories',
		create: '/categories',
		update: (id: number) => `/categories/${id}`,
		delete: (id: number) => `/categories/${id}`,
	},
	cart: {
		get: '/cart',
		addItem: (id: number) => `/cart/${id}`,
		updateQuantity: (id: number) => `/cart/${id}`,
		deleteItem: (id: number) => `/cart/${id}`,
		clear: '/cart',
	},
};
