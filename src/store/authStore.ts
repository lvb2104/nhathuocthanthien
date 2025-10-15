import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
	isLoggedIn: boolean
	setIsLoggedIn: (isLoggedIn: boolean) => void
	hasHydrated: boolean
	setHasHydrated: (hasHydrated: boolean) => void
	emailPendingVerification: string | undefined
	setEmailPendingVerification: (value: string | undefined) => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			isLoggedIn: false,
			setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
			hasHydrated: false,
			setHasHydrated: hasHydrated => set({ hasHydrated }), // hydrate meaning the process of restoring the state from storage
			emailPendingVerification: undefined,
			setEmailPendingVerification: value =>
				set({ emailPendingVerification: value }),
		}),
		{
			name: 'auth-storage',
			onRehydrateStorage: () => state => {
				state?.setHasHydrated(true)
			}, // first func is called when zustand tries to rehydrate the store from storage, and the second func is called after the rehydration is finished
		},
	),
)
