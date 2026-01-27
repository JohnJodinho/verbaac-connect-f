import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User, type RoleType } from '@/types/index';

interface PersonaState {
  user: User | null;
  activeRole: RoleType | 'guest'; // 'guest' is a virtual role when not logged in
  unlockedRoles: RoleType[];
  
  // Actions
  setUser: (user: User | null) => void;
  setActiveRole: (role: RoleType | 'guest') => void;
  unlockRole: (role: RoleType) => void;
}

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set) => ({
      user: null,
      activeRole: 'guest', // Default to guest
      unlockedRoles: [],

      setUser: (user) => set({ user }),
      setActiveRole: (role) => set({ activeRole: role }),
      unlockRole: (role) => set((state) => ({ 
        unlockedRoles: [...new Set([...state.unlockedRoles, role])] 
      })),
    }),
    {
      name: 'persona-storage',
    }
  )
);
