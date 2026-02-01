import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type User, type RoleType } from '@/types/index';

// Theme classes for persona-based styling
const THEME_CLASSES = [
  'theme-consumer',
  'theme-seller',
  'theme-landlord',
  'theme-agent',
  'theme-ambassador',
  'theme-admin',
  'theme-guest'
] as const;

// Helper to apply theme class to document.body
const applyThemeClass = (role: RoleType | 'guest') => {
  document.body.classList.remove(...THEME_CLASSES);
  document.body.classList.add(`theme-${role}`);
};

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

      login: (user, token) => {
        // Apply consumer theme on login
        applyThemeClass('consumer');
        set({ 
          user, 
          isAuthenticated: true, 
          token,
          activeRole: 'consumer', // Default to consumer on login/register
          unlockedRoles: ['consumer'] // Basic role
        });
      },

      logout: () => {
        // Reset to guest theme on logout
        applyThemeClass('guest');
        set({ 
          user: null, 
          isAuthenticated: false, 
          token: null, 
          activeRole: 'guest',
          unlockedRoles: []
        });
      },

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      setActiveRole: (role) => {
        // Immediately apply theme class to document.body
        applyThemeClass(role);
        set({ activeRole: role });
      },

      unlockRole: (role) => set((state) => ({
        unlockedRoles: [...new Set([...state.unlockedRoles, role])]
      })),
    }),
    {
      name: 'verbaac-auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Apply theme class on page reload/rehydration
        if (state?.activeRole) {
          applyThemeClass(state.activeRole);
        }
      },
    }
  )
);
