import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type User, type RoleType } from '@/types/index';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  activeRole: RoleType | 'guest';
  unlockedRoles: RoleType[];

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setActiveRole: (role: RoleType | 'guest') => void;
  unlockRole: (role: RoleType) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      activeRole: 'guest',
      unlockedRoles: [],

      login: (user, token) => set({ 
        user, 
        isAuthenticated: true, 
        token,
        activeRole: 'consumer', // Default to consumer on login/register
        unlockedRoles: ['consumer'] // Basic role
      }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        token: null, 
        activeRole: 'guest',
        unlockedRoles: []
      }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      setActiveRole: (role) => set({ activeRole: role }),

      unlockRole: (role) => set((state) => ({
        unlockedRoles: [...new Set([...state.unlockedRoles, role])]
      })),
    }),
    {
      name: 'verbaac-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
