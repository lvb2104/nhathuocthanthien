'use client';
import React from 'react';
import VerifyEmailForm from './components/verify-email-form';
import LoadingScreen from '@/components/custom/loading-screen';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

function VerifyEmailPage() {
	const { isLoggedIn, hasHydrated } = useAuthStore();
	const router = useRouter();

	if (!hasHydrated) return <LoadingScreen />;

	if (isLoggedIn) router.push('/');

	return (
		<main className='container mx-auto px-6 py-16'>
			<VerifyEmailForm />
		</main>
	);
}

export default VerifyEmailPage;
