import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types';
import type { SellerOnboardingData } from '../onboarding/schemas/sellerOnboarding.schema';
import type { AxiosResponse } from 'axios';

// Response types
interface SellerActivationResponse {
  displayId: string;           // SLR-2026-001 format
  walletId: string;            // Generated wallet ID
  rolesRegistryId: string;     // roles_registry entry ID
}

interface UsernameCheckResponse {
  available: boolean;
  suggestions?: string[];
}

interface BankVerificationResponse {
  verified: boolean;
  accountName: string;
  bankName: string;
}

// Seller onboarding API service
export const sellerApi = {
  /**
   * Activate seller role for current user
   * Creates: roles_registry entry, wallets record, seller profile
   */
  activateSeller: (
    data: SellerOnboardingData
  ): Promise<AxiosResponse<ApiResponse<SellerActivationResponse>>> =>
    apiClient.post('/roles/seller/activate', {
      userName: data.userName,
      profilePhotoUrl: data.profilePhotoUrl || null,
      bankDetails: {
        bankName: data.bankName,
        bankCode: data.bankCode,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
      },
      termsAccepted: data.termsAccepted,
      dataPrivacyAccepted: data.dataPrivacyAccepted,
    }),

  /**
   * Check if a seller username is available
   */
  checkUsername: (
    username: string
  ): Promise<AxiosResponse<ApiResponse<UsernameCheckResponse>>> =>
    apiClient.get(`/seller/username-check/${encodeURIComponent(username)}`),

  /**
   * Verify bank account via Paystack resolve endpoint
   * This helps pre-validate account name matches
   */
  verifyBankAccount: (
    accountNumber: string,
    bankCode: string
  ): Promise<AxiosResponse<ApiResponse<BankVerificationResponse>>> =>
    apiClient.post('/payments/verify-account', {
      accountNumber,
      bankCode,
    }),
};

export default sellerApi;
