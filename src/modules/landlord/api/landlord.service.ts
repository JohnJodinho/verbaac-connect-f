/**
 * Landlord Service
 * 
 * Mock implementation for Landlord module API calls.
 * Targets landlord_profiles and wallets tables from DBML.
 */

import { apiClient } from '@/lib/api';

// ============ TYPES ============

export type LandlordType = 'individual' | 'agent' | 'company';

export interface LandlordOnboardingData {
  // Step 1: Entity Identification
  landlordType: LandlordType;
  legalName: string;
  registrationNumber?: string; // Company RC No or Agent License
  
  // Step 2: KYC & Proof (URLs after upload)
  idUrl: string;
  propertyProofUrl: string;
  
  // Step 3: Financial Setup
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export interface LandlordProfile {
  id: string;
  displayId: string; // LLD-2026-XXXX
  userId: string;
  landlordType: LandlordType;
  legalName: string;
  registrationNumber?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface LandlordStats {
  totalProperties: number;
  activeListings: number;
  totalUnits: number;
  occupancyRate: number; // Percentage
  pendingRevenue: number;
  availableBalance: number;
}

export interface LandlordProperty {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  activeListings: number;
  status: 'active' | 'pending_verification' | 'maintenance';
}

// ============ MOCK DATA ============


// ============ BUILDING TYPES ============

export interface Zone {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface Building {
  id: string;
  displayId: string; // PLA-STATE-CITY-BLD-XXXX
  ownerId: string;
  name: string;
  address: string;
  landmark?: string;
  
  // Geography
  state: string;
  city: string;
  zoneId: string; // Mapped to zones table
  
  // Geo-Mapping
  coordinates?: {
    lat: number;
    lng: number;
  };

  // Media
  photos: string[];
  videoTourUrl?: string;

  // Status
  isActive: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  
  // Metrics
  totalUnits: number;
  activeListings: number;
  createdAt: string;
}

export type CreateBuildingDTO = Omit<Building, 'id' | 'displayId' | 'ownerId' | 'isActive' | 'verificationStatus' | 'totalUnits' | 'activeListings' | 'createdAt'>;

// ============ LISTING TYPES ============

export interface Amenities {
  wifi: boolean;
  water: boolean;
  electricity: boolean;
  security: boolean;
  wasteDisposal: boolean;
  parking: boolean;
  generator: boolean;
}

export interface ListingType {
  id: string;
  name: string; // "Self-Con", "Flat"
  description?: string;
}

export interface Listing {
  id: string;
  displayId: string; // PLA-JOS-NAR-PRP-001
  buildingId: string;
  propertyTypeId: string; // e.g., "self_con"
  
  // Metadata
  dimensions?: string; // "12x12 ft"
  bathroomType: 'private' | 'shared';
  kitchenAccess: 'private' | 'shared' | 'none';
  maxOccupancy: number;
  amenities: Amenities;

  // Financials
  basePrice: number; // Net
  finalPrice: number; // Net + 12%
  paymentFrequency: 'yearly' | 'monthly' | 'semester';
  allowRoommateSplitting: boolean;

  // Status
  status: 'draft' | 'pending_vetting' | 'verified' | 'occupied';
  
  // Media
  photos: string[];

  createdAt: string;
}

export type CreateListingDTO = Omit<Listing, 'id' | 'displayId' | 'status' | 'createdAt'>;

// ============ TENANT & BOOKING TYPES ============

export interface TenantProfile {
  id: string;
  name: string;
  university: string;
  level: string; // "300L"
  phoneNumber?: string; // Hidden until escrow released
  email?: string; // Hidden until escrow released
}

export interface Booking {
  id: string;
  displayId: string; // BKG-2026-XXXX
  listingId: string;
  listingName: string;
  buildingName: string;
  tenant: TenantProfile;
  amount: number;
  escrowStatus: 'pending' | 'held' | 'released' | 'refunded';
  checkInDate: string;
  duration: string; // "1 Year"
  createdAt: string;
}

// ============ WALLET TYPES ============

export interface WalletTransaction {
  id: string;
  reference: string;
  type: 'credit' | 'debit';
  category: 'rent_payout' | 'withdrawal' | 'refund';
  amount: number;
  status: 'pending' | 'successful' | 'failed';
  description: string;
  date: string;
  metadata?: {
    bookingDisplayId?: string;
    buildingName?: string;
  };
}

// ============ MOCK DATA ============

const MOCK_ZONES: Zone[] = [
  { id: 'zone_001', name: 'Naraguta', city: 'Jos North', state: 'Plateau' },
  { id: 'zone_002', name: 'Rayfield', city: 'Jos South', state: 'Plateau' },
  { id: 'zone_003', name: 'Lamingo', city: 'Jos North', state: 'Plateau' },
  { id: 'zone_004', name: 'Bukuru', city: 'Jos South', state: 'Plateau' },
];

const MOCK_DELAY_MS = 600;

const MOCK_LANDLORD_PROFILE: LandlordProfile = {
  id: 'lld_mock_001',
  displayId: 'LLD-2026-0421',
  userId: 'user_mock_001',
  landlordType: 'individual',
  legalName: 'John Jodinho',
  isVerified: false,
  createdAt: new Date().toISOString(),
};

const MOCK_STATS: LandlordStats = {
  totalProperties: 12,
  activeListings: 4,
  totalUnits: 48,
  occupancyRate: 94,
  pendingRevenue: 240000,
  availableBalance: 185000,
};

const MOCK_BUILDINGS: Building[] = [
  {
    id: 'bld_001',
    displayId: 'PLA-PL-JOS-BLD-001',
    ownerId: 'user_mock_001',
    name: 'Naraguta Luxury Lodge',
    address: 'Opposite University Gate, Bauchi Road',
    landmark: 'University Gate',
    state: 'Plateau',
    city: 'Jos North',
    zoneId: 'zone_001',
    coordinates: { lat: 9.956, lng: 8.891 },
    photos: [],
    isActive: true,
    verificationStatus: 'verified',
    totalUnits: 12,
    activeListings: 2,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'bld_002',
    displayId: 'PLA-PL-JOS-BLD-002',
    ownerId: 'user_mock_001',
    name: 'Sunset Apartments',
    address: '14 Rayfield Road',
    state: 'Plateau',
    city: 'Jos South',
    zoneId: 'zone_002',
    coordinates: { lat: 9.912, lng: 8.855 },
    photos: [],
    isActive: true,
    verificationStatus: 'pending',
    totalUnits: 8,
    activeListings: 0,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bkg_001',
    displayId: 'BKG-2026-9211',
    listingId: 'lst_001',
    listingName: 'Self-Con Unit 4',
    buildingName: 'Naraguta Luxury Lodge',
    tenant: {
      id: 'usr_student_01',
      name: 'Amara Nnaji',
      university: 'University of Jos',
      level: '300L',
      // Phone hidden initially
    },
    amount: 350000,
    escrowStatus: 'held', // Money is with Verbaac
    checkInDate: '2026-03-01',
    duration: '1 Year',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'bkg_002',
    displayId: 'BKG-2026-9215',
    listingId: 'lst_003',
    listingName: 'Flat 2B',
    buildingName: 'Sunset Apartments',
    tenant: {
      id: 'usr_student_02',
      name: 'Ibrahim Musa',
      university: 'University of Jos',
      level: '500L',
      phoneNumber: '+234 812 345 6789', // Revealed
      email: 'ib.musa@student.unijos.edu.ng'
    },
    amount: 150000,
    escrowStatus: 'released', // Money sent to landlord
    checkInDate: '2026-01-15',
    duration: '1 Year',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  }
];

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'txn_001',
    reference: 'REF-8821992',
    type: 'credit',
    category: 'rent_payout',
    amount: 132000, // 88% of 150k
    status: 'successful',
    description: 'Rent Payout: Flat 2B',
    date: new Date(Date.now() - 86400000 * 40).toISOString(),
    metadata: {
      bookingDisplayId: 'BKG-2026-9215',
      buildingName: 'Sunset Apartments'
    }
  },
  {
    id: 'txn_002',
    reference: 'WDR-9921001',
    type: 'debit',
    category: 'withdrawal',
    amount: 50000,
    status: 'successful',
    description: 'Transfer to Access Bank',
    date: new Date(Date.now() - 86400000 * 35).toISOString(),
  }
];

// ============ MOCK IMPLEMENTATIONS ============

/**
 * Submit Landlord activation
 */
const mockSubmitOnboarding = async (data: LandlordOnboardingData): Promise<{ success: boolean; displayId: string; profile: LandlordProfile }> => {
  console.log('[Mock API] Submitting landlord onboarding | X-Active-Persona: landlord');
  console.log('[Mock API] Data:', data);

  return new Promise((resolve) => {
    setTimeout(() => {
      const year = new Date().getFullYear();
      const seq = Math.floor(Math.random() * 9000) + 1000;
      const displayId = `LLD-${year}-${seq}`;

      resolve({
        success: true,
        displayId,
        profile: {
          ...MOCK_LANDLORD_PROFILE,
          displayId,
          landlordType: data.landlordType,
          legalName: data.legalName,
          registrationNumber: data.registrationNumber,
        },
      });
    }, MOCK_DELAY_MS * 2);
  });
};

/**
 * Simulate document upload
 */
const mockUploadDocument = async (type: 'id' | 'property_proof', file: File): Promise<{ success: boolean; url: string }> => {
  console.log(`[Mock API] Uploading ${type} document:`, file.name);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        url: `https://storage.verbaac.com/landlord/docs/${type}_${Date.now()}.pdf`,
      });
    }, 1500); // Documents take longer to "upload"
  });
};

/**
 * Fetch stats
 */
const mockFetchStats = async (): Promise<{ success: boolean; data: LandlordStats }> => {
  console.log('[Mock API] Fetching landlord stats | X-Active-Persona: landlord');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: MOCK_STATS,
      });
    }, MOCK_DELAY_MS);
  });
};

/**
 * Create Building
 */
const mockCreateBuilding = async (data: CreateBuildingDTO): Promise<{ success: boolean; building: Building }> => {
  console.log('[Mock API] Creating Building | X-Active-Persona: landlord');
  console.log('[Mock API] Data:', data);

  return new Promise((resolve) => {
    setTimeout(() => {
      const id = `bld_${Date.now()}`;
       // Simple Mock ID generation logic
      const stateCode = data.state.slice(0, 3).toUpperCase(); 
      const cityCode = data.city.slice(0, 3).toUpperCase();
      const displayId = `PLA-${stateCode}-${cityCode}-BLD-${Math.floor(Math.random() * 9999)}`;

      const newBuilding: Building = {
        id,
        displayId,
        ownerId: 'user_mock_001', // In real app, this comes from token/session
        ...data,
        isActive: true,
        verificationStatus: 'pending',
        totalUnits: 0,
        activeListings: 0,
        createdAt: new Date().toISOString(),
      };

      // Add to mock store (in memory only for session)
      MOCK_BUILDINGS.unshift(newBuilding);

      resolve({
        success: true,
        building: newBuilding,
      });
    }, MOCK_DELAY_MS * 1.5);
  });
};

/**
 * Get Buildings
 */
const mockGetBuildings = async (): Promise<{ success: boolean; data: Building[] }> => {
  console.log('[Mock API] Fetching Buildings | X-Active-Persona: landlord');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [...MOCK_BUILDINGS],
      });
    }, MOCK_DELAY_MS);
  });
};

/**
 * Get Zones
 */
const mockGetZones = async (): Promise<{ success: boolean; data: Zone[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [...MOCK_ZONES],
        });
      }, MOCK_DELAY_MS);
    });
  };
  

// ============ EXPORTED FUNCTIONS ============

// ============ MOCK LISTINGS DATA ============

const MOCK_PROPERTY_TYPES: ListingType[] = [
  { id: 'self_con', name: 'Self Contain', description: 'Room with private kitchen and bath' },
  { id: 'single_room', name: 'Single Room', description: 'Room with shared facilities' },
  { id: '1_bed_flat', name: '1 Bedroom Flat', description: 'Parlor + Room + Kitchen' },
  { id: 'studio', name: 'Studio Apartment', description: 'Open plan luxury unit' },
];

const MOCK_LISTINGS: Listing[] = [];

// ============ MOCK IMPLEMENTATIONS (Listings) ============

/**
 * Create Listing
 */
const mockCreateListing = async (data: CreateListingDTO): Promise<{ success: boolean; listing: Listing }> => {
  console.log('[Mock API] Creating Listing | X-Active-Persona: landlord');

  return new Promise((resolve) => {
    setTimeout(() => {
      const id = `lst_${Date.now()}`;
      // Generate Display ID: STATE-CITY-ZONE-PRP-SEQ
      // We would ideally look up the zone from the building, but for mock simplifiction:
      const displayId = `PLA-JOS-NAR-PRP-${Math.floor(Math.random() * 9999)}`;

      const newListing: Listing = {
        id,
        displayId,
        ...data,
        status: 'pending_vetting', // Default status as per requirements
        createdAt: new Date().toISOString(),
      };

      MOCK_LISTINGS.unshift(newListing);

      resolve({
        success: true,
        listing: newListing,
      });
    }, MOCK_DELAY_MS);
  });
};

/**
 * Get Listings
 */
const mockGetListings = async (buildingId?: string): Promise<{ success: boolean; data: Listing[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = [...MOCK_LISTINGS];
      if (buildingId) {
        data = data.filter(l => l.buildingId === buildingId);
      }
      resolve({
        success: true,
        data,
      });
    }, MOCK_DELAY_MS);
  });
};

/**
 * Get Property Types
 */
const mockGetPropertyTypes = async (): Promise<{ success: boolean; data: ListingType[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: MOCK_PROPERTY_TYPES });
    }, MOCK_DELAY_MS / 2);
  });
};

/**
 * Get Bookings
 */
const mockGetBookings = async (): Promise<{ success: boolean; data: Booking[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: [...MOCK_BOOKINGS] });
    }, MOCK_DELAY_MS);
  });
};

/**
 * Confirm Move-In (Release Funds)
 */
const mockConfirmMoveIn = async (bookingId: string): Promise<{ success: boolean; message: string }> => {
  console.log(`[Mock API] Confirming Move-In for ${bookingId} | Releasing Escrow`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find and update booking in mock
      const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
      if (booking) {
        booking.escrowStatus = 'released';
        booking.tenant.phoneNumber = '+234 800 123 4567'; // Reveal phone
        
        // Add transaction
        MOCK_TRANSACTIONS.unshift({
            id: `txn_${Date.now()}`,
            reference: `REF-${Math.floor(Math.random() * 10000000)}`,
            type: 'credit',
            category: 'rent_payout',
            amount: booking.amount * 0.88, // 88% payout
            status: 'successful',
            description: `Rent Payout: ${booking.listingName}`,
            date: new Date().toISOString(),
            metadata: {
              bookingDisplayId: booking.displayId,
              buildingName: booking.buildingName
            }
        });
        
        // Update stats
        MOCK_STATS.pendingRevenue -= booking.amount;
        MOCK_STATS.availableBalance += (booking.amount * 0.88);
      }
      
      resolve({ 
        success: true, 
        message: 'Move-in confirmed. Funds released to wallet.' 
      });
    }, MOCK_DELAY_MS * 1.5);
  });
};

/**
 * Get Wallet Transactions
 */
const mockGetWalletTransactions = async (): Promise<{ success: boolean; data: WalletTransaction[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: [...MOCK_TRANSACTIONS] });
    }, MOCK_DELAY_MS);
  });
};


// ============ EXPORTED FUNCTIONS ============

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const submitLandlordOnboarding = async (data: LandlordOnboardingData) => {
  if (useMockApi) return mockSubmitOnboarding(data);
  const response = await apiClient.post('/api/v1/landlord/activate', data);
  return response.data;
};

export const uploadLandlordDocument = async (type: 'id' | 'property_proof', file: File) => {
  if (useMockApi) return mockUploadDocument(type, file);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const response = await apiClient.post('/api/v1/landlord/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchLandlordStats = async () => {
  if (useMockApi) return mockFetchStats();
  const response = await apiClient.get('/api/v1/landlord/stats');
  return response.data;
};

export const createBuilding = async (data: CreateBuildingDTO) => {
  if (useMockApi) return mockCreateBuilding(data);
  const response = await apiClient.post('/api/v1/landlord/buildings', data);
  return response.data;
};

export const getBuildings = async () => {
  if (useMockApi) return mockGetBuildings();
  const response = await apiClient.get('/api/v1/landlord/buildings');
  return response.data;
};

export const getZones = async () => {
    if (useMockApi) return mockGetZones();
    const response = await apiClient.get('/api/v1/zones');
    return response.data;
};

export const createListing = async (data: CreateListingDTO) => {
  if (useMockApi) return mockCreateListing(data);
  const response = await apiClient.post('/api/v1/landlord/listings', data);
  return response.data;
};

export const getListings = async (buildingId?: string) => {
  if (useMockApi) return mockGetListings(buildingId);
  const response = await apiClient.get('/api/v1/landlord/listings', { params: { buildingId } });
  return response.data;
};

export const getPropertyTypes = async () => {
  if (useMockApi) return mockGetPropertyTypes();
  const response = await apiClient.get('/api/v1/property-types');
  return response.data;
};

export const getBookings = async () => {
  if (useMockApi) return mockGetBookings();
  const response = await apiClient.get('/api/v1/landlord/bookings');
  return response.data;
};

export const confirmMoveIn = async (bookingId: string) => {
  if (useMockApi) return mockConfirmMoveIn(bookingId);
  const response = await apiClient.post(`/api/v1/landlord/bookings/${bookingId}/confirm`);
  return response.data;
};

export const getWalletTransactions = async () => {
  if (useMockApi) return mockGetWalletTransactions();
  const response = await apiClient.get('/api/v1/landlord/wallet/transactions');
  return response.data;
};
