/**
 * Ambassador Audit Store
 * 
 * Persisted store for managing in-progress verification audits.
 * Ensures data is not lost due to network connectivity issues in the field.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AuditMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  capturedAt: string;
}

export interface AmenityCheck {
  id: string;
  label: string;
  confirmed: boolean;
  notes?: string;
}

export interface AuditReportData {
  taskId: string;
  visitedAt: string;
  checkInGeom: {
    lat: number;
    lng: number;
  };
  amenities: AmenityCheck[];
  isRentMatch: boolean;
  physicalRentQuote: number;
  rentPeriod: 'yearly' | 'semester';
  isManagerValid: boolean;
  managerNotes?: string;
  media: AuditMedia[];
  poiSuggestions: string[];
  additionalComments?: string;
}

interface AuditState {
  // Active audit tracking
  activeAudit: AuditReportData | null;
  isDraft: boolean;
  lastSavedAt: string | null;

  // Actions
  startAudit: (taskId: string, checkInGeom: { lat: number; lng: number }) => void;
  updateAudit: (data: Partial<AuditReportData>) => void;
  addMedia: (media: AuditMedia) => void;
  removeMedia: (mediaId: string) => void;
  toggleAmenity: (amenityId: string) => void;
  clearAudit: () => void;
}

const DEFAULT_AMENITIES: AmenityCheck[] = [
  { id: 'water', label: 'Running Water', confirmed: false },
  { id: 'electricity', label: 'Stable Electricity', confirmed: false },
  { id: 'toilet', label: 'Functional Toilet/Bath', confirmed: false },
  { id: 'security', label: 'Security (Gate/Fence)', confirmed: false },
  { id: 'kitchen', label: 'Separate Kitchen Area', confirmed: false },
];

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      activeAudit: null,
      isDraft: false,
      lastSavedAt: null,

      startAudit: (taskId, checkInGeom) => set({
        activeAudit: {
          taskId,
          visitedAt: new Date().toISOString(),
          checkInGeom,
          amenities: [...DEFAULT_AMENITIES],
          isRentMatch: false,
          physicalRentQuote: 0,
          rentPeriod: 'yearly',
          isManagerValid: false,
          media: [],
          poiSuggestions: [],
        },
        isDraft: true,
        lastSavedAt: new Date().toISOString(),
      }),

      updateAudit: (data) => set((state) => ({
        activeAudit: state.activeAudit ? { ...state.activeAudit, ...data } : null,
        lastSavedAt: new Date().toISOString(),
      })),

      addMedia: (media) => set((state) => ({
        activeAudit: state.activeAudit 
          ? { ...state.activeAudit, media: [...state.activeAudit.media, media] } 
          : null,
        lastSavedAt: new Date().toISOString(),
      })),

      removeMedia: (mediaId) => set((state) => ({
        activeAudit: state.activeAudit 
          ? { ...state.activeAudit, media: state.activeAudit.media.filter(m => m.id !== mediaId) } 
          : null,
        lastSavedAt: new Date().toISOString(),
      })),

      toggleAmenity: (amenityId) => set((state) => ({
        activeAudit: state.activeAudit 
          ? { 
              ...state.activeAudit, 
              amenities: state.activeAudit.amenities.map(a => 
                a.id === amenityId ? { ...a, confirmed: !a.confirmed } : a
              ) 
            } 
          : null,
        lastSavedAt: new Date().toISOString(),
      })),

      clearAudit: () => set({
        activeAudit: null,
        isDraft: false,
        lastSavedAt: null,
      }),
    }),
    {
      name: 'verbacc-ambassador-audit',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
