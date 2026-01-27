import { apiClient } from '@/lib/api';
import type { AxiosResponse } from 'axios';
import type { ApiResponse, User } from '@/types';

// ==========================================
// PROFILE API TYPES
// ==========================================

export interface GlobalIdentityUpdate {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: 'male' | 'female';
  dateOfBirth?: string;
}

export interface TenantProfileUpdate {
  institution?: string;
  matricNo?: string;
  level?: number;
  preferredZones?: string[];
}

export interface BuyerProfileUpdate {
  defaultShippingAddress?: string;
  savedCategories?: string[];
}

// ==========================================
// PROFILE API
// ==========================================

export const profileAPI = {
  /**
   * Update global identity fields (users table)
   */
  updateUserProfile: (
    data: GlobalIdentityUpdate
  ): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.patch('/users/me', data),

  /**
   * Update tenant sub-profile (tenant_sub_profiles table)
   */
  updateTenantProfile: (
    data: TenantProfileUpdate
  ): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.patch('/users/me/tenant-profile', data),

  /**
   * Update buyer sub-profile (buyer_sub_profiles table)
   */
  updateBuyerProfile: (
    data: BuyerProfileUpdate
  ): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.patch('/users/me/buyer-profile', data),

  /**
   * Upload avatar image
   */
  uploadAvatar: (
    file: File
  ): Promise<AxiosResponse<ApiResponse<{ url: string }>>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Get user roles from roles_registry
   */
  getUserRoles: (): Promise<AxiosResponse<ApiResponse<string[]>>> =>
    apiClient.get('/users/me/roles'),
};
