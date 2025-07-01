import { create } from 'zustand';

interface ProfileStore {
  isOpen: boolean;
  toggleProfile: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isOpen: false,
  toggleProfile: () => set((state) => ({ isOpen: !state.isOpen })),
}));
