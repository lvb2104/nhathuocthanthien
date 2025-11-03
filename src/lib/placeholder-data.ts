export type NavItem = {
	label: string;
	href: string;
	textLinks?: Array<NavItem>;
};
export const navItems: NavItem[] = [
	{
		label: 'Thực phẩm chức năng',
		href: '#',
		textLinks: [
			{
				label: 'Hỗ trợ điều trị',
				href: '#',
			},
			{
				label: 'Tim mạch - tiểu đường - mỡ máu',
				href: '#',
			},
			{
				label: 'Thần kinh não',
				href: '#',
			},
			{
				label: 'Ăn - ngủ - tiêu hóa',
				href: '#',
			},
			{
				label: 'Hoạt huyết dưỡng não',
				href: '#',
			},
			{
				label: 'Hô hấp xoang cảm cúm',
				href: '#',
			},
			{
				label: 'Tăng sức đề kháng',
				href: '#',
			},
		],
	},
	{
		label: 'Mỹ phẩm',
		href: '#',
		textLinks: [
			{
				label: 'Chăm sóc tóc - da đầu',
				href: '#',
			},
			{
				label: 'Chăm sóc da mặt',
				href: '#',
			},
			{
				label: 'Chăm sóc cơ thể',
				href: '#',
			},
		],
	},
	{
		label: 'Mẹ & bé',
		href: '#',
		textLinks: [
			{
				label: 'Miễn dịch',
				href: '#',
			},
			{
				label: 'Trẻ em',
				href: '#',
			},
			{
				label: 'Lợi sữa',
				href: '#',
			},
			{
				label: 'Sữa',
				href: '#',
			},
			{
				label: 'ZinC',
				href: '#',
			},
			{
				label: 'DHA',
				href: '#',
			},
		],
	},
	{
		label: 'Dược phẩm',
		href: '#',
		textLinks: [
			{
				label: 'Không kê đơn',
				href: '#',
			},
			{
				label: 'Đông dược',
				href: '#',
			},
			{
				label: 'Tim mạch',
				href: '#',
			},
			{
				label: 'Tiểu đường',
				href: '#',
			},
			{
				label: 'Huyết áp',
				href: '#',
			},
			{
				label: 'Xương khớp',
				href: '#',
			},
			{
				label: 'Dạ dày',
				href: '#',
			},
			{
				label: 'Tránh thai',
				href: '#',
			},
		],
	},
	{
		label: 'Bệnh học',
		href: '#',
	},
	{
		label: 'Giới thiệu',
		href: '#',
		textLinks: [
			{
				label: 'Cửa hàng',
				href: '#',
			},
			{
				label: 'Thảo dược',
				href: '#',
			},
			{
				label: 'Dược liệu',
				href: '#',
			},
		],
	},
	{
		label: 'Dược thư',
		href: '#',
	},
	{
		label: 'Cỏ may mắn',
		href: '#',
	},
];

export type Slider = {
	imageUrl: string;
	linkUrl: string;
};

export const sliders: Slider[] = [
	{
		imageUrl: '/placeholders/slider-1.jpg',
		linkUrl: '#',
	},
	{
		imageUrl: '/placeholders/slider-2.jpg',
		linkUrl: '#',
	},
	{
		imageUrl: '/placeholders/slider-3.jpg',
		linkUrl: '#',
	},
	{
		imageUrl: '/placeholders/slider-4.jpg',
		linkUrl: '#',
	},
];
