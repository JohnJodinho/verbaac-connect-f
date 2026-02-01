/**
 * Ambassador Service
 * 
 * Mock implementations for Ambassador module API calls.
 * Uses VITE_USE_MOCK_API flag for future backend integration.
 * All requests include X-Active-Persona: ambassador header.
 */

import { apiClient } from '@/lib/api';

// ============ TYPES ============

export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export interface AmbassadorOnboardingData {
  // Step 1: Campus & Proximity
  assignedCampus: string;
  currentZone: string;
  availabilityStatus: AvailabilityStatus;
  
  // Step 2: Financial Setup
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  
  // Step 3: Legal Agreement
  fieldAuditAccepted: boolean;
  antiCollusionAccepted: boolean;
}

export interface AmbassadorStats {
  pendingVerifications: number;
  completedVerifications: number;
  totalEarnings: number;
  pendingEarnings: number;
  monthlyVerifications: number;
  verificationRate: number; // Percentage
  averageRating: number;
  activeSince: string;
}

export interface AmbassadorProfile {
  id: string;
  displayId: string; // AMB-2026-XXXX
  userId: string;
  assignedCampus: string;
  currentZone: string;
  availabilityStatus: AvailabilityStatus;
  tier: 'tier1' | 'tier2' | 'tier3';
  verifiedCount: number;
  createdAt: string;
}

export interface EligibilityCheckResponse {
  eligible: boolean;
  reason?: string;
  studentProfile?: {
    institution: string;
    matricNo: string;
    level: number;
  } | null;
}

export interface OnboardingResponse {
  success: boolean;
  message?: string;
  displayId: string;
  profile: AmbassadorProfile;
}

export interface StatsResponse {
  success: boolean;
  data: AmbassadorStats;
}

// ============ VERIFICATION TASK TYPES ============

export type VerificationTaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'dispute_reverification';
export type VerificationPriority = 'normal' | 'high';

export interface VerificationTask {
  id: string;
  listingId: string;
  listingDisplayId: string;
  propertyType: string;
  zone: string;
  campus: string;
  streetAddress: string;
  landlordName: string;
  agentName?: string;
  status: VerificationTaskStatus;
  priority: VerificationPriority;
  priorityReason?: string; // e.g., "Dispute Re-Verification"
  createdAt: string;
  assignedAt?: string;
  unitGeom: {
    lat: number;
    lng: number;
  };
  distanceMeters?: number; // Calculated distance from ambassador
  commissionAmount: number; // 2% of listing value
}

export interface ProximityCheckResult {
  success: boolean;
  distanceMeters: number;
  isWithinRange: boolean;
  message: string;
  checkInGeom?: {
    lat: number;
    lng: number;
  };
}

export interface VerificationReportSubmission {
  taskId: string;
  visitedAt: string;
  checkInGeom: {
    lat: number;
    lng: number;
  };
  amenitiesConfirmed: { id: string; confirmed: boolean }[];
  isRentMatch: boolean;
  physicalRentQuote: number;
  rentPeriod: 'yearly' | 'semester';
  isManagerValid: boolean;
  mediaUrls: string[];
  poiSuggestions: string[];
  comments?: string;
}

export interface VerificationReportResponse {
  success: boolean;
  message: string;
  reportId?: string;
}

// ============ WALLET & EARNINGS TYPES ============

export interface AmbassadorWalletData {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalWithdrawals: number;
}

export type AmbassadorTransactionStatus = 'held' | 'released' | 'disputed' | 'cancelled';

export interface AmbassadorTransaction {
  id: string;
  taskId: string;
  listingDisplayId: string;
  propertyName: string;
  amount: number;
  status: AmbassadorTransactionStatus;
  createdAt: string;
  releasedAt?: string;
}

export interface AmbassadorWalletResponse {
  success: boolean;
  data: {
    wallet: AmbassadorWalletData;
    recentTransactions: AmbassadorTransaction[];
  };
}

// ============ ACTIVITY FEED TYPES ============

export type AmbassadorActivityType = 'verification' | 'financial' | 'dispute' | 'onboarding';

export interface AmbassadorActivityEvent {
  id: string;
  type: AmbassadorActivityType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    taskId?: string;
    amount?: number;
    listingDisplayId?: string;
    propertyName?: string;
    status?: string;
  };
}

export interface AmbassadorActivityResponse {
  success: boolean;
  data: AmbassadorActivityEvent[];
}

// ============ MOCK DATA ============

const MOCK_DELAY_MS = 500;

// Mock verification tasks - filtered by zone/campus in real impl
const MOCK_VERIFICATION_TASKS: VerificationTask[] = [
  {
    id: 'vt_001',
    listingId: 'lst_001',
    listingDisplayId: 'PL-JOS-NRG-PRP-0042',
    propertyType: 'Self-Contained',
    zone: 'Naraguta',
    campus: 'UNIJOS',
    streetAddress: '12 University Road, Naraguta',
    landlordName: 'Mr. Yakubu Bello',
    status: 'pending',
    priority: 'normal',
    createdAt: '2026-01-30T10:00:00Z',
    unitGeom: { lat: 9.9316, lng: 8.8920 }, // UNIJOS area
    commissionAmount: 3600, // 2% of 180,000
  },
  {
    id: 'vt_002',
    listingId: 'lst_002',
    listingDisplayId: 'PL-JOS-NRG-PRP-0043',
    propertyType: 'Single Room',
    zone: 'Naraguta',
    campus: 'UNIJOS',
    streetAddress: '5 Student Close, Behind Faculty of Arts',
    landlordName: 'Mrs. Grace Eze',
    agentName: 'Emeka Properties Ltd.',
    status: 'assigned',
    priority: 'high',
    priorityReason: 'Dispute Re-Verification',
    createdAt: '2026-01-29T14:30:00Z',
    assignedAt: '2026-01-30T08:00:00Z',
    unitGeom: { lat: 9.9320, lng: 8.8925 },
    commissionAmount: 1800,
  },
  {
    id: 'vt_003',
    listingId: 'lst_003',
    listingDisplayId: 'PL-JOS-NRG-PRP-0044',
    propertyType: 'Flat (2 Bedroom)',
    zone: 'Naraguta',
    campus: 'UNIJOS',
    streetAddress: '8 Lecturers Quarters, Permanent Site',
    landlordName: 'Dr. Aminu Mohammed',
    status: 'pending',
    priority: 'normal',
    createdAt: '2026-01-30T11:00:00Z',
    unitGeom: { lat: 9.9350, lng: 8.8950 },
    commissionAmount: 7200,
  },
  {
    id: 'vt_004',
    listingId: 'lst_004',
    listingDisplayId: 'PL-JOS-VLG-PRP-0012',
    propertyType: 'Self-Contained',
    zone: 'Village',
    campus: 'UNIJOS',
    streetAddress: '22 Village Road, Near Main Gate',
    landlordName: 'Alhaji Musa Dan Iya',
    status: 'in_progress',
    priority: 'normal',
    createdAt: '2026-01-28T09:00:00Z',
    assignedAt: '2026-01-30T07:00:00Z',
    unitGeom: { lat: 9.9280, lng: 8.8880 },
    commissionAmount: 4000,
  },
];


const MOCK_STATS: AmbassadorStats = {
  pendingVerifications: 3,
  completedVerifications: 27,
  totalEarnings: 15400,
  pendingEarnings: 2800,
  monthlyVerifications: 8,
  verificationRate: 94.5,
  averageRating: 4.8,
  activeSince: '2026-01-15T00:00:00Z',
};

const MOCK_WALLET_DATA: AmbassadorWalletData = {
  availableBalance: 12600,
  pendingBalance: 2800,
  totalEarnings: 15400,
  totalWithdrawals: 0,
};

const MOCK_AMB_TRANSACTIONS: AmbassadorTransaction[] = [
  {
    id: 'tx_amb_001',
    taskId: 'vt_001',
    listingDisplayId: 'PL-JOS-NRG-PRP-0042',
    propertyName: 'Naraguta Self-Contained',
    amount: 3600,
    status: 'held',
    createdAt: '2026-01-30T10:00:00Z',
  },
  {
    id: 'tx_amb_002',
    taskId: 'vt_completed_001',
    listingDisplayId: 'PL-JOS-NRG-PRP-0041',
    propertyName: 'Hilltop Villa Room 4',
    amount: 2500,
    status: 'released',
    createdAt: '2026-01-20T10:00:00Z',
    releasedAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'tx_amb_003',
    taskId: 'vt_completed_002',
    listingDisplayId: 'PL-JOS-VLG-PRP-0010',
    propertyName: 'Village Square Apt',
    amount: 3200,
    status: 'disputed',
    createdAt: '2026-01-15T10:00:00Z',
  },
];

const MOCK_AMB_ACTIVITY: AmbassadorActivityEvent[] = [
  {
    id: 'act_001',
    type: 'onboarding',
    title: 'Ambassador Activated',
    description: 'You are now a Tier 1 Verbaac Ambassador for UNIJOS campus.',
    timestamp: '2026-01-15T10:30:00Z',
  },
  {
    id: 'act_002',
    type: 'verification',
    title: 'Task Assigned',
    description: 'Naraguta Self-Contained was added to your verification queue.',
    timestamp: '2026-01-30T10:00:00Z',
    metadata: {
      taskId: 'vt_001',
      listingDisplayId: 'PL-JOS-NRG-PRP-0042',
      propertyName: 'Naraguta Self-Contained',
    },
  },
  {
    id: 'act_003',
    type: 'verification',
    title: 'Audit Submitted',
    description: 'Verification report for Hilltop Villa Room 4 submitted successfully.',
    timestamp: '2026-01-31T14:45:00Z',
    metadata: {
      taskId: 'vt_completed_001',
      listingDisplayId: 'PL-JOS-NRG-PRP-0041',
      propertyName: 'Hilltop Villa Room 4',
    },
  },
  {
    id: 'act_004',
    type: 'financial',
    title: 'Commission Earned',
    description: 'Commission of ₦2,500 for Hilltop Villa Room 4 is now released.',
    timestamp: '2026-02-01T09:00:00Z',
    metadata: {
      amount: 2500,
      listingDisplayId: 'PL-JOS-NRG-PRP-0041',
    },
  },
  {
    id: 'act_005',
    type: 'dispute',
    title: 'Dispute Audit Assigned',
    description: 'High-priority re-verification requested for Village Square Apt.',
    timestamp: '2026-02-01T11:20:00Z',
    metadata: {
      taskId: 'vt_completed_002',
      listingDisplayId: 'PL-JOS-VLG-PRP-0010',
      propertyName: 'Village Square Apt',
    },
  },
];

const MOCK_PROFILE: AmbassadorProfile = {
  id: 'amb_mock_001',
  displayId: 'AMB-2026-0042',
  userId: 'user_mock_001',
  assignedCampus: 'UNIJOS',
  currentZone: 'Naraguta',
  availabilityStatus: 'available',
  tier: 'tier1',
  verifiedCount: 27,
  createdAt: '2026-01-15T10:30:00Z',
};

// ============ MOCK IMPLEMENTATIONS ============

/**
 * Check if user is eligible to become an ambassador
 * Requirement: Must be a verified student with matricNo
 */
const mockCheckEligibility = async (studentProfile: AmbassadorOnboardingData['assignedCampus'] | null): Promise<EligibilityCheckResponse> => {
  console.log('[Mock API] Checking ambassador eligibility | X-Active-Persona: ambassador');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // In real implementation, this would check the tenant_sub_profile
      // For mock, we'll return eligible if studentProfile is provided
      if (studentProfile) {
        resolve({
          eligible: true,
          studentProfile: {
            institution: 'UNIJOS',
            matricNo: 'UJ/2023/CS/0042',
            level: 300,
          },
        });
      } else {
        resolve({
          eligible: false,
          reason: 'Only verified students can apply to be Ambassadors',
        });
      }
    }, MOCK_DELAY_MS);
  });
};

/**
 * Submit ambassador application
 * Returns mock AMB-YEAR-XXXX ID on success
 */
const mockSubmitApplication = async (data: AmbassadorOnboardingData): Promise<OnboardingResponse> => {
  console.log('[Mock API] Submitting ambassador application | X-Active-Persona: ambassador');
  console.log('[Mock API] Application data:', data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock display ID: AMB-YEAR-XXXX
      const year = new Date().getFullYear();
      const seq = Math.floor(Math.random() * 9000) + 1000;
      const displayId = `AMB-${year}-${seq}`;
      
      resolve({
        success: true,
        displayId,
        profile: {
          ...MOCK_PROFILE,
          displayId,
          assignedCampus: data.assignedCampus,
          currentZone: data.currentZone,
          availabilityStatus: data.availabilityStatus,
        },
      });
    }, MOCK_DELAY_MS * 2);
  });
};

/**
 * Fetch ambassador dashboard stats
 */
const mockFetchStats = async (): Promise<StatsResponse> => {
  console.log('[Mock API] Fetching ambassador stats | X-Active-Persona: ambassador');
  
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
 * Fetch ambassador profile
 */
const mockFetchProfile = async (): Promise<{ success: boolean; data: AmbassadorProfile }> => {
  console.log('[Mock API] Fetching ambassador profile | X-Active-Persona: ambassador');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: MOCK_PROFILE,
      });
    }, MOCK_DELAY_MS);
  });
};

// ============ REAL API IMPLEMENTATIONS (TO BE IMPLEMENTED) ============

const realCheckEligibility = async (): Promise<EligibilityCheckResponse> => {
  const response = await apiClient.get<EligibilityCheckResponse>('/api/v1/ambassador/eligibility');
  return response.data;
};

const realSubmitApplication = async (data: AmbassadorOnboardingData): Promise<OnboardingResponse> => {
  const response = await apiClient.post<OnboardingResponse>('/api/v1/ambassador/apply', data);
  return response.data;
};

const realFetchStats = async (): Promise<StatsResponse> => {
  const response = await apiClient.get<StatsResponse>('/api/v1/ambassador/stats');
  return response.data;
};

// ============ EXPORTED FUNCTIONS ============

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const checkStudentEligibility = async (hasStudentProfile: boolean): Promise<EligibilityCheckResponse> => {
  if (useMockApi) {
    return mockCheckEligibility(hasStudentProfile ? 'mock' : null);
  }
  return realCheckEligibility();
};

export const submitAmbassadorApplication = async (data: AmbassadorOnboardingData): Promise<OnboardingResponse> => {
  if (useMockApi) {
    return mockSubmitApplication(data);
  }
  return realSubmitApplication(data);
};

export const fetchAmbassadorStats = async (): Promise<StatsResponse> => {
  if (useMockApi) {
    return mockFetchStats();
  }
  return realFetchStats();
};

export const fetchAmbassadorProfile = async () => {
  if (useMockApi) {
    return mockFetchProfile();
  }
  const response = await apiClient.get<{ success: boolean; data: AmbassadorProfile }>('/api/v1/ambassador/profile');
  return response.data;
};

// Campus and Zone data for forms
export const CAMPUS_OPTIONS = [
  { value: 'UNIJOS', label: 'University of Jos (UNIJOS)' },
  { value: 'UNILAG', label: 'University of Lagos (UNILAG)' },
  { value: 'UI', label: 'University of Ibadan (UI)' },
  { value: 'ABU', label: 'Ahmadu Bello University (ABU)' },
  { value: 'UNIBEN', label: 'University of Benin (UNIBEN)' },
];

export const ZONE_OPTIONS = [
  { value: 'naraguta', label: 'Naraguta' },
  { value: 'village', label: 'Village' },
  { value: 'permanent_site', label: 'Permanent Site' },
  { value: 'anglo_jos', label: 'Anglo Jos' },
  { value: 'bauchi_road', label: 'Bauchi Road' },
  { value: 'other', label: 'Other' },
];

// ============ STUDENT VERIFICATION MOCK ============

export interface StudentProfileData {
  institution: string;
  matricNo: string;
  level: number;
  preferredZones?: string[];
}

/**
 * Mock function to simulate student verification update.
 * In a real app, this would be handled by a backend endpoint.
 * Returns the student profile data that should be merged into the User object.
 */
export const mockVerifyStudentProfile = async (data: StudentProfileData): Promise<{
  success: boolean;
  studentProfile: StudentProfileData;
}> => {
  console.log('[Mock API] Verifying student profile | X-Active-Persona: consumer');
  console.log('[Mock API] Student data:', data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        studentProfile: {
          institution: data.institution,
          matricNo: data.matricNo,
          level: data.level,
          preferredZones: data.preferredZones || [],
        },
      });
    }, MOCK_DELAY_MS);
  });
};

// ============ VERIFICATION QUEUE FUNCTIONS ============

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Fetch verification tasks for the ambassador
 * Filtered by campus and zone
 */
const mockFetchVerificationTasks = async (
  campus?: string,
  zone?: string
): Promise<{ success: boolean; data: VerificationTask[] }> => {
  console.log('[Mock API] Fetching verification tasks | X-Active-Persona: ambassador');
  console.log('[Mock API] Filters:', { campus, zone });

  return new Promise((resolve) => {
    setTimeout(() => {
      let tasks = [...MOCK_VERIFICATION_TASKS];

      // Filter by campus if provided
      if (campus) {
        tasks = tasks.filter((t) => t.campus.toLowerCase() === campus.toLowerCase());
      }

      // Filter by zone if provided (optional - ambassador may want to see all zones in their campus)
      if (zone && zone !== 'all') {
        tasks = tasks.filter((t) => t.zone.toLowerCase() === zone.toLowerCase());
      }

      // Only show actionable tasks (not completed)
      tasks = tasks.filter((t) => t.status !== 'completed');

      resolve({
        success: true,
        data: tasks,
      });
    }, MOCK_DELAY_MS);
  });
};

/**
 * Check proximity to a property
 * Returns success if within 100 meters
 */
const mockCheckProximity = async (
  taskId: string,
  ambassadorLat: number,
  ambassadorLng: number
): Promise<ProximityCheckResult> => {
  console.log('[Mock API] Checking proximity | X-Active-Persona: ambassador');
  console.log('[Mock API] Ambassador location:', { lat: ambassadorLat, lng: ambassadorLng });

  return new Promise((resolve) => {
    setTimeout(() => {
      const task = MOCK_VERIFICATION_TASKS.find((t) => t.id === taskId);

      if (!task) {
        resolve({
          success: false,
          distanceMeters: 0,
          isWithinRange: false,
          message: 'Task not found',
        });
        return;
      }

      const distance = calculateDistance(
        ambassadorLat,
        ambassadorLng,
        task.unitGeom.lat,
        task.unitGeom.lng
      );

      const isWithinRange = distance <= 100;

      resolve({
        success: true,
        distanceMeters: Math.round(distance),
        isWithinRange,
        message: isWithinRange
          ? 'You are within range. You may proceed with the audit.'
          : `You are ${Math.round(distance)}m away. Please move closer to the property (within 100m).`,
        checkInGeom: isWithinRange
          ? { lat: ambassadorLat, lng: ambassadorLng }
          : undefined,
      });
    }, MOCK_DELAY_MS);
  });
};

/**
 * Assign a task to the current ambassador
 */
const mockAssignTask = async (
  taskId: string
): Promise<{ success: boolean; message: string }> => {
  console.log('[Mock API] Assigning task | X-Active-Persona: ambassador');
  console.log('[Mock API] Task ID:', taskId);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Task assigned successfully',
      });
    }, MOCK_DELAY_MS);
  });
};

// ============ EXPORTED VERIFICATION FUNCTIONS ============

export const fetchVerificationTasks = async (
  campus?: string,
  zone?: string
): Promise<{ success: boolean; data: VerificationTask[] }> => {
  if (useMockApi) {
    return mockFetchVerificationTasks(campus, zone);
  }
  const response = await apiClient.get<{ success: boolean; data: VerificationTask[] }>(
    '/api/v1/ambassador/verifications',
    { params: { campus, zone } }
  );
  return response.data;
};

export const checkProximity = async (
  taskId: string,
  ambassadorLat: number,
  ambassadorLng: number
): Promise<ProximityCheckResult> => {
  if (useMockApi) {
    return mockCheckProximity(taskId, ambassadorLat, ambassadorLng);
  }
  const response = await apiClient.post<ProximityCheckResult>(
    `/api/v1/ambassador/verifications/${taskId}/proximity`,
    { lat: ambassadorLat, lng: ambassadorLng }
  );
  return response.data;
};

export const assignVerificationTask = async (
  taskId: string
): Promise<{ success: boolean; message: string }> => {
  if (useMockApi) {
    return mockAssignTask(taskId);
  }
  const response = await apiClient.post<{ success: boolean; message: string }>(
    `/api/v1/ambassador/verifications/${taskId}/assign`
  );
  return response.data;
};

// GPS proximity threshold in meters
export const PROXIMITY_THRESHOLD_METERS = 100;

/**
 * Submit a verification report
 */
const mockSubmitVerificationReport = async (
  data: VerificationReportSubmission
): Promise<VerificationReportResponse> => {
  console.log('[Mock API] Submitting verification report | X-Active-Persona: ambassador');
  console.log('[Mock API] Report data:', data);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Verification report submitted successfully',
        reportId: `RPT-2026-${Math.floor(Math.random() * 9000) + 1000}`,
      });
    }, MOCK_DELAY_MS * 2);
  });
};

export const submitVerificationReport = async (
  data: VerificationReportSubmission
): Promise<VerificationReportResponse> => {
  if (useMockApi) {
    return mockSubmitVerificationReport(data);
  }
  const response = await apiClient.post<VerificationReportResponse>(
    '/api/v1/ambassador/verifications/report',
    data
  );
  return response.data;
};

/**
 * Fetch ambassador wallet and earnings
 */
const mockGetAmbassadorWallet = async (): Promise<AmbassadorWalletResponse> => {
  console.log('[Mock API] Fetching ambassador wallet | X-Active-Persona: ambassador');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          wallet: MOCK_WALLET_DATA,
          recentTransactions: MOCK_AMB_TRANSACTIONS,
        },
      });
    }, MOCK_DELAY_MS);
  });
};

export const getAmbassadorWallet = async (): Promise<AmbassadorWalletResponse> => {
  if (useMockApi) {
    return mockGetAmbassadorWallet();
  }
  const response = await apiClient.get<AmbassadorWalletResponse>('/api/v1/ambassador/wallet');
  return response.data;
};

/**
 * Fetch ambassador activity feed
 */
const mockFetchActivity = async (): Promise<AmbassadorActivityResponse> => {
  console.log('[Mock API] Fetching ambassador activity | X-Active-Persona: ambassador');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: MOCK_AMB_ACTIVITY,
      });
    }, MOCK_DELAY_MS);
  });
};

export const fetchAmbassadorActivity = async (): Promise<AmbassadorActivityResponse> => {
  if (useMockApi) {
    return mockFetchActivity();
  }
  const response = await apiClient.get<AmbassadorActivityResponse>('/api/v1/ambassador/activity');
  return response.data;
};

