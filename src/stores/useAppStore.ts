import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeShopId: string | null;
  setActiveShopId: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  activeShopId: null,
  setActiveShopId: (id) => set({ activeShopId: id }),
}));
