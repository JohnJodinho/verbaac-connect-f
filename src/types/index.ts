// Core user types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  university?: string;
  studentId?: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'student' | 'landlord' | 'admin';

// Authentication types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  university: string;
  studentId: string;
}

// Housing types
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  amenities: string[];
  rules: string[];
  landlordId: string;
  landlord: User;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExitNotice {
  id: string;
  studentId: string;
  student: User;
  propertyId: string;
  property: Property;
  vacatingDate: string;
  contactInfo: string;
  description: string;
  createdAt: string;
}

// Marketplace types
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: ItemCondition;
  sellerId: string;
  seller: User;
  university: string;
  isAvailable: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ItemCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';

export interface CartItem {
  id: string;
  item: MarketplaceItem;
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  items: CartItem[];
  totalAmount: number;
  escrowStatus: EscrowStatus;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
}

export type EscrowStatus = 'pending' | 'held' | 'released' | 'refunded';
export type DeliveryStatus = 'pending' | 'in-transit' | 'delivered' | 'confirmed';

// Roommate types
export interface RoommatePreferences {
  budget: {
    min: number;
    max: number;
  };
  location: string;
  lifestyle: {
    smokingTolerance: boolean;
    petTolerance: boolean;
    noiseLevel: 'quiet' | 'moderate' | 'lively';
    cleanlinessLevel: 'very-clean' | 'clean' | 'moderate';
  };
  schedule: {
    sleepTime: string;
    wakeTime: string;
    studyHours: string[];
  };
}

export interface RoommateMatch {
  id: string;
  student: User;
  compatibilityScore: number;
  matchedPreferences: string[];
  createdAt: string;
}

// Agreement types
export interface RentalAgreement {
  id: string;
  propertyId: string;
  property: Property;
  studentId: string;
  student: User;
  landlordId: string;
  landlord: User;
  terms: AgreementTerms;
  status: AgreementStatus;
  escrowAmount: number;
  signedAt?: string;
  createdAt: string;
}

export interface AgreementTerms {
  rentAmount: number;
  securityDeposit: number;
  leaseDuration: number; // in months
  startDate: string;
  endDate: string;
  rules: string[];
  utilities: string[];
}

export type AgreementStatus = 'draft' | 'pending-review' | 'pending-signature' | 'signed' | 'active' | 'expired';

// Messaging types
export interface ChatThread {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  sender: User;
  content: string;
  type: MessageType;
  attachments?: string[];
  createdAt: string;
}

export type MessageType = 'text' | 'image' | 'file' | 'system';

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'booking-confirmation'
  | 'new-listing'
  | 'match-suggestion'
  | 'inspection-reminder'
  | 'chat-message'
  | 'agreement-update'
  | 'payment-update';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and Filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
  university?: string;
  condition?: ItemCondition;
  amenities?: string[];
}
