import {
	IconCategory,
	IconChartBar,
	IconDashboard,
	IconDatabase,
	IconFileWord,
	IconFolder,
	IconHelp,
	IconListDetails,
	IconReport,
	IconSearch,
	IconSettings,
	IconUsers,
} from '@tabler/icons-react';

export const navConfig = {
	admin: {
		navMain: [
			{
				title: 'Overview',
				url: '/admin/overview',
				icon: IconDashboard,
			},
			{
				title: 'Products',
				url: '/admin/products',
				icon: IconListDetails,
			},
			{
				title: 'Categories',
				url: '/admin/categories',
				icon: IconCategory,
			},
			{
				title: 'Projects',
				url: '/admin/projects',
				icon: IconFolder,
			},
			{
				title: 'Team',
				url: '/admin/team',
				icon: IconUsers,
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
};
