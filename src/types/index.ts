// Core user types
// This is the (stubbed) User interface, as referenced by Property
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber: string;
  gender: 'male' | 'female';
  dateOfBirth: string; // ISO Date string
  userName?: string; // Optional for now as legacy users might not have it
  profilePhotoUrl?: string;
  role: RoleType; // Primary/Active role logic might need adjustment, but keeping for now
  isVerified: boolean;
  
  // Student/Tenant Profile (Optional)
  studentProfile?: {
    institution: string;
    matricNo: string;
    level: number;
    preferredZones?: string[];
  } | null;

  createdAt: string;
  updatedAt: string;
}

// This is the existing Property 
export interface Property {
  id: string;
  title: string;
  propertyType: string;
  rent: {
    amount: number;
    currency: 'NGN';
    duration: 'Yearly' | 'Monthly' | 'Semester';
  };
  location: {
    address: string;
    googlePin?: string; // Optional Google Maps link
    geoLocation?: {
        lat: number;
        lng: number;
    };
  };
  rating: {
    average: number;
    reviewCount: number;
  };
  landlord: {
    name: string;
    verified: boolean;
    id: string; // Added landlord ID
  };
  availability: 'Available' | 'Taken' | 'Pending';
  topAmenities: string[];
  thumbnailImage: string;
  images: string[];
  lastUpdated: string;
  highlighted: boolean;
  description: string;
  rules: string[];
}

// --- NEWLY ADDED ---
// The comprehensive type for the Property Details page
export interface PropertyDetail extends Property {
  // --- Physical Property Information ---
  dimensions: {
    roomSize: string; // e.g. "12x14 ft"
    totalArea?: string; // optional total size (sqm)
    floorLevel?: string; // e.g. "Ground floor", "1st floor"
  };

  bathroom: {
    type: 'Private' | 'Shared';
    count?: number;
  };

  kitchen: {
    access: 'Private' | 'Shared' | 'None';
    hasSink?: boolean;
  };

  utilities: {
    water: boolean;
    electricity: boolean;
    wasteDisposal: boolean;
    internet?: boolean;
    prepaidMeter?: boolean;
    others?: string[];
  };

  security: {
    gated: boolean;
    fenced: boolean;
    securityGuard?: boolean;
    streetLight?: boolean;
    neighborhoodWatch?: boolean;
    cctv?: boolean;
  };

  proximity: {
    toCampus: string; // e.g. "10 mins walk to UNIJOS Main Gate"
    toMarket?: string; // e.g. "5 mins to Terminus Market"
    toBusStop?: string; // e.g. "2 mins walk"
  };

  // --- Media & Virtual Experience ---
  media: {
    videoTour?: string; // Video URL
    view360?: string; // Link to 360° image
    mapEmbed?: string; // Embed map or Google Map link
  };

  // --- Additional Metadata ---
  metadata: {
    propertyCode: string; // Internal tracking e.g. VC-HS-2025-001
    verifiedDate: string; // e.g. "2025-10-20"
    viewsCount?: number;
    featured?: boolean;
  };

  // --- Landlord / Agent Contact & Engagement ---
  // Override the landlord type from base Property
  landlord: {
    name: string;
    verified: boolean;
    id: string;
    contactNumber?: string;
    whatsapp?: string;
    email?: string;
    agencyName?: string;
    profileImage?: string;
    description?: string; // short bio or intro
  };

  // --- Ratings & Reviews ---
  reviews: {
    cleanliness: number;
    safety: number;
    power: number;
    water: number;
    value: number;
  };
  reviewList: Array<{
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;

  // --- Social & Interaction ---
  roommates?: Array<{
    id: string;
    name: string;
    gender?: 'Male' | 'Female' | 'Other';
    contact?: string;
    availability: boolean;
  }>;

  nearbyFacilities?: Array<{
    name: string;
    type: 'Market' | 'Eatery' | 'Pharmacy' | 'Hospital' | 'Shop' | 'ATM' | 'Bus Stop';
    distance: string; // e.g. "3 mins walk"
    googleMapLink?: string;
  }>;

  // --- Environmental Ratings ---
  environment: {
    noiseLevel: 'Low' | 'Moderate' | 'High';
    powerSupplyRating: number; // 1-5
    waterAvailabilityRating: number; // 1-5
  };

  // --- Payment & Rental Terms ---
  paymentTerms: {
    frequency: 'Yearly' | 'Monthly' | 'Semester';
    negotiable: boolean;
    depositRequired?: boolean;
    depositAmount?: number;
  };

  // --- Rules & Additional Info ---
  additionalNotes?: string;
}

export type UserRole = 'consumer' | 'seller' | 'landlord' | 'agent' | 'ambassador' | 'admin';
export type RoleType = UserRole; // Alias for clarity

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

export type ItemCondition = 'New' | 'Used' | 'Refurbished';

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

// Wallet & Escrow types
export interface Wallet {
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  currency: 'NGN';
}

export interface EscrowTransaction {
  id: string;
  transactionRef: string;
  amount: number;
  status: 'held' | 'released' | 'disputed';
  listingId?: string;
  itemId?: string;
  payerId: string;
  payerName?: string;
  description?: string;
  platformFee: number;
  netAmount: number;
  createdAt: string;
}

export interface PayoutSplit {
  recipientId: string;
  amount: number;
  splitType: 'landlord_88' | 'agent_3' | 'ambassador_2' | 'verbaac_7' | 'verbaac_10';
}

// Session types
export interface UserSession {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  location: string;
  ipAddress: string;
  browser?: string;
  loginAt: string;
  isCurrent: boolean;
}

// Activity types
export interface PersonaSwitch {
  id: string;
  fromRole: RoleType;
  toRole: RoleType;
  switchedAt: string;
}

export interface ActivityLogItem {
  id: string;
  type: 'persona_switch' | 'transaction' | 'profile_update' | 'login' | 'escrow';
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// Rewards types
export interface TrustScore {
  score: number;
  maxScore: number;
  factors: {
    successfulTransactions: number;
    confirmedMoveIns: number;
    profileCompleteness: number;
    verificationStatus: number;
  };
}

export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  successfulReferrals: number;
  pendingRewards: number;
  earnedRewards: number;
}

// Bank Account type
export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isPrimary: boolean;
  createdAt: string;
}

// Password Update type
export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Seller Profile type
export interface SellerProfile {
  displayId: string;         // SLR-YEAR-SEQ format
  userName: string;          // Unique seller handle
  profilePhotoUrl?: string;
  bankDetails: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
  isVerified: boolean;
  createdAt: string;
}
