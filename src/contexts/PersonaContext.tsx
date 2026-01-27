import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RoleType } from '@/types';

interface PersonaState {
  userId: string | null;
  activeRole: RoleType;
  unlockedRoles: RoleType[];
  
  // Actions
  setActiveRole: (role: RoleType) => void;
  unlockRole: (role: RoleType) => void;
  setUserId: (id: string | null) => void;
  resetPersona: () => void;
}

const THEME_CLASSES = [
  'theme-consumer', 
  'theme-seller', 
  'theme-landlord', 
  'theme-agent', 
  'theme-ambassador', 
  'theme-admin'
];

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set, get) => ({
      userId: null,
      activeRole: 'consumer',
      unlockedRoles: ['consumer'], // Default role

      setActiveRole: (role) => {
        set({ activeRole: role });
        
        // Side Effect: Update Body Class
        document.body.classList.remove(...THEME_CLASSES);
        document.body.classList.add(`theme-${role}`);
      },

      unlockRole: (role) => {
        const { unlockedRoles } = get();
        if (!unlockedRoles.includes(role)) {
          set({ unlockedRoles: [...unlockedRoles, role] });
        }
      },

      setUserId: (id) => set({ userId: id }),

      resetPersona: () => {
        set({ 
          userId: null, 
          activeRole: 'consumer', 
          unlockedRoles: ['consumer'] 
        });
        document.body.classList.remove(...THEME_CLASSES);
        document.body.classList.add('theme-consumer');
      }
    }),
    {
      name: 'verbacc-persona-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Ensure theme is applied on page reload
        if (state) {
          document.body.classList.remove(...THEME_CLASSES);
          document.body.classList.add(`theme-${state.activeRole}`);
        }
      }
    }
  )
);
