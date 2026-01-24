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
				title: 'Tổng quan',
				url: routes.admin.overview,
				icon: IconDashboard,
			},
			{
				title: 'Sản phẩm',
				url: routes.admin.products.main,
				icon: IconListDetails,
			},
			{
				title: 'Danh mục',
				url: routes.admin.categories.main,
				icon: IconCategory,
			},
			{
				title: 'Khuyến mãi',
				url: routes.admin.promotions.main,
				icon: IconTag,
			},
			{
				title: 'Lô hàng',
				url: routes.admin.batches.main,
				icon: IconDatabase,
			},
			{
				title: 'Người dùng',
				url: routes.admin.users.main,
				icon: IconUsers,
			},
			{
				title: 'Đơn hàng',
				url: routes.admin.orders.main,
				icon: IconShoppingBag,
			},
			{
				title: 'Đánh giá',
				url: routes.admin.reviews.main,
				icon: IconStar,
			},
			{
				title: 'Giao hàng',
				url: routes.admin.deliveries.main,
				icon: IconTruck,
			},
		],
		documents: [
			{
				name: 'Thư viện dữ liệu',
				url: '/admin/data-library',
				icon: IconDatabase,
			},
			{
				name: 'Báo cáo',
				url: '/admin/reports',
				icon: IconReport,
			},
			{
				name: 'Trợ lý văn bản',
				url: '/admin/word-assistant',
				icon: IconFileWord,
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
