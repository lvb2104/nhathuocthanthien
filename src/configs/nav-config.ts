export const navConfig = {
	admin: {
		label: 'Admin',
		href: '/admin',
		versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
		navMain: [
			{
				title: 'Dashboard',
				url: '#',
				items: [
					{
						title: 'Overview',
						url: '#',
						isActive: true,
					},
					{
						title: 'Analytics',
						url: '#',
						isActive: false,
					},
				],
			},
			{
				title: 'Management',
				url: '#',
				items: [
					{
						title: 'Products',
						url: '#',
						isActive: false,
					},
					{
						title: 'Orders',
						url: '#',
						isActive: false,
					},
					{
						title: 'Customers',
						url: '#',
						isActive: false,
					},
					{
						title: 'Reports',
						url: '#',
						isActive: false,
					},
					{
						title: 'Shipping',
						url: '#',
						isActive: false,
					},
					{
						title: 'Payments',
						url: '#',
						isActive: false,
					},
					{
						title: 'Discounts',
						url: '#',
						isActive: false,
					},
					{
						title: 'Integrations',
						url: '#',
						isActive: false,
					},
					{
						title: 'Settings',
						url: '#',
						isActive: false,
					},
					{
						title: 'Sliders',
						url: '#',
						isActive: false,
					},
					{
						title: 'Banners',
						url: '#',
						isActive: false,
					},
					{
						title: 'Inventories',
						url: '#',
						isActive: false,
					},
					{
						title: 'Categories',
						url: '#',
						isActive: false,
					},
					{
						title: 'Suppliers',
						url: '#',
						isActive: false,
					},
					{
						title: 'Permissions',
						url: '#',
						isActive: false,
					},
				],
			},
			{
				title: 'API Reference',
				url: '#',
				items: [
					{
						title: 'Components',
						url: '#',
						isActive: false,
					},
					{
						title: 'File Conventions',
						url: '#',
						isActive: false,
					},
					{
						title: 'Functions',
						url: '#',
						isActive: false,
					},
					{
						title: 'next.config.js Options',
						url: '#',
						isActive: false,
					},
					{
						title: 'CLI',
						url: '#',
						isActive: false,
					},
					{
						title: 'Edge Runtime',
						url: '#',
						isActive: false,
					},
				],
			},
			{
				title: 'Architecture',
				url: '#',
				items: [
					{
						title: 'Accessibility',
						url: '#',
						isActive: false,
					},
					{
						title: 'Fast Refresh',
						url: '#',
						isActive: false,
					},
					{
						title: 'Next.js Compiler',
						url: '#',
						isActive: false,
					},
					{
						title: 'Supported Browsers',
						url: '#',
						isActive: false,
					},
					{
						title: 'Turbopack',
						url: '#',
						isActive: false,
					},
				],
			},
		],
	},
	pharmacist: {
		label: 'Pharmacist',
		href: '/pharmacist',
		versions: ['1.0.0'],
		navMain: [],
	},
};
