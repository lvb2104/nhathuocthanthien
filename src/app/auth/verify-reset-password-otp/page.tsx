'use client';
import React from 'react';
import VerifyResetPasswordOtpForm from './components/verify-reset-password-otp-form';
import { useAuthStore } from '@/store';
import LoadingScreen from '@/components/custom/loading-screen';
import { useRouter } from 'next/navigation';

function VerifyResetPasswordOtpPage() {
	const { isLoggedIn, hasHydrated } = useAuthStore();
	const router = useRouter();

	if (!hasHydrated) return <LoadingScreen />;

	if (isLoggedIn) router.push('/');

	return (
		<main className='container mx-auto px-6 py-16'>
			<VerifyResetPasswordOtpForm />
		</main>
	);
}

export default VerifyResetPasswordOtpPage;
