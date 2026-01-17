'use client';

import { useUserProfile } from '@/hooks';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileInfoForm from './_components/profile-info-form';
import ChangePasswordForm from './_components/change-password-form';
import ShippingAddressesManagement from './_components/shipping-addresses-management';
import { User, Lock, MapPin } from 'lucide-react';

function ProfilePage() {
	const { data: userProfile, isLoading, isError } = useUserProfile();

	if (isLoading) {
		return (
			<div className='container mx-auto py-8 px-4'>
				<Card>
					<CardHeader>
						<Skeleton className='h-8 w-[200px]' />
						<Skeleton className='h-4 w-[300px]' />
					</CardHeader>
					<CardContent className='space-y-4'>
						<Skeleton className='h-24 w-24 rounded-full mx-auto' />
						<Skeleton className='h-10 w-full' />
						<Skeleton className='h-10 w-full' />
						<Skeleton className='h-10 w-full' />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isError || !userProfile) {
		return (
			<div className='container mx-auto py-8 px-4'>
				<Card>
					<CardContent className='py-8 text-center'>
						<p className='text-destructive'>
							Không thể tải thông tin người dùng
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='container mx-auto py-8 px-4 max-w-4xl'>
			<h1 className='text-3xl font-bold mb-6'>Tài khoản của tôi</h1>

			<Tabs defaultValue='profile' className='w-full'>
				<TabsList className='grid w-full grid-cols-3 mb-6'>
					<TabsTrigger value='profile' className='flex items-center gap-2'>
						<User className='h-4 w-4' />
						Thông tin cá nhân
					</TabsTrigger>
					<TabsTrigger value='security' className='flex items-center gap-2'>
						<Lock className='h-4 w-4' />
						Bảo mật
					</TabsTrigger>
					<TabsTrigger value='addresses' className='flex items-center gap-2'>
						<MapPin className='h-4 w-4' />
						Địa chỉ
					</TabsTrigger>
				</TabsList>

				<TabsContent value='profile'>
					<Card>
						<CardHeader>
							<CardTitle>Thông tin cá nhân</CardTitle>
							<CardDescription>
								Cập nhật thông tin cá nhân và ảnh đại diện của bạn
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ProfileInfoForm userProfile={userProfile} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='security'>
					<Card>
						<CardHeader>
							<CardTitle>Đổi mật khẩu</CardTitle>
							<CardDescription>
								Đảm bảo tài khoản của bạn được bảo mật bằng cách sử dụng mật
								khẩu mạnh
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ChangePasswordForm />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='addresses'>
					<Card>
						<CardContent className='pt-6'>
							<ShippingAddressesManagement />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default ProfilePage;
