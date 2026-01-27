import { apiClient } from '@/lib/api';
import type { AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  ActivityLogItem, 
  PersonaSwitch,
  EscrowTransaction 
} from '@/types';

/**
 * Activity API Service
 * Handles activity logs, persona switches, and transaction audit.
 */
export const activityAPI = {
  // Get activity log
  getActivityLog: (params?: {
    type?: ActivityLogItem['type'];
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<ActivityLogItem>>> =>
    apiClient.get('/activity/logs', { params }),

  // Get persona switch history
  getPersonaSwitches: (params?: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<ApiResponse<PersonaSwitch[]>>> =>
    apiClient.get('/activity/persona-switches', { params }),

  // Get transaction audit (escrow history)
  getTransactionAudit: (params?: {
    status?: EscrowTransaction['status'];
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<EscrowTransaction>>> =>
    apiClient.get('/activity/transactions', { params }),
};

export default activityAPI;
