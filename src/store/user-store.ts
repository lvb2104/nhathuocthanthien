import { app } from '@/configs/app';
import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
	persist(
		set => ({
			user: null,
			setUser: (user: User | null) => set({ user }),
		}),
		{
			name: app.localStorageKey.USER_STORAGE,
		},
	),
);
