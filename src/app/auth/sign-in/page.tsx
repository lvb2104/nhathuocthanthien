'use client';
import React from 'react';
import SignInForm from './components/sign-in-form';
import { useAuthStore } from '@/store';
import LoadingScreen from '@/components/custom/loading-screen';
import { useRouter } from 'next/navigation';

function SignInPage() {
	const { isLoggedIn, hasHydrated } = useAuthStore();
	const router = useRouter();

	if (!hasHydrated) return <LoadingScreen />;

	if (isLoggedIn) router.push('/');

	return (
		<main className='container mx-auto px-6 py-16'>
			<SignInForm />
		</main>
	);
}

export default SignInPage;
