import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CreateBuildingDTO } from '../api/landlord.service';

interface BuildingWizardState {
  step: number;
  data: Partial<CreateBuildingDTO>;
  
  // Actions
  setStep: (step: number) => void;
  updateData: (data: Partial<CreateBuildingDTO>) => void;
  reset: () => void;
}

export const useBuildingWizardStore = create<BuildingWizardState>()(
  persist(
    (set) => ({
      step: 1,
      data: {
        // Initial defaults
        state: 'Plateau',
        city: 'Jos North',
        photos: []
      },

      setStep: (step) => set({ step }),
      
      updateData: (newData) => set((state) => ({ 
        data: { ...state.data, ...newData } 
      })),

      reset: () => set({ 
        step: 1, 
        data: {
          state: 'Plateau',
          city: 'Jos North',
          photos: []
        }
      }),
    }),
    {
      name: 'verbaac-building-wizard', // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
