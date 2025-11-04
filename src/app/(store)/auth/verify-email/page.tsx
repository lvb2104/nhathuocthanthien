'use client';
import Loading from '@/app/loading';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { routes } from '@/configs/routes';
import VerifyEmailForm from '@/components/forms/verify-email-form';

function VerifyEmailPage() {
	const { isLoggedIn, hasHydrated } = useAuthStore();
	const router = useRouter();

	if (!hasHydrated) return <Loading />;

	if (isLoggedIn) router.replace(routes.home);

	return (
		<main className='container mx-auto px-6 py-16'>
			<VerifyEmailForm />
		</main>
	);
}

export default VerifyEmailPage;
