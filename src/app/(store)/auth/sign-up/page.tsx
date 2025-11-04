'use client';
import Loading from '@/app/loading';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { routes } from '@/configs/routes';
import SignUpForm from '@/components/forms/sign-up-form';

function SignUpPage() {
	const { isLoggedIn, hasHydrated } = useAuthStore();
	const router = useRouter();

	if (!hasHydrated) return <Loading />;

	if (isLoggedIn) router.replace(routes.home);

	return (
		<main className='container mx-auto px-6 py-16'>
			<SignUpForm />
		</main>
	);
}

export default SignUpPage;
