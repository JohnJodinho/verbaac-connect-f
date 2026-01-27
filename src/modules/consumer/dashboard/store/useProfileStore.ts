import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

interface ProfileFormData {
  // Global Identity
  firstName: string;
  lastName: string;
  middleName: string;
  gender: 'male' | 'female' | '';
  dateOfBirth: string;
  
  // Student Profile
  institution: string;
  matricNo: string;
  level: number | null;
  preferredZones: string[];
  
  // Buyer Profile
  savedCategories: string[];
}

interface ProfileState {
  // Form data
  formData: ProfileFormData;
  originalData: ProfileFormData | null;
  
  // State flags
  isDirty: boolean;
  isSaving: boolean;
  
  // Actions
  initializeFromUser: (user: User) => void;
  setField: <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => void;
  setMultipleFields: (updates: Partial<ProfileFormData>) => void;
  resetForm: () => void;
  markAsSaved: () => void;
  setIsSaving: (saving: boolean) => void;
}

const defaultFormData: ProfileFormData = {
  firstName: '',
  lastName: '',
  middleName: '',
  gender: '',
  dateOfBirth: '',
  institution: '',
  matricNo: '',
  level: null,
  preferredZones: [],
  savedCategories: [],
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      formData: { ...defaultFormData },
      originalData: null,
      isDirty: false,
      isSaving: false,

      initializeFromUser: (user: User) => {
        const data: ProfileFormData = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          middleName: user.middleName || '',
          gender: user.gender || '',
          dateOfBirth: user.dateOfBirth || '',
          institution: user.studentProfile?.institution || '',
          matricNo: user.studentProfile?.matricNo || '',
          level: user.studentProfile?.level || null,
          preferredZones: user.studentProfile?.preferredZones || [],
          savedCategories: [],
        };
        set({ formData: data, originalData: data, isDirty: false });
      },

      setField: (field, value) => {
        const newFormData = { ...get().formData, [field]: value };
        const isDirty = JSON.stringify(newFormData) !== JSON.stringify(get().originalData);
        set({ formData: newFormData, isDirty });
      },

      setMultipleFields: (updates) => {
        const newFormData = { ...get().formData, ...updates };
        const isDirty = JSON.stringify(newFormData) !== JSON.stringify(get().originalData);
        set({ formData: newFormData, isDirty });
      },

      resetForm: () => {
        const original = get().originalData;
        if (original) {
          set({ formData: { ...original }, isDirty: false });
        }
      },

      markAsSaved: () => {
        set({ originalData: { ...get().formData }, isDirty: false });
      },

      setIsSaving: (saving) => set({ isSaving: saving }),
    }),
    {
      name: 'verbaac-profile-form',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ formData: state.formData }),
    }
  )
);
