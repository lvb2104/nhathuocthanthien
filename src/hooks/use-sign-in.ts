import { apiEndpoints } from '@/configs/apis';
import { app } from '@/configs/app';
import { handleAxiosError } from '@/lib/utils';
import { SignInRequest } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { getSession, signIn } from 'next-auth/react';

export function useSignIn() {
	return useMutation({
		mutationFn: async (payload: SignInRequest) => {
			const result = await signIn(app.CREDENTIALSPROVIDERID, {
				...payload, // Pass email and password to credentials provider
				redirect: false,
			});

			if (!result) {
				throw new Error('Đăng nhập thất bại. Vui lòng thử lại.');
			}

			if (result.error) {
				throw new Error(result.error);
			}

			const session = await getSession();
			if (!session?.user) {
				throw new Error(
					'Không thể lấy thông tin phiên đăng nhập. Vui lòng thử lại.',
				);
			}

			// Best-effort: set backend auth cookies in the browser for sign-out/refresh expectations
			try {
				const baseUrl =
					process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000/api';
				await fetch(`${baseUrl}${apiEndpoints.auth.signIn}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
					credentials: 'include',
				});
			} catch (err) {
				console.error('Failed to sync backend auth cookies', err);
			}

			return session;
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
