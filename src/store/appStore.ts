import { create } from 'zustand'

interface AppState {
	isLoggedIn: boolean
	setLoggedIn: (value: boolean) => void
}

export const useAppStore = create<AppState>(set => ({
	isLoggedIn: false,
	setLoggedIn: value => set({ isLoggedIn: value }),
}))
