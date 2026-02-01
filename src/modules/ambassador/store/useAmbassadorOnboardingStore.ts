/**
 * Ambassador Onboarding Store
 * 
 * Zustand store with persistence for the 3-step ambassador onboarding wizard.
 * Ensures mobile users can resume from where they left off if interrupted.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AmbassadorOnboardingData, AvailabilityStatus } from '../api/ambassador.service';

interface AmbassadorOnboardingState {
  step: number;
  data: Partial<AmbassadorOnboardingData>;
  isComplete: boolean;
  ambassadorDisplayId: string | null;
  
  // Actions
  setStep: (step: number) => void;
  updateData: (updates: Partial<AmbassadorOnboardingData>) => void;
  complete: (displayId: string) => void;
  reset: () => void;
}

const initialData: Partial<AmbassadorOnboardingData> = {
  assignedCampus: '',
  currentZone: '',
  availabilityStatus: 'available' as AvailabilityStatus,
  bankName: '',
  bankCode: '',
  accountNumber: '',
  accountName: '',
  fieldAuditAccepted: false,
  antiCollusionAccepted: false,
};

export const useAmbassadorOnboardingStore = create<AmbassadorOnboardingState>()(
  persist(
    (set) => ({
      step: 1,
      data: initialData,
      isComplete: false,
      ambassadorDisplayId: null,
      
      setStep: (step) => set({ step }),
      
      updateData: (updates) => set((state) => ({
        data: { ...state.data, ...updates },
      })),
      
      complete: (displayId) => set({
        isComplete: true,
        ambassadorDisplayId: displayId,
      }),
      
      reset: () => set({
        step: 1,
        data: initialData,
        isComplete: false,
        ambassadorDisplayId: null,
      }),
    }),
    {
      name: 'verbaac-ambassador-onboarding',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
