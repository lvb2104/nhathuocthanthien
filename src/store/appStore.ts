import { create } from 'zustand'

interface AppState {
	isLoggedIn: boolean
	setLoggedIn: (value: boolean) => void
	emailPendingVerification: string | undefined
	setEmailPendingVerification: (value: string | undefined) => void
}

export const useAppStore = create<AppState>(set => ({
	isLoggedIn: false,
	setLoggedIn: value => set({ isLoggedIn: value }),
	emailPendingVerification: undefined,
	setEmailPendingVerification: value =>
		set({ emailPendingVerification: value }),
}))
