'use client';
import Loading from '@/app/loading';
import { routes } from '@/configs/routes';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

function AuthLayout({ children }: { children: React.ReactNode }) {
	const { isLoggedIn, hasHydrated } = useAuthStore();
	const router = useRouter();

	// Redirect to home if user is already logged in
	useEffect(() => {
		if (!hasHydrated) return;
		if (isLoggedIn) router.replace(routes.home);
	}, [hasHydrated, isLoggedIn, router]);

	// Hide content until auth state is determined and user is confirmed logged out
	if (!hasHydrated || isLoggedIn) return <Loading />;

	return <>{children}</>;
}

export default AuthLayout;
