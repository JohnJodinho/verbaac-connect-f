import { apiClient } from '@/lib/api';
import type { AxiosResponse } from 'axios';
import type { ApiResponse, TrustScore, ReferralInfo } from '@/types';

/**
 * Rewards API Service
 * Handles trust/credibility scores and referral system.
 */
export const rewardsAPI = {
  // Get user's trust/credibility score
  getTrustScore: (): Promise<AxiosResponse<ApiResponse<TrustScore>>> =>
    apiClient.get('/rewards/trust-score'),

  // Get referral information
  getReferralInfo: (): Promise<AxiosResponse<ApiResponse<ReferralInfo>>> =>
    apiClient.get('/rewards/referrals'),

  // Generate new referral code
  generateReferralCode: (): Promise<AxiosResponse<ApiResponse<{ referralCode: string; referralLink: string }>>> =>
    apiClient.post('/rewards/referrals/generate'),

  // Get referral history
  getReferralHistory: (params?: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<ApiResponse<Array<{
    id: string;
    referredUserName: string;
    status: 'pending' | 'completed';
    rewardAmount: number;
    createdAt: string;
  }>>>> =>
    apiClient.get('/rewards/referrals/history', { params }),
};

export default rewardsAPI;
