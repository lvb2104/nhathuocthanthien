'use client';
import React from 'react';
import VerifyResetPasswordOtpForm from './components/VerifyResetPasswordOtpForm';
import { useAuthStore } from '@/store';
import LoadingScreen from '@/components/custom/loading-screen';
import NotFound from '@/app/not-found';

function VerifyResetPasswordOtpPage() {
	const { isLoggedIn, hasHydrated } = useAuthStore();

	if (!hasHydrated) {
		return <LoadingScreen />;
	}

	if (isLoggedIn) {
		return <NotFound />;
	}

	return (
		<main className='container mx-auto px-6 py-16'>
			<VerifyResetPasswordOtpForm />
		</main>
	);
}

export default VerifyResetPasswordOtpPage;
