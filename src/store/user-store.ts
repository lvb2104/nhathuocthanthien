import { app } from '@/configs/app';
import { User } from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
	darkMode: boolean;
	setDarkMode: (darkMode: boolean) => void;
	user: User | null;
	setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
	persist(
		set => ({
			darkMode: false,
			setDarkMode: (darkMode: boolean) => set({ darkMode }),
			user: null,
			setUser: (user: User | null) => set({ user }),
		}),
		{
			name: app.localStorageKey.USER_STORAGE,
		},
	),
);
