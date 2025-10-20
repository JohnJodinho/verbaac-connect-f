import axios, { AxiosResponse } from 'axios';
import { User, Property, MarketplaceItem, ApiResponse, PaginatedResponse, CartItem } from '../types';

// Add missing types for API responses
interface DashboardActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('verbaac_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('verbaac_auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTHENTICATION API
// ==========================================
export const authAPI = {
  // User registration
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'student' | 'landlord';
    university?: string;
    studentId?: string;
  }): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    apiClient.post('/auth/register', userData),

  // User login
  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    apiClient.post('/auth/login', credentials),

  // Get current user
  getMe: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.get('/auth/me'),

  // Update profile
  updateProfile: (userData: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.put('/auth/profile', userData),

  // Logout
  logout: (): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.post('/auth/logout'),
};

// ==========================================
// HOUSING API
// ==========================================
export const housingAPI = {
  // Get properties with filtering
  getProperties: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string;
    university?: string;
    landlordId?: string;
  }): Promise<AxiosResponse<PaginatedResponse<Property>>> =>
    apiClient.get('/housing/properties', { params }),

  // Get single property
  getProperty: (id: string): Promise<AxiosResponse<ApiResponse<Property>>> =>
    apiClient.get(`/housing/properties/${id}`),

  // Create property (landlords only)
  createProperty: (propertyData: {
    title: string;
    description: string;
    price: number;
    location: string;
    amenities: string[];
    rules: string[];
    images?: string[];
  }): Promise<AxiosResponse<ApiResponse<Property>>> =>
    apiClient.post('/housing/properties', propertyData),

  // Update property
  updateProperty: (id: string, propertyData: Partial<Property>): Promise<AxiosResponse<ApiResponse<Property>>> =>
    apiClient.put(`/housing/properties/${id}`, propertyData),

  // Delete property
  deleteProperty: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.delete(`/housing/properties/${id}`),

  // Contact landlord
  contactLandlord: (id: string, contactData: {
    message: string;
    phone: string;
    preferredTime: string;
  }): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.post(`/housing/properties/${id}/contact`, contactData),

  // Toggle availability
  toggleAvailability: (id: string): Promise<AxiosResponse<ApiResponse<Property>>> =>
    apiClient.patch(`/housing/properties/${id}/availability`),
};

// ==========================================
// MARKETPLACE API
// ==========================================
export const marketplaceAPI = {
  // Get items with filtering
  getItems: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    university?: string;
    sellerId?: string;
  }): Promise<AxiosResponse<PaginatedResponse<MarketplaceItem>>> =>
    apiClient.get('/marketplace/items', { params }),

  // Get single item
  getItem: (id: string): Promise<AxiosResponse<ApiResponse<MarketplaceItem>>> =>
    apiClient.get(`/marketplace/items/${id}`),

  // Create item
  createItem: (itemData: {
    title: string;
    description: string;
    price: number;
    category: string;
    condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
    university: string;
    images?: string[];
    tags?: string[];
  }): Promise<AxiosResponse<ApiResponse<MarketplaceItem>>> =>
    apiClient.post('/marketplace/items', itemData),

  // Update item
  updateItem: (id: string, itemData: Partial<MarketplaceItem>): Promise<AxiosResponse<ApiResponse<MarketplaceItem>>> =>
    apiClient.put(`/marketplace/items/${id}`, itemData),

  // Delete item
  deleteItem: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.delete(`/marketplace/items/${id}`),

  // Get categories
  getCategories: (): Promise<AxiosResponse<ApiResponse<string[]>>> =>
    apiClient.get('/marketplace/categories'),

  // Cart operations
  getCart: (): Promise<AxiosResponse<ApiResponse<CartItem[]>>> =>
    apiClient.get('/marketplace/cart'),

  addToCart: (itemData: {
    itemId: string;
    quantity: number;
  }): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.post('/marketplace/cart/add', itemData),

  updateCartItem: (itemId: string, quantity: number): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.put(`/marketplace/cart/${itemId}`, { quantity }),

  removeFromCart: (itemId: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.delete(`/marketplace/cart/${itemId}`),

  clearCart: (): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.delete('/marketplace/cart'),

  // Favorites
  addToFavorites: (itemId: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.post(`/marketplace/items/${itemId}/favorite`),

  removeFromFavorites: (itemId: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.delete(`/marketplace/items/${itemId}/favorite`),

  getFavorites: (): Promise<AxiosResponse<ApiResponse<MarketplaceItem[]>>> =>
    apiClient.get('/marketplace/favorites'),
};

// ==========================================
// DASHBOARD API
// ==========================================
export const dashboardAPI = {
  // Get user statistics
  getStats: (): Promise<AxiosResponse<ApiResponse<{
    totalProperties: number;
    totalEarnings: number;
    totalViews: number;
    activeListings: number;
  }>>> =>
    apiClient.get('/dashboard/stats'),

  // Get recent activity
  getRecentActivity: (): Promise<AxiosResponse<ApiResponse<DashboardActivity[]>>> =>
    apiClient.get('/dashboard/recent-activity'),

  // Get earnings data
  getEarnings: (period?: 'week' | 'month' | 'year'): Promise<AxiosResponse<ApiResponse<{
    total: number;
    growth: number;
    data: Array<{ date: string; amount: number }>;
  }>>> =>
    apiClient.get('/dashboard/earnings', { params: { period } }),
};

// ==========================================
// SEARCH & NOTIFICATIONS API
// ==========================================
export const searchAPI = {
  // Global search
  search: (params: {
    q: string;
    type?: 'all' | 'housing' | 'marketplace' | 'users';
  }): Promise<AxiosResponse<ApiResponse<{
    housing: Property[];
    marketplace: MarketplaceItem[];
    users: Partial<User>[];
    counts: {
      housing: number;
      marketplace: number;
      users: number;
    };
  }>>> =>
    apiClient.get('/search', { params }),

  // Search suggestions
  getSuggestions: (q: string): Promise<AxiosResponse<ApiResponse<string[]>>> =>
    apiClient.get('/search/suggestions', { params: { q } }),
};

export const notificationAPI = {
  // Get notifications
  getNotifications: (params?: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<{
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }>>> =>
    apiClient.get('/notifications', { params }),

  // Mark as read
  markAsRead: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.put(`/notifications/${id}/read`),

  // Mark all as read
  markAllAsRead: (): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.put('/notifications/mark-all-read'),

  // Delete notification
  deleteNotification: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.delete(`/notifications/${id}`),

  // Get unread count
  getUnreadCount: (): Promise<AxiosResponse<ApiResponse<{ count: number }>>> =>
    apiClient.get('/notifications/unread-count'),
};

export default apiClient;
