import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SellerOnboardingPartialData } from '../onboarding/schemas/sellerOnboarding.schema';

interface SellerOnboardingState {
  // Current wizard step (1-3)
  step: number;
  
  // Form data accumulated across steps
  data: SellerOnboardingPartialData;
  
  // Completion state for redirect logic
  isComplete: boolean;
  
  // Generated seller display ID after activation
  sellerDisplayId: string | null;

  // Actions
  setStep: (step: number) => void;
  updateData: (newData: SellerOnboardingPartialData) => void;
  complete: (displayId: string) => void;
  reset: () => void;
}

const initialState = {
  step: 1,
  data: {},
  isComplete: false,
  sellerDisplayId: null,
};

export const useSellerOnboardingStore = create<SellerOnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ step }),

      updateData: (newData) =>
        set((state) => ({
          data: { ...state.data, ...newData },
        })),

      complete: (displayId) =>
        set({
          isComplete: true,
          sellerDisplayId: displayId,
        }),

      reset: () => set(initialState),
    }),
    {
      name: 'seller-onboarding-storage',
    }
  )
);
