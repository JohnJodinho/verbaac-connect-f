import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Step1Data, Step2Data, Step3Data } from '../schemas/listing.schema';

// ============================================================================
// TYPES
// ============================================================================

export type WizardStep = 1 | 2 | 3;

interface ListingWizardState {
  // Current step
  currentStep: WizardStep;
  
  // Form data for each step
  step1Data: Partial<Step1Data>;
  step2Data: Partial<Step2Data>;
  step3Data: Partial<Step3Data>;
  
  // Upload state
  uploadingMedia: boolean;
  uploadProgress: number;
  
  // Draft state
  isDirty: boolean;
  lastSavedAt: string | null;
}

interface ListingWizardActions {
  // Navigation
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Data updates
  updateStep1: (data: Partial<Step1Data>) => void;
  updateStep2: (data: Partial<Step2Data>) => void;
  updateStep3: (data: Partial<Step3Data>) => void;
  
  // Media
  setUploadingMedia: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  addMediaUrl: (url: string) => void;
  removeMediaUrl: (url: string) => void;
  
  // Draft management
  markDirty: () => void;
  markSaved: () => void;
  
  // Reset
  reset: () => void;
  
  // Combined data accessor
  getAllData: () => Partial<Step1Data & Step2Data & Step3Data>;
}

type ListingWizardStore = ListingWizardState & ListingWizardActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ListingWizardState = {
  currentStep: 1,
  step1Data: {},
  step2Data: {
    media_urls: [],
    quantity: 1,
  },
  step3Data: {
    allow_pickup: true,
    allow_delivery: false,
  },
  uploadingMedia: false,
  uploadProgress: 0,
  isDirty: false,
  lastSavedAt: null,
};

// ============================================================================
// STORE
// ============================================================================

export const useListingWizard = create<ListingWizardStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navigation
      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => {
        const current = get().currentStep;
        if (current < 3) {
          set({ currentStep: (current + 1) as WizardStep });
        }
      },
      
      prevStep: () => {
        const current = get().currentStep;
        if (current > 1) {
          set({ currentStep: (current - 1) as WizardStep });
        }
      },

      // Data updates
      updateStep1: (data) => set((state) => ({
        step1Data: { ...state.step1Data, ...data },
        isDirty: true,
      })),
      
      updateStep2: (data) => set((state) => ({
        step2Data: { ...state.step2Data, ...data },
        isDirty: true,
      })),
      
      updateStep3: (data) => set((state) => ({
        step3Data: { ...state.step3Data, ...data },
        isDirty: true,
      })),

      // Media
      setUploadingMedia: (uploading) => set({ uploadingMedia: uploading }),
      setUploadProgress: (progress) => set({ uploadProgress: progress }),
      
      addMediaUrl: (url) => set((state) => ({
        step2Data: {
          ...state.step2Data,
          media_urls: [...(state.step2Data.media_urls || []), url],
        },
        isDirty: true,
      })),
      
      removeMediaUrl: (url) => set((state) => ({
        step2Data: {
          ...state.step2Data,
          media_urls: (state.step2Data.media_urls || []).filter((u) => u !== url),
        },
        isDirty: true,
      })),

      // Draft management
      markDirty: () => set({ isDirty: true }),
      markSaved: () => set({ isDirty: false, lastSavedAt: new Date().toISOString() }),

      // Reset
      reset: () => set(initialState),

      // Combined data
      getAllData: () => ({
        ...get().step1Data,
        ...get().step2Data,
        ...get().step3Data,
      }),
    }),
    {
      name: 'verbaac-listing-wizard',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        step1Data: state.step1Data,
        step2Data: state.step2Data,
        step3Data: state.step3Data,
        isDirty: state.isDirty,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);
