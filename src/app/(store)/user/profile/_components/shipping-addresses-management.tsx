'use client';

import { useShippingAddresses } from '@/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import CreateAddressDialog from './create-address-dialog';
import EditAddressDialog from './edit-address-dialog';
import DeleteAddressDialog from './delete-address-dialog';
import { MapPin, Phone, User } from 'lucide-react';

export default function ShippingAddressesManagement() {
	const { data: addresses, isLoading } = useShippingAddresses();

	if (isLoading) {
		return (
			<div className='space-y-4'>
				<Skeleton className='h-10 w-40' />
				<div className='grid gap-4 md:grid-cols-2'>
					<Skeleton className='h-48' />
					<Skeleton className='h-48' />
				</div>
			</div>
		);
	}

	const addressList = addresses || [];

	return (
		<div className='space-y-6'>
			{/* Header with Add Button */}
			<div className='flex items-center justify-between'>
				<div>
					<h3 className='text-lg font-semibold'>Địa chỉ giao hàng</h3>
					<p className='text-sm text-muted-foreground'>
						Quản lý các địa chỉ giao hàng của bạn
					</p>
				</div>
				<CreateAddressDialog />
			</div>

			{/* Address List */}
			{addressList.length === 0 ? (
				<Card>
					<CardContent className='py-12 text-center'>
						<MapPin className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
						<p className='text-muted-foreground mb-4'>
							Bạn chưa có địa chỉ giao hàng nào
						</p>
						<CreateAddressDialog />
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4 md:grid-cols-2'>
					{addressList.map(address => (
						<Card key={address.id} className='relative'>
							<CardContent className='pt-6 space-y-3'>
								{/* Default Badge */}
								{address.isDefault && (
									<Badge className='absolute top-3 right-3' variant='default'>
										Mặc định
									</Badge>
								)}

								{/* Name and Phone */}
								<div className='space-y-2'>
									<div className='flex items-center gap-2 text-foreground'>
										<User className='h-4 w-4 text-muted-foreground' />
										<span className='font-semibold'>{address.fullName}</span>
									</div>
									<div className='flex items-center gap-2 text-muted-foreground'>
										<Phone className='h-4 w-4' />
										<span className='text-sm'>{address.phone}</span>
									</div>
								</div>

								{/* Address */}
								<div className='flex items-start gap-2 text-muted-foreground'>
									<MapPin className='h-4 w-4 mt-0.5 flex-shrink-0' />
									<p className='text-sm'>
										{address.addressLine}
										{address.ward && `, ${address.ward}`}
										{address.district && `, ${address.district}`}
										{address.province && `, ${address.province}`}
									</p>
								</div>

								{/* Note */}
								{address.note && (
									<div className='text-sm text-muted-foreground bg-muted p-2 rounded'>
										<span className='font-medium'>Ghi chú:</span> {address.note}
									</div>
								)}

								{/* Action Buttons */}
								<div className='flex gap-2 pt-2 border-t'>
									<EditAddressDialog address={address} />
									<DeleteAddressDialog address={address} />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
