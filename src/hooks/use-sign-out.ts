import { handleAxiosError } from '@/lib/utils';
import { signOut as signOutApi } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { signOut as signOutNextAuth } from 'next-auth/react';

export function useSignOut() {
	return useMutation({
		mutationFn: async () => {
			try {
				await signOutApi();
			} finally {
				await signOutNextAuth({ redirect: false });
			}
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
