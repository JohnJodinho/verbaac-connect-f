/**
 * Seller Dashboard Service
 * 
 * Handles seller dashboard data fetching with a mockable layer
 * for development without a live backend.
 * 
 * To switch between mock and real API:
 * - Set VITE_USE_MOCK_API=true in .env for mock mode
 * - Set VITE_USE_MOCK_API=false for real API calls
 */

import { apiClient } from '@/lib/api';

// === Configuration ===
const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK_API !== 'false';
const MOCK_DELAY_MS = 800;

// === Enums (from DBML) ===
export type EscrowStatus = 'held' | 'released' | 'disputed';
export type FulfillmentType = 'pickup' | 'delivery';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type DisputeStatus = 'pending' | 'resolved_buyer' | 'resolved_seller';

// === Types ===
export interface SellerStats {
  totalItems: number;
  activeListings: number;
  pendingOrders: number;
  totalSales: number;
  pendingRevenue: number;
  availableForPayout: number;
}

export interface SellerWalletData {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalCommissionPaid: number;
}

export interface SellerTransaction {
  id: string;
  transactionRef: string;
  itemName: string;
  buyerName: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: EscrowStatus;
  createdAt: string;
}

// === Order Types (Stage 4) ===
export interface SellerOrder {
  id: string;
  orderRef: string;
  itemId: string;
  itemTitle: string;
  itemImageUrl: string | null;
  itemCondition: 'new' | 'used' | 'refurbished';
  
  // Privacy-gated fields (revealed only when escrow is 'held' or 'released')
  buyerId: string;
  buyerName: string;
  buyerAddress: string | null;  // Only for delivery orders
  buyerPhone: string;           // Always masked in UI
  
  escrowStatus: EscrowStatus;
  fulfillmentType: FulfillmentType;
  pickupLandmark?: string;
  
  // Financial
  amount: number;
  platformFee: number;
  sellerReceives: number;
  
  // Timestamps
  createdAt: string;
  paidAt?: string;
  fulfilledAt?: string;
  releasedAt?: string;
}

// === Dispute Types (Stage 5) ===
export interface DisputeDetails {
  id: string;
  orderId: string;
  orderRef: string;
  itemTitle: string;
  
  // Buyer complaint
  reason: string;
  buyerEvidence: string[];  // Media URLs
  
  // AI Analysis
  aiMatchScore: number;       // 0-100% (higher = images match)
  aiAnalysisSummary: string;
  
  // Admin review
  adminNotes?: string;
  adminDecision?: string;
  
  status: DisputeStatus;
  createdAt: string;
  resolvedAt?: string;
}

// === Response Types ===
export interface SellerStatsResponse {
  success: boolean;
  data: SellerStats;
}

export interface SellerWalletResponse {
  success: boolean;
  data: {
    wallet: SellerWalletData;
    recentTransactions: SellerTransaction[];
  };
}

export interface SellerOrdersResponse {
  success: boolean;
  data: SellerOrder[];
}

export interface SellerOrderResponse {
  success: boolean;
  data: SellerOrder;
}

export interface DisputeListResponse {
  success: boolean;
  data: DisputeDetails[];
}

export interface DisputeDetailsResponse {
  success: boolean;
  data: DisputeDetails;
}

// === Mock Data ===

const MOCK_ORDERS: SellerOrder[] = [
  {
    id: 'ord-001',
    orderRef: 'MKT-2026-001',
    itemId: 'item-001',
    itemTitle: 'iPhone 14 Pro Max 256GB',
    itemImageUrl: null,
    itemCondition: 'used',
    buyerId: 'buyer-001',
    buyerName: 'Adebayo Ogundimu',
    buyerAddress: '15 Naraguta Road, Jos North',
    buyerPhone: '+2348012345678',
    escrowStatus: 'held',
    fulfillmentType: 'delivery',
    amount: 450000,
    platformFee: 54000,
    sellerReceives: 396000,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    paidAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ord-002',
    orderRef: 'MKT-2026-002',
    itemId: 'item-002',
    itemTitle: 'Samsung Galaxy S24 Ultra',
    itemImageUrl: null,
    itemCondition: 'new',
    buyerId: 'buyer-002',
    buyerName: 'Chidinma Eze',
    buyerAddress: null,
    buyerPhone: '+2348023456789',
    escrowStatus: 'held',
    fulfillmentType: 'pickup',
    pickupLandmark: 'Lobby of Naraguta Luxury Lodge',
    amount: 520000,
    platformFee: 62400,
    sellerReceives: 457600,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    paidAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'ord-003',
    orderRef: 'MKT-2026-003',
    itemId: 'item-003',
    itemTitle: 'MacBook Pro M3 2024',
    itemImageUrl: null,
    itemCondition: 'refurbished',
    buyerId: 'buyer-003',
    buyerName: 'Fatima Mohammed',
    buyerAddress: '42 University Road, Bauchi Road',
    buyerPhone: '+2348034567890',
    escrowStatus: 'released',
    fulfillmentType: 'delivery',
    amount: 850000,
    platformFee: 102000,
    sellerReceives: 748000,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    paidAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    fulfilledAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    releasedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ord-004',
    orderRef: 'MKT-2026-004',
    itemId: 'item-004',
    itemTitle: 'Sony WH-1000XM5 Headphones',
    itemImageUrl: null,
    itemCondition: 'new',
    buyerId: 'buyer-004',
    buyerName: 'Emeka Nwosu',
    buyerAddress: null,
    buyerPhone: '+2348045678901',
    escrowStatus: 'disputed',
    fulfillmentType: 'pickup',
    pickupLandmark: 'Main Gate, UNIJOS',
    amount: 85000,
    platformFee: 10200,
    sellerReceives: 74800,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    paidAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const MOCK_DISPUTES: DisputeDetails[] = [
  {
    id: 'disp-001',
    orderId: 'ord-004',
    orderRef: 'MKT-2026-004',
    itemTitle: 'Sony WH-1000XM5 Headphones',
    reason: 'Item not as described - Left ear cup has visible scratches not shown in listing photos',
    buyerEvidence: [
      'https://placeholder.com/evidence1.jpg',
      'https://placeholder.com/evidence2.jpg',
    ],
    aiMatchScore: 72,
    aiAnalysisSummary: 'Image mismatch detected: Buyer photos show surface damage not present in original listing. Confidence: 85%',
    adminNotes: 'AI analysis shows discrepancy. Awaiting seller response before final decision.',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// === Mock Implementations ===

const mockGetSellerStats = async (): Promise<SellerStatsResponse> => {
  console.log('[Mock API] Fetching seller stats | X-Active-Persona: seller');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          totalItems: 12,
          activeListings: 8,
          pendingOrders: 3,
          totalSales: 245000,
          pendingRevenue: 75000,
          availableForPayout: 170000,
        },
      });
    }, MOCK_DELAY_MS);
  });
};

const mockGetEmptySellerStats = async (): Promise<SellerStatsResponse> => {
  console.log('[Mock API] Fetching empty seller stats (new seller) | X-Active-Persona: seller');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          totalItems: 0,
          activeListings: 0,
          pendingOrders: 0,
          totalSales: 0,
          pendingRevenue: 0,
          availableForPayout: 0,
        },
      });
    }, MOCK_DELAY_MS);
  });
};

const mockGetSellerWallet = async (): Promise<SellerWalletResponse> => {
  console.log('[Mock API] Fetching seller wallet data | X-Active-Persona: seller');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          wallet: {
            availableBalance: 170000,
            pendingBalance: 75000,
            totalEarnings: 520000,
            totalCommissionPaid: 62400,
          },
          recentTransactions: [
            {
              id: '1',
              transactionRef: 'MKT-2025-001',
              itemName: 'MacBook Pro 2023',
              buyerName: 'Adebayo O.',
              amount: 450000,
              platformFee: 54000,
              netAmount: 396000,
              status: 'released',
              createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
            {
              id: '2',
              transactionRef: 'MKT-2025-002',
              itemName: 'iPhone 14 Pro Max',
              buyerName: 'Chidinma E.',
              amount: 85000,
              platformFee: 10200,
              netAmount: 74800,
              status: 'held',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: '3',
              transactionRef: 'MKT-2025-003',
              itemName: 'Samsung Galaxy S24',
              buyerName: 'Fatima M.',
              amount: 65000,
              platformFee: 7800,
              netAmount: 57200,
              status: 'held',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      });
    }, MOCK_DELAY_MS);
  });
};

// === Order Mock Functions (Stage 4) ===

const mockFetchOrders = async (): Promise<SellerOrdersResponse> => {
  console.log('[Mock API] Fetching seller orders | X-Active-Persona: seller');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: MOCK_ORDERS,
      });
    }, MOCK_DELAY_MS);
  });
};

const mockGetOrderDetails = async (orderId: string): Promise<SellerOrderResponse> => {
  console.log(`[Mock API] Fetching order ${orderId} | X-Active-Persona: seller`);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = MOCK_ORDERS.find(o => o.id === orderId);
      if (order) {
        resolve({ success: true, data: order });
      } else {
        reject(new Error('Order not found'));
      }
    }, MOCK_DELAY_MS);
  });
};

const mockConfirmFulfillment = async (orderId: string): Promise<SellerOrderResponse> => {
  console.log(`[Mock API] Confirming fulfillment for ${orderId} | X-Active-Persona: seller`);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        MOCK_ORDERS[orderIndex] = {
          ...MOCK_ORDERS[orderIndex],
          fulfilledAt: new Date().toISOString(),
        };
        resolve({ success: true, data: MOCK_ORDERS[orderIndex] });
      } else {
        reject(new Error('Order not found'));
      }
    }, MOCK_DELAY_MS);
  });
};

// === Dispute Mock Functions (Stage 5) ===

const mockFetchDisputes = async (): Promise<DisputeListResponse> => {
  console.log('[Mock API] Fetching seller disputes | X-Active-Persona: seller');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: MOCK_DISPUTES,
      });
    }, MOCK_DELAY_MS);
  });
};

const mockGetDisputeDetails = async (disputeId: string): Promise<DisputeDetailsResponse> => {
  console.log(`[Mock API] Fetching dispute ${disputeId} | X-Active-Persona: seller`);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dispute = MOCK_DISPUTES.find(d => d.id === disputeId);
      if (dispute) {
        resolve({ success: true, data: dispute });
      } else {
        reject(new Error('Dispute not found'));
      }
    }, MOCK_DELAY_MS);
  });
};

// === Real API Implementations ===

const realGetSellerStats = async (): Promise<SellerStatsResponse> => {
  const response = await apiClient.get<SellerStatsResponse>('/seller/stats');
  return response.data;
};

const realGetSellerWallet = async (): Promise<SellerWalletResponse> => {
  const response = await apiClient.get<SellerWalletResponse>('/seller/wallet');
  return response.data;
};

const realFetchOrders = async (): Promise<SellerOrdersResponse> => {
  const response = await apiClient.get<SellerOrdersResponse>('/seller/orders');
  return response.data;
};

const realGetOrderDetails = async (orderId: string): Promise<SellerOrderResponse> => {
  const response = await apiClient.get<SellerOrderResponse>(`/seller/orders/${orderId}`);
  return response.data;
};

const realConfirmFulfillment = async (orderId: string): Promise<SellerOrderResponse> => {
  const response = await apiClient.post<SellerOrderResponse>(`/seller/orders/${orderId}/fulfill`);
  return response.data;
};

const realFetchDisputes = async (): Promise<DisputeListResponse> => {
  const response = await apiClient.get<DisputeListResponse>('/seller/disputes');
  return response.data;
};

const realGetDisputeDetails = async (disputeId: string): Promise<DisputeDetailsResponse> => {
  const response = await apiClient.get<DisputeDetailsResponse>(`/seller/disputes/${disputeId}`);
  return response.data;
};

// === Exported Service Functions ===

export const getSellerStats = IS_MOCK_MODE ? mockGetSellerStats : realGetSellerStats;
export const getEmptySellerStats = mockGetEmptySellerStats;
export const getSellerWallet = IS_MOCK_MODE ? mockGetSellerWallet : realGetSellerWallet;

// Orders (Stage 4)
export const fetchOrders = IS_MOCK_MODE ? mockFetchOrders : realFetchOrders;
export const getOrderDetails = IS_MOCK_MODE ? mockGetOrderDetails : realGetOrderDetails;
export const confirmFulfillment = IS_MOCK_MODE ? mockConfirmFulfillment : realConfirmFulfillment;

// Disputes (Stage 5)
export const fetchDisputes = IS_MOCK_MODE ? mockFetchDisputes : realFetchDisputes;
export const getDisputeDetails = IS_MOCK_MODE ? mockGetDisputeDetails : realGetDisputeDetails;

// === Debug Info ===
if (IS_MOCK_MODE) {
  console.log('[Seller Service] Running in MOCK MODE');
} else {
  console.log('[Seller Service] Running in LIVE MODE');
}

export default {
  getSellerStats,
  getEmptySellerStats,
  getSellerWallet,
  fetchOrders,
  getOrderDetails,
  confirmFulfillment,
  fetchDisputes,
  getDisputeDetails,
};
