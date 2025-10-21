import { create } from 'zustand';

interface AppState {
	isDarkMode: boolean;
	setIsDarkMode: (isDarkMode: boolean) => void;
}

export const useAppStore = create<AppState>(set => ({
	isDarkMode: false,
	setIsDarkMode: isDarkMode => set({ isDarkMode }),
}));
