import { app } from '@/configs/app';
import { handleAxiosError } from '@/lib/utils';
import { clientSignIn } from '@/services';
import { SignInRequest } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { getSession, signIn } from 'next-auth/react';
import { toast } from 'react-toastify';

export function useSignIn() {
	return useMutation({
		mutationFn: async (payload: SignInRequest) => {
			// trigger authorize() function in the server
			const result = await signIn(app.CREDENTIALS_PROVIDER_ID, {
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

			// second call: set refresh token cookies in the browser for sign-out/refresh expectations
			try {
				await clientSignIn(payload);
			} catch (err: any) {
				toast.warn(
					err?.response?.data?.message ||
						'Không thể thiết lập phiên đăng nhập đúng cách. Vui lòng làm mới trang sau khi đăng nhập.',
				);
			}

			return session;
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
