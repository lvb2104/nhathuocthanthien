export const routes = {
	home: '/',
	auth: {
		signIn: '/auth/sign-in',
		signUp: '/auth/sign-up',
		verifyEmail: '/auth/verify-email',
		signOut: '/auth/sign-out',
		forgotPassword: '/auth/forgot-password',
		verifyResetPasswordOtp: '/auth/verify-reset-password-otp',
		resetPassword: '/auth/reset-password',
	},
	user: {
		profile: '/user/profile',
		orders: '/user/orders',
		cart: '/user/cart',
		payment: {
			success: '/user/payment/success',
			cancel: '/user/payment/cancel',
		},
	},
	admin: {
		overview: '/admin/overview',
		products: {
			main: '/admin/products',
		},
		categories: {
			main: '/admin/categories',
		},
		promotions: {
			main: '/admin/promotions',
		},
		batches: {
			main: '/admin/batches',
		},
		users: {
			main: '/admin/users',
		},
		orders: {
			main: '/admin/orders',
		},
		deliveries: {
			main: '/admin/deliveries',
		},
		reviews: {
			main: '/admin/reviews',
		},
	},
	pharmacist: {
		overview: '/pharmacist/overview',
	},
	employee: {
		main: '/employee',
	},
	category: (id: number) => `/categories/${id}`,
	products: {
		detail: (id: number) => `/products/${id}`,
	},
};
