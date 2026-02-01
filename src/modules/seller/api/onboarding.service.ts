/**
 * Seller Onboarding Service
 * 
 * This service handles the seller onboarding API calls with a mockable layer
 * for testing without a live backend.
 * 
 * To switch between mock and real API:
 * - Set VITE_USE_MOCK_API=true in .env for mock mode
 * - Set VITE_USE_MOCK_API=false for real API calls
 */

import { apiClient } from '@/lib/api';
import type { SellerOnboardingData } from '../onboarding/schemas/sellerOnboarding.schema';

// === Configuration ===
const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK_API !== 'false';
const MOCK_DELAY_MS = 1500;

// === Types ===
export interface OnboardingResponse {
  success: boolean;
  sellerId: string;
  displayId: string;
  message: string;
}

export interface UsernameCheckResponse {
  available: boolean;
  message: string;
}

export interface BankVerifyResponse {
  verified: boolean;
  accountName: string;
  message: string;
}

// === Mock Implementations ===

const generateMockSellerId = (): string => {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 9000) + 1000;
  return `SLR-${year}-${sequence}`;
};

const mockSubmitOnboarding = async (data: SellerOnboardingData): Promise<OnboardingResponse> => {
  console.log('[Mock API] Seller Onboarding Received:', data);
  console.log('[Mock API] X-Active-Persona header would be set to: seller');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const displayId = generateMockSellerId();
      console.log('[Mock API] Generated Seller ID:', displayId);
      
      resolve({
        success: true,
        sellerId: crypto.randomUUID(),
        displayId,
        message: 'Seller account activated successfully!',
      });
    }, MOCK_DELAY_MS);
  });
};

const mockCheckUsername = async (username: string): Promise<UsernameCheckResponse> => {
  console.log('[Mock API] Checking username:', username);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate some usernames being taken
      const takenUsernames = ['test', 'admin', 'seller', 'verbaac', 'marketplace'];
      const available = !takenUsernames.includes(username.toLowerCase());
      
      resolve({
        available,
        message: available ? 'Username is available!' : 'Username is already taken',
      });
    }, 500);
  });
};

const mockVerifyBankAccount = async (
  bankCode: string, 
  accountNumber: string
): Promise<BankVerifyResponse> => {
  console.log('[Mock API] Verifying bank account:', { bankCode, accountNumber });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful verification for valid-looking account numbers
      const isValidFormat = accountNumber.length === 10 && /^\d+$/.test(accountNumber);
      
      if (isValidFormat) {
        // Generate a mock account name
        const mockNames = [
          'ADEBAYO OLUMIDE JOHNSON',
          'CHUKWUDI EMEKA OKONKWO', 
          'FATIMA AISHA MOHAMMED',
          'BLESSING CHIDINMA EZE',
        ];
        const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
        
        resolve({
          verified: true,
          accountName: randomName,
          message: 'Account verified successfully',
        });
      } else {
        resolve({
          verified: false,
          accountName: '',
          message: 'Could not verify account. Please check the account number.',
        });
      }
    }, 800);
  });
};

// === Real API Implementations ===

const realSubmitOnboarding = async (data: SellerOnboardingData): Promise<OnboardingResponse> => {
  const response = await apiClient.post<OnboardingResponse>('/roles/seller/activate', {
    userName: data.userName,
    profilePhotoUrl: data.profilePhotoUrl,
    bankName: data.bankName,
    bankCode: data.bankCode,
    accountNumber: data.accountNumber,
    accountName: data.accountName,
    termsAccepted: data.termsAccepted,
    dataPrivacyAccepted: data.dataPrivacyAccepted,
  });
  return response.data;
};

const realCheckUsername = async (username: string): Promise<UsernameCheckResponse> => {
  const response = await apiClient.get<UsernameCheckResponse>(
    `/seller/username-check/${encodeURIComponent(username)}`
  );
  return response.data;
};

const realVerifyBankAccount = async (
  bankCode: string, 
  accountNumber: string
): Promise<BankVerifyResponse> => {
  const response = await apiClient.post<BankVerifyResponse>('/payments/verify-account', {
    bankCode,
    accountNumber,
  });
  return response.data;
};

// === Exported Service Functions ===

/**
 * Submit the complete seller onboarding data
 * Updates roles_registry and creates seller profile
 */
export const submitOnboarding = IS_MOCK_MODE ? mockSubmitOnboarding : realSubmitOnboarding;

/**
 * Check if a seller username is available
 */
export const checkUsername = IS_MOCK_MODE ? mockCheckUsername : realCheckUsername;

/**
 * Verify a Nigerian bank account using Paystack
 */
export const verifyBankAccount = IS_MOCK_MODE ? mockVerifyBankAccount : realVerifyBankAccount;

// === Debug Info ===
if (IS_MOCK_MODE) {
  console.log('[Onboarding Service] Running in MOCK MODE - no real API calls will be made');
} else {
  console.log('[Onboarding Service] Running in LIVE MODE - connecting to real API');
}

export default {
  submitOnboarding,
  checkUsername,
  verifyBankAccount,
};
