import { app } from '@/configs/app';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
	emailPendingVerification: string | undefined;
	setEmailPendingVerification: (value: string | undefined) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			emailPendingVerification: undefined,
			setEmailPendingVerification: value =>
				set({ emailPendingVerification: value }),
		}),
		{
			name: app.localStorageKey.AUTH_STORAGE,
		},
	),
);
