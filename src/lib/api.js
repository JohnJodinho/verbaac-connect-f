import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('verbaac_auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response interceptor for error handling
apiClient.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('verbaac_auth_token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
// ==========================================
// AUTHENTICATION API
// ==========================================
export const authAPI = {
    // User registration
    register: (userData) => apiClient.post('/auth/register', userData),
    // User login
    login: (credentials) => apiClient.post('/auth/login', credentials),
    // Get current user
    getMe: () => apiClient.get('/auth/me'),
    // Update profile
    updateProfile: (userData) => apiClient.put('/auth/profile', userData),
    // Logout
    logout: () => apiClient.post('/auth/logout'),
};
// ==========================================
// HOUSING API
// ==========================================
export const housingAPI = {
    // Get properties with filtering
    getProperties: (params) => apiClient.get('/housing/properties', { params }),
    // Get single property
    getProperty: (id) => apiClient.get(`/housing/properties/${id}`),
    // Create property (landlords only)
    createProperty: (propertyData) => apiClient.post('/housing/properties', propertyData),
    // Update property
    updateProperty: (id, propertyData) => apiClient.put(`/housing/properties/${id}`, propertyData),
    // Delete property
    deleteProperty: (id) => apiClient.delete(`/housing/properties/${id}`),
    // Contact landlord
    contactLandlord: (id, contactData) => apiClient.post(`/housing/properties/${id}/contact`, contactData),
    // Toggle availability
    toggleAvailability: (id) => apiClient.patch(`/housing/properties/${id}/availability`),
};
// ==========================================
// MARKETPLACE API
// ==========================================
export const marketplaceAPI = {
    // Get items with filtering
    getItems: (params) => apiClient.get('/marketplace/items', { params }),
    // Get single item
    getItem: (id) => apiClient.get(`/marketplace/items/${id}`),
    // Create item
    createItem: (itemData) => apiClient.post('/marketplace/items', itemData),
    // Update item
    updateItem: (id, itemData) => apiClient.put(`/marketplace/items/${id}`, itemData),
    // Delete item
    deleteItem: (id) => apiClient.delete(`/marketplace/items/${id}`),
    // Get categories
    getCategories: () => apiClient.get('/marketplace/categories'),
    // Cart operations
    getCart: () => apiClient.get('/marketplace/cart'),
    addToCart: (itemData) => apiClient.post('/marketplace/cart/add', itemData),
    updateCartItem: (itemId, quantity) => apiClient.put(`/marketplace/cart/${itemId}`, { quantity }),
    removeFromCart: (itemId) => apiClient.delete(`/marketplace/cart/${itemId}`),
    clearCart: () => apiClient.delete('/marketplace/cart'),
    // Favorites
    addToFavorites: (itemId) => apiClient.post(`/marketplace/items/${itemId}/favorite`),
    removeFromFavorites: (itemId) => apiClient.delete(`/marketplace/items/${itemId}/favorite`),
    getFavorites: () => apiClient.get('/marketplace/favorites'),
};
// ==========================================
// DASHBOARD API
// ==========================================
export const dashboardAPI = {
    // Get user statistics
    getStats: () => apiClient.get('/dashboard/stats'),
    // Get recent activity
    getRecentActivity: () => apiClient.get('/dashboard/recent-activity'),
    // Get earnings data
    getEarnings: (period) => apiClient.get('/dashboard/earnings', { params: { period } }),
};
// ==========================================
// SEARCH & NOTIFICATIONS API
// ==========================================
export const searchAPI = {
    // Global search
    search: (params) => apiClient.get('/search', { params }),
    // Search suggestions
    getSuggestions: (q) => apiClient.get('/search/suggestions', { params: { q } }),
};
export const notificationAPI = {
    // Get notifications
    getNotifications: (params) => apiClient.get('/notifications', { params }),
    // Mark as read
    markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
    // Mark all as read
    markAllAsRead: () => apiClient.put('/notifications/mark-all-read'),
    // Delete notification
    deleteNotification: (id) => apiClient.delete(`/notifications/${id}`),
    // Get unread count
    getUnreadCount: () => apiClient.get('/notifications/unread-count'),
};
export default apiClient;
