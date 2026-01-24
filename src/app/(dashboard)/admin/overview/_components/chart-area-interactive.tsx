'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile';
import { useRevenueStatistics } from '@/hooks';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const chartConfig = {
	revenue: {
		label: 'Doanh thu',
		color: 'var(--primary)',
	},
	orders: {
		label: 'Số đơn hàng',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

export function ChartAreaInteractive() {
	const isMobile = useIsMobile();
	const [timeRange, setTimeRange] = React.useState(30);

	React.useEffect(() => {
		if (isMobile) {
			setTimeRange(7);
		}
	}, [isMobile]);

	// Calculate date range
	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - timeRange);

	const { data, isLoading } = useRevenueStatistics({
		startDate: startDate.toISOString().split('T')[0],
		endDate: endDate.toISOString().split('T')[0],
	});

	const chartData =
		data?.data.map(item => ({
			date: item.date,
			revenue: Number(item.totalRevenue),
			orders: Number(item.orderCount),
		})) ?? [];

	const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
	const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);

	return (
		<Card className='@container/card'>
			<CardHeader>
				<CardTitle>Thống kê doanh thu</CardTitle>
				<CardDescription>
					{isLoading ? (
						<div className='bg-muted h-4 w-48 animate-pulse rounded' />
					) : (
						<>
							<span className='hidden @[540px]/card:block'>
								Tổng{' '}
								{new Intl.NumberFormat('vi-VN', {
									style: 'currency',
									currency: 'VND',
								}).format(totalRevenue)}{' '}
								từ {totalOrders} đơn hàng
							</span>
							<span className='@[540px]/card:hidden'>
								{totalOrders} đơn hàng
							</span>
						</>
					)}
				</CardDescription>
				<CardAction>
					<ToggleGroup
						type='single'
						value={timeRange.toString()}
						onValueChange={value => setTimeRange(Number(value))}
						variant='outline'
						className='hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex'
					>
						<ToggleGroupItem value='90'>3 tháng qua</ToggleGroupItem>
						<ToggleGroupItem value='30'>30 ngày qua</ToggleGroupItem>
						<ToggleGroupItem value='7'>7 ngày qua</ToggleGroupItem>
					</ToggleGroup>
					<Select
						value={timeRange.toString()}
						onValueChange={value => setTimeRange(Number(value))}
					>
						<SelectTrigger
							className='flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden'
							size='sm'
							aria-label='Select a value'
						>
							<SelectValue placeholder='30 ngày qua' />
						</SelectTrigger>
						<SelectContent className='rounded-xl'>
							<SelectItem value='90' className='rounded-lg'>
								3 tháng qua
							</SelectItem>
							<SelectItem value='30' className='rounded-lg'>
								30 ngày qua
							</SelectItem>
							<SelectItem value='7' className='rounded-lg'>
								7 ngày qua
							</SelectItem>
						</SelectContent>
					</Select>
				</CardAction>
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				{isLoading ? (
					<div className='bg-muted aspect-auto h-[250px] w-full animate-pulse rounded' />
				) : chartData.length === 0 ? (
					<div className='text-muted-foreground flex h-[250px] items-center justify-center'>
						Không có dữ liệu trong khoảng thời gian này
					</div>
				) : (
					<ChartContainer
						config={chartConfig}
						className='aspect-auto h-[250px] w-full'
					>
						<AreaChart data={chartData}>
							<defs>
								<linearGradient id='fillRevenue' x1='0' y1='0' x2='0' y2='1'>
									<stop
										offset='5%'
										stopColor='var(--color-revenue)'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='var(--color-revenue)'
										stopOpacity={0.1}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey='date'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tickFormatter={value => {
									const date = new Date(value);
									return date.toLocaleDateString('vi-VN', {
										month: 'short',
										day: 'numeric',
									});
								}}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										labelFormatter={value => {
											return new Date(value).toLocaleDateString('vi-VN', {
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											});
										}}
										formatter={(value, name) => {
											if (name === 'revenue') {
												return new Intl.NumberFormat('vi-VN', {
													style: 'currency',
													currency: 'VND',
												}).format(Number(value));
											}
											return value;
										}}
										indicator='dot'
									/>
								}
							/>
							<Area
								dataKey='revenue'
								type='natural'
								fill='url(#fillRevenue)'
								stroke='var(--color-revenue)'
								strokeWidth={2}
							/>
						</AreaChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
