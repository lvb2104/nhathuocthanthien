'use client';

import { IconAlertTriangle, IconClock } from '@tabler/icons-react';
import { useInventoryStatistics } from '@/hooks';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function InventoryAlerts() {
	const { data, isLoading } = useInventoryStatistics();

	const lowStockCount = data?.data.lowStockProducts.length ?? 0;
	const nearExpiryCount = data?.data.nearExpiryBatches.length ?? 0;
	const totalAlerts = lowStockCount + nearExpiryCount;

	return (
		<Card className='@container/card'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					Cảnh báo kho hàng
					{totalAlerts > 0 && (
						<Badge variant='destructive' className='text-xs'>
							{totalAlerts}
						</Badge>
					)}
				</CardTitle>
				<CardDescription>Sản phẩm cần chú ý</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='space-y-3'>
						{[...Array(3)].map((_, i) => (
							<div key={i} className='bg-muted h-16 animate-pulse rounded' />
						))}
					</div>
				) : totalAlerts === 0 ? (
					<div className='text-muted-foreground flex h-32 items-center justify-center'>
						Không có cảnh báo nào
					</div>
				) : (
					<div className='space-y-4'>
						{/* Low Stock Products */}
						{lowStockCount > 0 && (
							<div>
								<div className='mb-3 flex items-center gap-2 text-sm font-medium'>
									<IconAlertTriangle className='text-destructive size-4' />
									Sắp hết hàng ({lowStockCount})
								</div>
								<div className='space-y-2'>
									{data?.data.lowStockProducts.map(item => (
										<div
											key={item.productId}
											className='border-destructive/20 bg-destructive/5 flex items-center justify-between rounded-lg border p-3'
										>
											<div className='flex-1'>
												<p className='text-sm font-medium'>
													{item.product.name}
												</p>
												<p className='text-muted-foreground text-xs'>
													ID: {item.product.id}
												</p>
											</div>
											<Badge variant='destructive' className='text-xs'>
												{item.totalQuantity} còn lại
											</Badge>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Near Expiry Batches */}
						{nearExpiryCount > 0 && (
							<div>
								<div className='mb-3 flex items-center gap-2 text-sm font-medium'>
									<IconClock className='text-warning size-4' />
									Sắp hết hạn ({nearExpiryCount})
								</div>
								<div className='space-y-2'>
									{data?.data.nearExpiryBatches.map(batch => (
										<div
											key={batch.id}
											className='border-warning/20 bg-warning/5 flex items-center justify-between rounded-lg border p-3'
										>
											<div className='flex-1'>
												<p className='text-sm font-medium'>
													{batch.product.name}
												</p>
												<p className='text-muted-foreground text-xs'>
													Hết hạn:{' '}
													{new Date(batch.expiryDate).toLocaleDateString(
														'vi-VN',
													)}
												</p>
											</div>
											<Badge variant='outline' className='text-xs'>
												{batch.quantity} sản phẩm
											</Badge>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
