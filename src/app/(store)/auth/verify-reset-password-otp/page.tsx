'use client';
import { useAuthStore } from '@/store';
import Loading from '@/app/loading';
import { useRouter } from 'next/navigation';
import { routes } from '@/configs/routes';
import VerifyResetPasswordOtpForm from '@/components/forms/verify-reset-password-otp-form';

function VerifyResetPasswordOtpPage() {
	const { isLoggedIn, hasHydrated } = useAuthStore();
	const router = useRouter();

	if (!hasHydrated) return <Loading />;

	if (isLoggedIn) router.replace(routes.home);

	return (
		<main className='container mx-auto px-6 py-16'>
			<VerifyResetPasswordOtpForm />
		</main>
	);
}

export default VerifyResetPasswordOtpPage;
