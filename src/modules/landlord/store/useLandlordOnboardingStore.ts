import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LandlordOnboardingData, LandlordProfile } from '../api/landlord.service';

interface LandlordOnboardingState {
  step: number;
  data: Partial<LandlordOnboardingData>;
  isComplete: boolean;
  activationId: string | null;
  landlordProfile: LandlordProfile | null;
  
  // Actions
  setStep: (step: number) => void;
  updateData: (data: Partial<LandlordOnboardingData>) => void;
  setActivationSuccess: (displayId: string, profile: LandlordProfile) => void;
  reset: () => void;
}

export const useLandlordOnboardingStore = create<LandlordOnboardingState>()(
  persist(
    (set) => ({
      step: 1,
      data: {},
      isComplete: false,
      activationId: null,
      landlordProfile: null,

      setStep: (step) => set({ step }),
      
      updateData: (newData) => set((state) => ({ 
        data: { ...state.data, ...newData } 
      })),

      setActivationSuccess: (displayId, profile) => set({ 
        isComplete: true, 
        activationId: displayId,
        landlordProfile: profile
      }),

      reset: () => set({ 
        step: 1, 
        data: {}, 
        isComplete: false, 
        activationId: null,
        landlordProfile: null
      }),
    }),
    {
      name: 'verbaac-landlord-onboarding',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
