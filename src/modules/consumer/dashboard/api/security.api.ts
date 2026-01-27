import { apiClient } from '@/lib/api';
import type { AxiosResponse } from 'axios';
import type { ApiResponse, UserSession, PasswordUpdateData } from '@/types';

/**
 * Security API Service
 * Handles password management, session control, and KYC status.
 */
export const securityAPI = {
  // Update password
  updatePassword: (data: PasswordUpdateData): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.patch('/auth/password', data),

  // Get active sessions
  getSessions: (): Promise<AxiosResponse<ApiResponse<UserSession[]>>> =>
    apiClient.get('/auth/sessions'),

  // Revoke a specific session
  revokeSession: (sessionId: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.delete(`/auth/sessions/${sessionId}`),

  // Revoke all other sessions
  revokeAllOtherSessions: (): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.post('/auth/sessions/revoke-all'),

  // Get KYC status
  getKycStatus: (): Promise<AxiosResponse<ApiResponse<{
    status: 'active' | 'deactivated' | 'banned';
    verifiedAt?: string;
    reason?: string;
  }>>> =>
    apiClient.get('/auth/kyc-status'),
};

export default securityAPI;
