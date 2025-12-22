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
	},
	admin: {
		overview: '/admin/overview',
		products: {
			main: '/admin/products',
			create: '/admin/products/create',
			edit: (id: number) => `/admin/products/edit/${id}`,
		},
		categories: {
			main: '/admin/categories',
			create: '/admin/categories/create',
			edit: (id: number) => `/admin/categories/edit/${id}`,
		},
		promotions: {
			main: '/admin/promotions',
			create: '/admin/promotions/create',
			edit: (id: number) => `/admin/promotions/edit/${id}`,
		},
	},
	pharmacist: {
		overview: '/pharmacist/overview',
	},
};
