import { app } from '@/configs/app';
import { clientSignIn } from '@/services';
import { SignInRequest } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { getSession, signIn } from 'next-auth/react';
import { toast } from 'react-toastify';

export function useSignIn() {
	return useMutation({
		mutationFn: async (payload: SignInRequest) => {
			// CLIENT: trigger authorize() (SERVER)
			const result = await signIn(app.CREDENTIALS_PROVIDER_ID, {
				...payload, // Pass email and password to credentials provider
				redirect: false,
			});

			if (!result) {
				throw new Error('Đăng nhập thất bại. Vui lòng thử lại.');
			}

			if (result.error) {
				// Check for credentials error (wrong email/password)
				if (result.error === 'CredentialsSignin') {
					throw new Error(
						'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
					);
				}
				throw new Error(result.error);
			}

			const session = await getSession();
			if (!session?.user) {
				throw new Error(
					'Không thể lấy thông tin phiên đăng nhập. Vui lòng thử lại.',
				);
			}

			// CLIENT: call from client to nextjs server proxy to set refresh token cookies
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
	});
}
