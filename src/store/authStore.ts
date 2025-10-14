import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
	isLoggedIn: boolean
	setIsLoggedIn: (isLoggedIn: boolean, token?: string) => void
	hasHydrated: boolean
	setHasHydrated: (hasHydrated: boolean) => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			isLoggedIn: false,
			setIsLoggedIn: (isLoggedIn, token) => {
				if (isLoggedIn && token) {
					localStorage.setItem('accessToken', token)
				} else if (!isLoggedIn) {
					localStorage.removeItem('accessToken')
				}
				set({ isLoggedIn })
			},
			hasHydrated: false,
			setHasHydrated: hasHydrated => set({ hasHydrated }), // hydrate meaning the process of restoring the state from storage
		}),
		{
			name: 'auth-storage',
			onRehydrateStorage: () => state => {
				state?.setHasHydrated(true)
			}, // first func is called when zustand tries to rehydrate the store from storage, and the second func is called after the rehydration is finished
		},
	),
)
