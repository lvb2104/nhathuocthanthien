'use client';
import React from 'react';
import ResetPasswordForm from './components/reset-password-form';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/custom/loading-screen';

function ResetPasswordPage() {
	const { isLoggedIn, hasHydrated } = useAuthStore();
	const router = useRouter();

	if (!hasHydrated) return <LoadingScreen />;

	if (isLoggedIn) router.push('/');

	return (
		<main className='container mx-auto px-6 py-16'>
			<ResetPasswordForm />
		</main>
	);
}

export default ResetPasswordPage;
