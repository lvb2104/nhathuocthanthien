import {
	IconCategory,
	IconDashboard,
	IconDatabase,
	IconFileWord,
	IconHelp,
	IconListDetails,
	IconReport,
	IconSearch,
	IconSettings,
	IconShoppingBag,
	IconStar,
	IconTag,
	IconTruck,
	IconUsers,
} from '@tabler/icons-react';
import { routes } from './routes';

export const navConfig = {
	admin: {
		navMain: [
			{
				title: 'Overview',
				url: routes.admin.overview,
				icon: IconDashboard,
			},
			{
				title: 'Products',
				url: routes.admin.products.main,
				icon: IconListDetails,
			},
			{
				title: 'Categories',
				url: routes.admin.categories.main,
				icon: IconCategory,
			},
			{
				title: 'Promotions',
				url: routes.admin.promotions.main,
				icon: IconTag,
			},
			{
				title: 'Batches',
				url: routes.admin.batches.main,
				icon: IconDatabase,
			},
			{
				title: 'Users',
				url: routes.admin.users.main,
				icon: IconUsers,
			},
			{
				title: 'Orders',
				url: routes.admin.orders.main,
				icon: IconShoppingBag,
			},
			{
				title: 'Reviews',
				url: routes.admin.reviews.main,
				icon: IconStar,
			},
			{
				title: 'Deliveries',
				url: routes.admin.deliveries.main,
				icon: IconTruck,
			},
		],
		documents: [
			{
				name: 'Data Library',
				url: '/admin/data-library',
				icon: IconDatabase,
			},
			{
				name: 'Reports',
				url: '/admin/reports',
				icon: IconReport,
			},
			{
				name: 'Word Assistant',
				url: '/admin/word-assistant',
				icon: IconFileWord,
			},
		],
		navSecondary: [
			{
				title: 'Settings',
				url: '/admin/settings',
				icon: IconSettings,
			},
			{
				title: 'Get Help',
				url: '/admin/get-help',
				icon: IconHelp,
			},
			{
				title: 'Search',
				url: '/admin/search',
				icon: IconSearch,
			},
		],
	},
	pharmacist: {},
	employee: {
		navMain: [
			{
				title: 'My Deliveries',
				url: routes.employee.main,
				icon: IconTruck,
			},
		],
		navSecondary: [
			{
				title: 'Get Help',
				url: '/employee/get-help',
				icon: IconHelp,
			},
		],
	},
};
