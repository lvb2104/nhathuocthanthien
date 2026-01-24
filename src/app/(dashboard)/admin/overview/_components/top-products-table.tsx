'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { useTopSellingProducts } from '@/hooks';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

export function TopProductsTable() {
	const { data, isLoading } = useTopSellingProducts({ limit: 10 });

	return (
		<Card className='@container/card'>
			<CardHeader>
				<CardTitle>Sản phẩm bán chạy</CardTitle>
				<CardDescription>Top 10 sản phẩm có doanh số cao nhất</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='space-y-3'>
						{[...Array(5)].map((_, i) => (
							<div key={i} className='bg-muted h-12 animate-pulse rounded' />
						))}
					</div>
				) : data?.data.length === 0 ? (
					<div className='text-muted-foreground flex h-32 items-center justify-center'>
						Chưa có dữ liệu sản phẩm
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-12'>#</TableHead>
								<TableHead>Tên sản phẩm</TableHead>
								<TableHead className='text-right'>Đã bán</TableHead>
								<TableHead className='text-right'>Doanh thu</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.data.map((item, index) => (
								<TableRow key={item.productId}>
									<TableCell className='font-medium'>{index + 1}</TableCell>
									<TableCell>
										<div className='flex items-center gap-2'>
											{index < 3 && (
												<IconTrendingUp className='text-primary size-4' />
											)}
											{item.product.name}
										</div>
									</TableCell>
									<TableCell className='text-right tabular-nums'>
										{new Intl.NumberFormat('vi-VN').format(item.totalSold)}
									</TableCell>
									<TableCell className='text-right tabular-nums font-medium'>
										{new Intl.NumberFormat('vi-VN', {
											style: 'currency',
											currency: 'VND',
										}).format(item.totalRevenue)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
