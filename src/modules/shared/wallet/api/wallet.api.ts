import { apiClient } from '@/lib/api';
import type { AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  Wallet, 
  EscrowTransaction, 
  BankAccount 
} from '@/types';

/**
 * Wallet API Service
 * Handles all wallet, escrow, and bank account related operations.
 * Every request uses apiClient which injects the X-Active-Persona header.
 */
export const walletAPI = {
  // Get user wallet balance
  getWallet: (): Promise<AxiosResponse<ApiResponse<Wallet>>> =>
    apiClient.get('/wallet'),

  // Get escrow transactions
  getEscrowTransactions: (params?: {
    status?: 'held' | 'released' | 'disputed';
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<ApiResponse<EscrowTransaction[]>>> =>
    apiClient.get('/wallet/escrow', { params }),

  // Get single escrow transaction
  getEscrowTransaction: (id: string): Promise<AxiosResponse<ApiResponse<EscrowTransaction>>> =>
    apiClient.get(`/wallet/escrow/${id}`),

  // Get bank accounts
  getBankAccounts: (): Promise<AxiosResponse<ApiResponse<BankAccount[]>>> =>
    apiClient.get('/wallet/bank-accounts'),

  // Add bank account (requires re-authentication)
  addBankAccount: (data: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    isPrimary?: boolean;
    reAuthToken: string; // Session re-auth token
  }): Promise<AxiosResponse<ApiResponse<BankAccount>>> =>
    apiClient.post('/wallet/bank-accounts', data),

  // Update bank account (requires re-authentication)
  updateBankAccount: (
    id: string, 
    data: Partial<BankAccount> & { reAuthToken: string }
  ): Promise<AxiosResponse<ApiResponse<BankAccount>>> =>
    apiClient.patch(`/wallet/bank-accounts/${id}`, data),

  // Delete bank account (requires re-authentication)
  deleteBankAccount: (
    id: string, 
    reAuthToken: string
  ): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.delete(`/wallet/bank-accounts/${id}`, { data: { reAuthToken } }),

  // Set primary bank account (requires re-authentication)
  setPrimaryBankAccount: (
    id: string, 
    reAuthToken: string
  ): Promise<AxiosResponse<ApiResponse<BankAccount>>> =>
    apiClient.post(`/wallet/bank-accounts/${id}/set-primary`, { reAuthToken }),

  // Request withdrawal (requires re-authentication)
  requestWithdrawal: (data: {
    amount: number;
    bankAccountId: string;
    reAuthToken: string;
  }): Promise<AxiosResponse<ApiResponse<{ transactionId: string; status: string }>>> =>
    apiClient.post('/wallet/withdraw', data),

  // Re-authenticate session (returns a short-lived reAuthToken)
  reAuthenticate: (password: string): Promise<AxiosResponse<ApiResponse<{ reAuthToken: string; expiresIn: number }>>> =>
    apiClient.post('/auth/re-authenticate', { password }),
};

export default walletAPI;
