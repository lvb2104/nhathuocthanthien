'use client';

import {
	IconTrendingUp,
	IconFileTypePdf,
	IconFileTypeXls,
} from '@tabler/icons-react';
import { useTopSellingProducts, useExportProducts } from '@/hooks';
import { toast } from 'react-toastify';
import {
	Card,
	CardAction,
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
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TopProductsTable() {
	const { data, isLoading } = useTopSellingProducts({ limit: 10 });
	const exportProducts = useExportProducts();

	const handleExport = (format: 'excel' | 'pdf') => {
		exportProducts.mutate(
			{ format, limit: 10 },
			{
				onSuccess: () => {
					toast.success(
						`Xuất báo cáo ${format === 'excel' ? 'Excel' : 'PDF'} thành công!`,
					);
				},
			},
		);
	};

	return (
		<Card className='@container/card'>
			<CardHeader>
				<CardTitle>Sản phẩm bán chạy</CardTitle>
				<CardDescription>Top 10 sản phẩm có doanh số cao nhất</CardDescription>
				<CardAction>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size='sm'
								variant='outline'
								disabled={exportProducts.isPending}
								className='h-8'
							>
								{exportProducts.isPending ? 'Đang xuất...' : 'Xuất báo cáo'}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem onClick={() => handleExport('excel')}>
								<IconFileTypeXls className='mr-2 size-4' />
								Xuất Excel
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleExport('pdf')}>
								<IconFileTypePdf className='mr-2 size-4' />
								Xuất PDF
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardAction>
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
