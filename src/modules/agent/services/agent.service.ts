// import { apiClient } from '@/lib/api';

export interface AgentProfileData {
  // Step 1: Professional Identity
  agency_name?: string;
  office_address: string;
  experience_years: number;
  bio: string;
  operational_zones: string[];

  // Step 2: KYC & Compliance
  id_type: 'national_id' | 'passport' | 'voters_card' | 'drivers_license';
  id_url: string; // File URL
  proof_of_address_doc: string; // File URL
  terms_accepted_at: string; // ISO Date
  data_policy_accepted_at: string; // ISO Date
  background_check_consent: boolean;

  // Step 3: Financial Setup
  bank_name: string;
  account_name: string;
  account_number: string;
  commission_preference: 'standard' | 'accumulate'; // 3% management commission
}

export interface AgentProfile extends AgentProfileData {
  id: string;
  user_id: string;
  display_id: string; // Format: AGT-2026-XXXX
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Mock database
let mockAgentProfile: AgentProfile | null = null;

export interface AgentTransaction {
  id: string;
  type: 'commission_credit' | 'payout_withdrawal';
  amount: number;
  status: 'cleared' | 'pending' | 'locked';
  building_name: string;
  unit_number?: string;
  client_name: string; // Landlord
  created_at: string;
  description: string;
}

export interface AgentWalletStats {
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  transactions: AgentTransaction[];
}

const mockTransactions: AgentTransaction[] = [
  {
    id: 'tx_1',
    type: 'commission_credit',
    amount: 15000,
    status: 'cleared',
    building_name: 'Ahmed Heights',
    unit_number: 'B2',
    client_name: 'Dr. Sarah Ahmed',
    created_at: '2025-12-01T10:00:00Z',
    description: '3% Management Fee (Rent Payment)'
  },
  {
    id: 'tx_2',
    type: 'commission_credit',
    amount: 12500,
    status: 'locked', // Shadow landlord
    building_name: 'Okonkwo Villa',
    unit_number: 'Flat 1',
    client_name: 'Chief Obi Okonkwo',
    created_at: '2026-01-20T14:00:00Z',
    description: '3% Management Fee (Rent Payment)'
  },
  {
    id: 'tx_3',
    type: 'payout_withdrawal',
    amount: -10000,
    status: 'cleared',
    building_name: 'N/A',
    client_name: 'Verbaac Payout',
    created_at: '2026-01-05T09:00:00Z',
    description: 'Withdrawal to GTBank **9021'
  }
];

export const agentService = {
  // Check if current user has an agent profile
  getProfile: async (): Promise<AgentProfile | null> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockAgentProfile;
  },

  createProfile: async (data: AgentProfileData): Promise<AgentProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newProfile: AgentProfile = {
      ...data,
      id: `agt_${Math.random().toString(36).substr(2, 9)}`,
      user_id: 'user_current',
      display_id: `AGT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      verification_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockAgentProfile = newProfile;
    return newProfile;
  },

  simulateApproval: async (): Promise<void> => {
    if (mockAgentProfile) {
      mockAgentProfile.verification_status = 'verified';
    }
  },

  // --- Client Management ---
  getClients: async (): Promise<ClientProfile[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockClients;
  },

  createShadowClient: async (data: { full_name: string; email: string; phone: string }): Promise<ClientProfile> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newClient: ClientProfile = {
      id: `shadow_owner_${Math.random().toString(36).substr(2, 9)}`,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      status: 'shadow',
      managed_buildings_count: 0,
      managed_units_count: 0,
      wallet_balance: { available: 0, pending: 0 },
      created_at: new Date().toISOString(),
    };
    mockClients.unshift(newClient);
    return newClient;
  },

  sendKYCInvite: async (clientId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    console.log(`[Mock API] Sent KYC invite to ${clientId}`);
    // Simulate updating client status after "magic" link click (for demo purposes maybe just toast?)
    // In real world, this sends email.
  },

  // --- Portfolio ---
  getManagedProperties: async (): Promise<ManagedProperty[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockManagedProperties;
  },

  createListing: async (data: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('[Mock API] Agent created proxy listing:', data);
    return { success: true, id: `list_${Math.random()}` };
  },

  // --- Wallet ---
  getWalletStats: async (): Promise<AgentWalletStats> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      available_balance: 50000, 
      pending_balance: 12500, // Locked from shadow client
      total_earned: 62500,
      transactions: mockTransactions
    };
  },

  withdrawFunds: async (amount: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`[Mock API] Withdrawal of ${amount} initiated.`);
  }
};


// --- Mock Data ---

export interface ClientProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: 'active' | 'shadow';
  managed_buildings_count: number;
  managed_units_count: number;
  wallet_balance: {
    available: number;
    pending: number;
  };
  created_at: string;
}

const mockClients: ClientProfile[] = [
  {
    id: 'owner_1',
    full_name: 'Dr. Sarah Ahmed',
    email: 'sarah.ahmed@example.com',
    phone: '+234 800 123 4567',
    status: 'active',
    managed_buildings_count: 2,
    managed_units_count: 8,
    wallet_balance: { available: 450000, pending: 12000 },
    created_at: '2025-11-15T10:00:00Z',
  },
  {
    id: 'owner_2',
    full_name: 'Chief Obi Okonkwo',
    email: 'obi.okonkwo@example.com',
    phone: '+234 700 987 6543',
    status: 'shadow',
    managed_buildings_count: 1,
    managed_units_count: 4,
    wallet_balance: { available: 0, pending: 85000 }, // Pending rent
    created_at: '2026-01-10T14:30:00Z',
  }
];

// --- Managed Property Mock Data ---

export interface ManagedProperty {
  id: string;
  name: string;
  address: string;
  owner_id: string;
  owner_name: string;
  total_units: number;
  occupancy_rate: number;
  verification_status: 'verified' | 'pending_vetting' | 'rejected' | 'draft';
  image_url?: string;
}

const mockManagedProperties: ManagedProperty[] = [
  {
    id: 'bld_1',
    name: 'Ahmed Heights',
    address: '15 Rwang Pam Street, Jos',
    owner_id: 'owner_1',
    owner_name: 'Dr. Sarah Ahmed',
    total_units: 6,
    occupancy_rate: 85,
    verification_status: 'verified',
    image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'bld_2',
    name: 'Okonkwo Villa',
    address: 'Plot 4, Federal Lowcost',
    owner_id: 'owner_2',
    owner_name: 'Chief Obi Okonkwo',
    total_units: 4,
    occupancy_rate: 100,
    verification_status: 'pending_vetting',
    image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  }
];
