
// --- INTERFACES ---

export interface AdminProfile {
  id: string;
  display_id: string; // ADM-YEAR-SEQ
  email: string;
  full_name: string;
  role: 'super_admin' | 'moderator' | 'support' | 'finance'; // Unified role
  admin_level: 'super' | 'moderator' | 'finance'; // Kept for compatibility with new code
  is_active: boolean;
  last_login?: string;
  access_level?: number;
  permissions: {
    can_ban_users: boolean;
    can_resolve_disputes: boolean;
    can_manage_team: boolean;
    can_view_financials: boolean;
  };
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'maintenance';
  active_users: number;
  pending_verifications: number;
  total_escrow_volume: number;
  server_uptime: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  full_name: string;
  persona_type: 'landlord' | 'agent' | 'seller' | 'ambassador';
  submitted_at: string;
  status: 'pending' | 'verified' | 'rejected';
  documents: {
    id_card_url: string;
    id_type: string;
    property_proof_url?: string;
    business_reg_url?: string;
  };
  metadata: {
    email: string;
    phone: string;
    location?: string;
  };
}

export interface DisputeCase {
  id: string;
  transaction_ref: string;
  lineage: {
    listing_id?: string;
    item_id?: string;
  };
  type: 'housing' | 'marketplace';
  amount: number;
  status: 'disputed' | 'resolved';
  created_at: string;
  parties: {
    payer: { name: string; id: string; role: string };
    payee: { name: string; id: string; role: string };
  };
  split_breakdown: {
    platform_fee: number; // 12%
    provider_share: number; // 88%
  };
  evidence: {
    report_id: string;
    ambassador_name: string;
    media_urls: string[];
    check_in_geom: { lat: number; lng: number }; // GPS Data
    gps_match_score: number; // 0-100
    ai_confidence_tier: 'high' | 'medium' | 'low';
  };
}

export interface GlobalUser {
  id: string;
  display_id: string; // Primary persona ID (e.g., LLD-2026-001 or Consumer)
  full_name: string;
  email: string;
  phone_number: string;
  status: 'active' | 'deactivated' | 'banned';
  unlocked_roles: string[]; // ['consumer', 'landlord', 'agent']
  personas: {
    landlord?: { is_active: boolean; display_id: string };
    agent?: { is_active: boolean; display_id: string };
    seller?: { is_active: boolean; display_id: string };
  };
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  actor: string; // Admin ID
  timestamp: string;
  type: 'verification' | 'security' | 'financial' | 'system';
}

// --- MOCK DATA ---

const mockAdmin: AdminProfile = {
  id: 'adm_super_001',
  display_id: 'ADM-2026-001',
  email: 'root@verbaac.com',
  full_name: 'System Superadmin',
  role: 'super_admin',
  admin_level: 'super',
  is_active: true,
  last_login: new Date().toISOString(),
  access_level: 10,
  permissions: {
    can_ban_users: true,
    can_resolve_disputes: true,
    can_manage_team: true,
    can_view_financials: true
  }
};

const mockAdminTeam: AdminProfile[] = [
  mockAdmin,
  {
    id: 'adm_002',
    display_id: 'ADM-2026-002',
    email: 'mod@verbaac.com',
    full_name: 'Content Moderator',
    role: 'moderator',
    admin_level: 'moderator',
    is_active: true,
    permissions: {
      can_ban_users: false,
      can_resolve_disputes: true,
      can_manage_team: false,
      can_view_financials: false
    }
  }
];

const mockGlobalUsers: GlobalUser[] = [
  {
    id: 'u_001',
    display_id: 'LLD-2026-882',
    full_name: 'Dr. Chike Obi',
    email: 'chike.obi@gmail.com',
    phone_number: '+2348099221100',
    status: 'active',
    unlocked_roles: ['consumer', 'landlord'],
    personas: {
      landlord: { is_active: true, display_id: 'LLD-2026-882' }
    },
    created_at: '2025-12-10T09:00:00Z'
  },
  {
    id: 'u_002',
    display_id: 'AGT-2026-104',
    full_name: 'Sarah Johnson',
    email: 's.johnson@remax.ng',
    phone_number: '+2347011223344',
    status: 'active',
    unlocked_roles: ['consumer', 'agent'],
    personas: {
      agent: { is_active: true, display_id: 'AGT-2026-104' }
    },
    created_at: '2026-01-15T14:30:00Z'
  },
  {
    id: 'u_003',
    display_id: 'CONS-992-11',
    full_name: 'Bad Actor User',
    email: 'scammer@fake.com',
    phone_number: '+2349090000000',
    status: 'banned',
    unlocked_roles: ['consumer'],
    personas: {},
    created_at: '2026-02-01T08:00:00Z'
  }
];

const mockVerificationQueue: VerificationRequest[] = [
  {
    id: 'req_001',
    user_id: 'u_landlord_01',
    full_name: 'Chief Alaba Usman',
    persona_type: 'landlord',
    submitted_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    status: 'pending',
    documents: {
      id_card_url: 'https://placehold.co/600x400/png?text=NIN+ID+Card',
      id_type: 'NIN Slip',
      property_proof_url: 'https://placehold.co/600x800/png?text=C+of+O+Document'
    },
    metadata: {
      email: 'landlord.usman@demo.com',
      phone: '+234 800 000 0000',
      location: 'Lekki Phase 1, Lagos'
    }
  },
  {
    id: 'req_002',
    user_id: 'u_agent_05',
    full_name: 'Sarah Ibe (Top Realtors)',
    persona_type: 'agent',
    submitted_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: 'pending',
    documents: {
      id_card_url: 'https://placehold.co/600x400/png?text=Voters+Card',
      id_type: 'Voters Card',
      business_reg_url: 'https://placehold.co/600x800/png?text=CAC+Certificate'
    },
    metadata: {
      email: 'sarah@toprealtors.ng',
      phone: '+234 900 000 0000',
      location: 'Yaba, Lagos'
    }
  },
  {
    id: 'req_003',
    user_id: 'u_seller_09',
    full_name: 'Campus Gadgets Ltd',
    persona_type: 'seller',
    submitted_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    status: 'pending',
    documents: {
      id_card_url: 'https://placehold.co/600x400/png?text=International+Passport',
      id_type: 'International Passport'
    },
    metadata: {
      email: 'sales@campusgadgets.com',
      phone: '+234 700 000 0000',
      location: 'Unilag Campus'
    }
  }
];

const mockActivityLogs: ActivityLog[] = [
  { id: 'act_1', action: 'Approved Verification', target: 'Agatha Properties (Agent)', actor: 'ADM-2026-X', timestamp: new Date(Date.now() - 300000).toISOString(), type: 'verification' },
  { id: 'act_2', action: 'System Alert Cleared', target: 'Database Latency', actor: 'System', timestamp: new Date(Date.now() - 1200000).toISOString(), type: 'system' },
  { id: 'act_3', action: 'Escrow Released', target: 'TX-998271', actor: 'ADM-2026-X', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'financial' },
  { id: 'act_4', action: 'Failed Login Attempt', target: 'IP: 192.168.1.1', actor: 'Firewall', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'security' },
];

const mockDisputeQueue: DisputeCase[] = [
  {
    id: 'disp_001',
    transaction_ref: 'TX-998271',
    lineage: { listing_id: 'lst_102' },
    type: 'housing',
    amount: 1500000,
    status: 'disputed',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    parties: {
      payer: { name: 'Chinedu Okeke', id: 'u_stud_05', role: 'Student' },
      payee: { name: 'Lekki Gardens Ltd', id: 'u_land_09', role: 'Landlord' }
    },
    split_breakdown: {
      platform_fee: 180000,
      provider_share: 1320000
    },
    evidence: {
      report_id: 'rep_772',
      ambassador_name: 'David Mark',
      media_urls: [
        'https://placehold.co/600x400/png?text=Apartment+Interior',
        'https://placehold.co/600x400/png?text=Broken+AC+Unit'
      ],
      check_in_geom: { lat: 6.45, lng: 3.55 }, // Lekki approx
      gps_match_score: 98,
      ai_confidence_tier: 'high'
    }
  },
  {
    id: 'disp_002',
    transaction_ref: 'TX-110293',
    lineage: { item_id: 'itm_882' },
    type: 'marketplace',
    amount: 45000,
    status: 'disputed',
    created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    parties: {
      payer: { name: 'Sarah Jones', id: 'u_stud_12', role: 'Student' },
      payee: { name: 'Campus Tech Hub', id: 'u_sell_03', role: 'Seller' }
    },
    split_breakdown: {
      platform_fee: 5400,
      provider_share: 39600
    },
    evidence: {
      report_id: 'rep_889',
      ambassador_name: 'System Auto-Flag',
      media_urls: [
        'https://placehold.co/600x400/png?text=Damaged+Package'
      ],
      check_in_geom: { lat: 6.52, lng: 3.37 }, // Unilag approx
      gps_match_score: 100, // Delivery location match
      ai_confidence_tier: 'medium'
    }
  }
];

// --- GOVERNANCE TYPES ---

export interface TreasuryTransaction {
  id: string;
  reference: string;
  amount: number;
  split_category: 'verbaac_10' | 'verbaac_7' | 'landlord_88' | 'agent_2' | 'ambassador_1';
  status: 'held' | 'released' | 'refunded';
  created_at: string;
  moderated_by?: string;
  resolution_note?: string;
}

export interface Zone {
  id: string;
  name: string;
  type: 'city' | 'village' | 'campus';
  status: 'active' | 'inactive';
  parent_id?: string; // Links Village to City
}

export interface PropertyType {
  id: string;
  name: string; // e.g., Penthouse, BQ
  is_active: boolean;
  category: 'residential' | 'commercial';
}

export interface AmbassadorProfile {
  id: string; // user_id
  full_name: string;
  tier_level: 'novice' | 'verified' | 'elite';
  credibility_score: number; // 0-100
  total_gigs: number;
  status: 'active' | 'probation' | 'suspended';
}

// --- MOCK GOVERNANCE DATA ---

const mockTreasury: TreasuryTransaction[] = [
  { id: 'tx_101', reference: 'TX-998-001', amount: 45000, split_category: 'verbaac_10', status: 'held', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'tx_102', reference: 'TX-998-002', amount: 31500, split_category: 'verbaac_7', status: 'released', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'tx_103', reference: 'TX-998-003', amount: 150000, split_category: 'landlord_88', status: 'held', created_at: new Date(Date.now() - 43200000).toISOString() },
];

const mockZones: Zone[] = [
  { id: 'z_01', name: 'Lekki', type: 'city', status: 'active' },
  { id: 'z_02', name: 'Ikate', type: 'village', status: 'active', parent_id: 'z_01' },
  { id: 'z_03', name: 'Unilag', type: 'campus', status: 'active' },
];

const mockPropertyTypes: PropertyType[] = [
  { id: 'pt_01', name: 'Self Contain', is_active: true, category: 'residential' },
  { id: 'pt_02', name: '2 Bedroom Flat', is_active: true, category: 'residential' },
  { id: 'pt_03', name: 'Penthouse', is_active: false, category: 'residential' },
];

const mockAmbassadors: AmbassadorProfile[] = [
  { id: 'amb_01', full_name: 'David Mark', tier_level: 'verified', credibility_score: 92, total_gigs: 45, status: 'active' },
  { id: 'amb_02', full_name: 'Sarah Paul', tier_level: 'novice', credibility_score: 78, total_gigs: 12, status: 'active' },
];

// --- ADMIN SERVICE ---

export const adminService = {
  // 1. Verify 2FA Code (Mock)
  loginWith2FA: async (code: string): Promise<{ success: boolean; token?: string; profile?: AdminProfile }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Hardcoded mock code for testing
    if (code === '123456') {
      return {
        success: true,
        token: 'mock_admin_jwt_' + Date.now(),
        profile: mockAdmin
      };
    }
    
    return { success: false };
  },

  // 2. Get System Overview
  getSystemOverview: async (): Promise<SystemHealth> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      status: 'healthy',
      active_users: 12450,
      pending_verifications: 45,
      total_escrow_volume: 85000000,
      server_uptime: '99.98%'
    };
  },

  // 3. User Management Placeholders
  searchUsers: async (_query: string) => {
    // To be implemented
    return [];
  },

  async getGlobalUsers(): Promise<GlobalUser[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockGlobalUsers;
  },

  async updateUserStatus(userId: string, status: 'active' | 'banned' | 'deactivated'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = mockGlobalUsers.find(u => u.id === userId);
    if (user) {
      user.status = status;
      adminService.logActivity({
        type: 'security',
        action: 'UPDATE_USER_STATUS',
        target: `${user.full_name} -> ${status.toUpperCase()}`,
        actor: 'Superadmin'
      } as ActivityLog);
    }
  },

  async togglePersonaStatus(userId: string, persona: 'landlord' | 'agent' | 'seller', isActive: boolean): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = mockGlobalUsers.find(u => u.id === userId);
    if (user && user.personas[persona]) {
      user.personas[persona]!.is_active = isActive;
      adminService.logActivity({
        type: 'security',
        action: 'TOGGLE_PERSONA',
        target: `${persona.toUpperCase()} for ${user.display_id} -> ${isActive ? 'ACTIVE' : 'SUSPENDED'}`,
        actor: 'Superadmin'
      } as ActivityLog);
    }
  },

  // 4. Verification Center
  getVerificationQueue: async (): Promise<VerificationRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockVerificationQueue;
  },

  processVerification: async (id: string, action: 'approve' | 'reject', notes?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Processing verification ${id}: ${action} - ${notes}`);
    return { success: true };
  },

  // 5. Activity Logs
  getRecentActivity: async (): Promise<ActivityLog[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockActivityLogs;
  },

  logActivity: (log: Partial<ActivityLog>) => {
    const newLog: ActivityLog = {
      id: `act_${Date.now()}`,
      action: log.action || 'Unknown Action',
      target: log.target || 'Unknown Target',
      actor: log.actor || 'System',
      timestamp: new Date().toISOString(),
      type: log.type || 'system'
    };
    mockActivityLogs.unshift(newLog);
  },

  // 6. Dispute Resolution Center
  getDisputeQueue: async (): Promise<DisputeCase[]> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return mockDisputeQueue;
  },

  resolveDispute: async (id: string, action: 'release_escrow' | 'refund_payer', _notes: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const dispute = mockDisputeQueue.find(d => d.id === id);
    if (dispute) {
       dispute.status = 'resolved';
       adminService.logActivity({
          type: 'financial',
          action: action === 'release_escrow' ? 'RELEASE_FUNDS' : 'REFUND_PAYER',
          target: dispute.transaction_ref,
          actor: 'Manual Admin Action'
       });
    }
  },

  // 7. Admin Team Management
  async getAdminTeam(): Promise<AdminProfile[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAdminTeam;
  },

  async updateAdminPermissions(id: string, permissions: AdminProfile['permissions']): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const admin = mockAdminTeam.find(a => a.id === id);
    if (admin) {
      admin.permissions = permissions;
      adminService.logActivity({
        type: 'security',
        action: 'UPDATE_PERMISSIONS',
        target: `Admin ${admin.display_id}`,
        actor: 'Superadmin'
      });
    }
  },

  async inviteAdmin(email: string, _level: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    adminService.logActivity({
      type: 'system',
      action: 'INVITE_ADMIN',
      target: email,
      actor: 'Superadmin'
    });
  },

  // 8. Governance Methods
  async getTreasuryData(): Promise<TreasuryTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockTreasury;
  },

  async updateSplitRatio(txId: string, _newSplit: string, note: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const tx = mockTreasury.find(t => t.id === txId);
    if (tx) {
       tx.resolution_note = note;
       tx.moderated_by = 'ADM-CURRENT';
       adminService.logActivity({
         type: 'financial',
         action: 'ADJUST_SPLIT',
         target: tx.reference,
         actor: 'Superadmin'
       });
    }
  },

  async getZones(): Promise<Zone[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockZones;
  },

  async addZone(name: string, type: Zone['type'], parentId?: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    mockZones.push({
      id: `z_${Date.now()}`,
      name,
      type,
      status: 'active',
      parent_id: parentId
    });
  },

  async getPropertyTypes(): Promise<PropertyType[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPropertyTypes;
  },

  async togglePropertyType(id: string): Promise<void> {
     await new Promise(resolve => setTimeout(resolve, 600));
     const pt = mockPropertyTypes.find(p => p.id === id);
     if (pt) pt.is_active = !pt.is_active;
  },

  async getAmbassadors(): Promise<AmbassadorProfile[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockAmbassadors;
  },

  async adjustAmbassadorTier(id: string, newTier: AmbassadorProfile['tier_level']): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const amb = mockAmbassadors.find(a => a.id === id);
    if (amb) {
       amb.tier_level = newTier;
       adminService.logActivity({
         type: 'system',
         action: 'UPDATE_TIER',
         target: `${amb.full_name} -> ${newTier.toUpperCase()}`,
         actor: 'Superadmin'
       });
    }
  }
};
