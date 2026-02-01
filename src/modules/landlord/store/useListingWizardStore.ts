import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CreateListingDTO } from '../api/landlord.service';

interface ListingWizardState {
  step: number;
  data: Partial<CreateListingDTO>;
  
  // Actions
  setStep: (step: number) => void;
  updateData: (data: Partial<CreateListingDTO>) => void;
  reset: () => void;
}

export const useListingWizardStore = create<ListingWizardState>()(
  persist(
    (set) => ({
      step: 1,
      data: {
        // Initial defaults
        bathroomType: 'private',
        kitchenAccess: 'private',
        maxOccupancy: 1,
        paymentFrequency: 'yearly',
        allowRoommateSplitting: false,
        photos: [],
        amenities: {
          wifi: false,
          water: true,
          electricity: true,
          security: true,
          wasteDisposal: true,
          parking: false,
          generator: false
        }
      },

      setStep: (step) => set({ step }),
      
      updateData: (newData) => set((state) => ({ 
        data: { ...state.data, ...newData } 
      })),

      reset: () => set({ 
        step: 1, 
        data: {
          bathroomType: 'private',
          kitchenAccess: 'private',
          maxOccupancy: 1,
          paymentFrequency: 'yearly',
          allowRoommateSplitting: false,
          photos: [],
          amenities: {
            wifi: false,
            water: true,
            electricity: true,
            security: true,
            wasteDisposal: true,
            parking: false,
            generator: false
          }
        }
      }),
    }),
    {
      name: 'verbaac-listing-wizard', // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
