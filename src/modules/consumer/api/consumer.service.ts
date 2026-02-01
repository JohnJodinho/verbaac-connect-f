/**
 * Consumer Service
 * 
 * Mock implementation for Consumer module API calls.
 * Mirrors the structure of landlord.service.ts
 */

import { apiClient } from '@/lib/api';
import type { User } from '@/types/index';

// ============ TYPES ============

export interface ConsumerSignUpPayload {
  // Step 1
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber: string;
  password?: string;
  
  // Step 2
  gender?: 'male' | 'female';
  dateOfBirth?: string;
  userName?: string;
  isStudent?: boolean;
  institution?: string;
  matricNo?: string;
  level?: string;
}

export interface ConsumerAuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface SignInData {
  email: string;
  password?: string;
}

// ============ MOCK DATA ============

const MOCK_DELAY_MS = 800;

const MOCK_CONSUMER_USER: User = {
  id: 'usr_mock_consumer_01',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '+2348000000000',
  gender: 'male', 
  dateOfBirth: '2000-01-01',
  role: 'consumer',
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============ MOCK IMPLEMENTATIONS ============

/**
 * Simulate Sign In
 */
const mockSignIn = async (data: SignInData): Promise<ConsumerAuthResponse> => {
  console.log('[Mock Consumer API] Signing in:', data.email);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data.email === 'test@example.com' || data.email === 'demo@verbaac.com') {
        resolve({
          success: true,
          data: {
            user: MOCK_CONSUMER_USER,
            token: 'mock-jwt-token-consumer-xyz'
          }
        });
      } else {
        // Resolve with success: false to handle error in UI gracefully or reject if prefer try/catch
        // The requirement says "simulate a 401/400 error".
        // Let's resolve with false success for easier UI handling or mimic axios error if needed.
        // User instruction: "simulate a 401/400 error to test error handling in the UI"
        // I'll return a failed response object which the UI service wrapper can handle or throw.
        // However, standard fetch/axios throws on network error, but 401 is a response. 
        // Let's return a success: false object to be consistent with the other mock services returning objects.
        resolve({
          success: false,
          message: 'Invalid credentials. Try test@example.com'
        });
      }
    }, MOCK_DELAY_MS);
  });
};

/**
 * Simulate Sign Up
 */
const mockSignUp = async (data: ConsumerSignUpPayload): Promise<ConsumerAuthResponse> => {
  console.log('[Mock Consumer API] Signing up:', data);

  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a user object from payload
      const newUser: User = {
        id: `usr_${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        gender: data.gender || 'male',
        dateOfBirth: data.dateOfBirth || '2000-01-01',
        role: 'consumer',
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      resolve({
        success: true,
        data: {
            user: newUser,
            token: `mock-jwt-token-${Date.now()}`
        },
        message: 'Account created successfully'
      });
    }, MOCK_DELAY_MS * 1.5);
  });
};

// ============ EXPORTED FUNCTIONS ============

// Toggle Strategy
export const USE_MOCK = true; // Simple toggle

export const consumerService = {
  
  signIn: async (data: SignInData) => {
    if (USE_MOCK) return mockSignIn(data);
    
    // Real API call
    const response = await apiClient.post('/api/v1/auth/login', data);
    return response.data;
  },

  signUp: async (data: ConsumerSignUpPayload) => {
    if (USE_MOCK) return mockSignUp(data);
    
    // Real API call
    const response = await apiClient.post('/api/v1/auth/register/consumer', data);
    return response.data;
  }

};
