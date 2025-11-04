'use client';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { routes } from '@/configs/routes';
import ResetPasswordForm from '@/components/forms/reset-password-form';

function ResetPasswordPage() {
	const { isLoggedIn, hasHydrated } = useAuthStore();
	const router = useRouter();

	if (!hasHydrated) return <Loading />;

	if (isLoggedIn) router.replace(routes.home);

	return (
		<main className='container mx-auto px-6 py-16'>
			<ResetPasswordForm />
		</main>
	);
}

export default ResetPasswordPage;
