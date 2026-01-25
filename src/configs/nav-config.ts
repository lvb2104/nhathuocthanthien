import {
	IconCategory,
	IconDashboard,
	IconDatabase,
	IconFileWord,
	IconHelp,
	IconListDetails,
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
				title: 'Tổng quan',
				url: routes.admin.overview,
				icon: IconDashboard,
			},
			{
				title: 'Đơn hàng',
				url: routes.admin.orders.main,
				icon: IconShoppingBag,
			},
			{
				title: 'Sản phẩm',
				url: routes.admin.products.main,
				icon: IconListDetails,
			},
			{
				title: 'Người dùng',
				url: routes.admin.users.main,
				icon: IconUsers,
			},
		],
		navManagement: [
			{
				name: 'Danh mục',
				url: routes.admin.categories.main,
				icon: IconCategory,
			},
			{
				name: 'Lô hàng',
				url: routes.admin.batches.main,
				icon: IconDatabase,
			},
			{
				name: 'Khuyến mãi',
				url: routes.admin.promotions.main,
				icon: IconTag,
			},
			{
				name: 'Giao hàng',
				url: routes.admin.deliveries.main,
				icon: IconTruck,
			},
			{
				name: 'Đánh giá',
				url: routes.admin.reviews.main,
				icon: IconStar,
			},
		],
		navSecondary: [
			{
				title: 'Cài đặt',
				url: '/admin/settings',
				icon: IconSettings,
			},
			{
				title: 'Trợ giúp',
				url: '/admin/get-help',
				icon: IconHelp,
			},
			{
				title: 'Tìm kiếm',
				url: '/admin/search',
				icon: IconSearch,
			},
		],
	},
	pharmacist: {
		navMain: [
			{
				title: 'Quản lý đơn thuốc',
				url: routes.pharmacist.overview,
				icon: IconFileWord,
			},
			{
				title: 'Tin nhắn',
				url: routes.pharmacist.chat,
				icon: IconListDetails, // Using existing icon, can replace with MessageCircle later
			},
		],
		navSecondary: [
			{
				title: 'Trợ giúp',
				url: '/pharmacist/get-help',
				icon: IconHelp,
			},
		],
	},
	employee: {
		navMain: [
			{
				title: 'Giao hàng của tôi',
				url: routes.employee.main,
				icon: IconTruck,
			},
		],
		navSecondary: [
			{
				title: 'Trợ giúp',
				url: '/employee/get-help',
				icon: IconHelp,
			},
		],
	},
};
