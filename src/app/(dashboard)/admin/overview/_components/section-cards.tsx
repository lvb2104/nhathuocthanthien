'use client';

import {
	IconPackage,
	IconShoppingCart,
	IconTrendingUp,
	IconUsers,
} from '@tabler/icons-react';
import { useOverviewStatistics } from '@/hooks';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export function SectionCards() {
	const { data, isLoading } = useOverviewStatistics();

	const stats = [
		{
			label: 'Tổng đơn hàng',
			value: data?.data.totalOrders ?? 0,
			icon: IconShoppingCart,
			color: 'text-blue-600',
		},
		{
			label: 'Tổng doanh thu',
			value: new Intl.NumberFormat('vi-VN', {
				style: 'currency',
				currency: 'VND',
			}).format(data?.data.totalRevenue ?? 0),
			icon: IconTrendingUp,
			color: 'text-green-600',
		},
		{
			label: 'Tổng khách hàng',
			value: data?.data.totalUsers ?? 0,
			icon: IconUsers,
			color: 'text-purple-600',
		},
		{
			label: 'Tổng sản phẩm',
			value: data?.data.totalProducts ?? 0,
			icon: IconPackage,
			color: 'text-orange-600',
		},
	];

	return (
		<div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
			{stats.map((stat, index) => {
				const Icon = stat.icon;
				return (
					<Card key={index} className='@container/card'>
						<CardHeader>
							<div className='flex items-start justify-between'>
								<div className='flex-1'>
									<CardDescription className='mb-2'>
										{stat.label}
									</CardDescription>
									<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
										{isLoading ? (
											<div className='bg-muted h-8 w-32 animate-pulse rounded' />
										) : (
											stat.value
										)}
									</CardTitle>
								</div>
								<div className={`rounded-lg bg-muted/50 p-2.5 ${stat.color}`}>
									<Icon className='size-5' />
								</div>
							</div>
						</CardHeader>
					</Card>
				);
			})}
		</div>
	);
}
