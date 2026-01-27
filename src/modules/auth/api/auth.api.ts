import { apiClient } from '@/lib/api';
import type { ApiResponse, User } from '@/types';
import type { Step1Data, Step2Data } from '../schemas/registration';

export type RegistrationData = Step1Data & Step2Data;

export const authApi = {
  registerConsumer: async (data: RegistrationData) => {
    // Transform data if necessary (e.g. combine step1 and step2)
    // The backend expects a flat object or specific structure. 
    // Sending the combined data object.
    return apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/register/consumer', data);
  }
};
