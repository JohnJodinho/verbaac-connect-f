import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Step1Data, type Step2Data } from '../schemas/registration';

interface RegistrationState {
  step: number;
  data: Partial<Step1Data & Step2Data>;
  
  setStep: (step: number) => void;
  updateData: (data: Partial<Step1Data & Step2Data>) => void;
  reset: () => void;
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      step: 1,
      data: {},
      setStep: (step) => set({ step }),
      updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
      reset: () => set({ step: 1, data: {} }),
    }),
    {
      name: 'registration-wizard-storage',
    }
  )
);
